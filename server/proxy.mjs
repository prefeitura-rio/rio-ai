import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import {
  buildValidationConfig,
  createRateLimiter,
  estimateJsonBytes,
  getClientIp,
  parseAllowedOrigins,
  parsePositiveInt,
  parseUpstreamJson,
  setCommonApiHeaders,
  validateChatPayload,
  validateRequestSource,
} from '../lib/chatSecurity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.cwd();

dotenv.config({
  path: path.resolve(projectRoot, '.env.local'),
});

// Fallback para .env se .env.local não existir
dotenv.config();

const app = express();
const port = process.env.RIO_PROXY_PORT ? Number(process.env.RIO_PROXY_PORT) : 3001;
const apiUrl =
  process.env.RIO_API_URL ?? 'https://rio-api-test.onrender.com/v1/chat/completions';
const apiKey = process.env.RIO_API_KEY;
const allowedOrigins = parseAllowedOrigins(process.env.RIO_ALLOWED_ORIGINS);
const validationConfig = buildValidationConfig(process.env);
const upstreamTimeoutMs = parsePositiveInt(process.env.RIO_UPSTREAM_TIMEOUT_MS, 1200000, {
  min: 1000,
  max: 1200000,
});

const rateLimiter = createRateLimiter({
  windowMs: parsePositiveInt(process.env.RIO_RATE_LIMIT_WINDOW_MS, 86400000, {
    min: 1000,
    max: 86400000,
  }),
  maxRequests: parsePositiveInt(process.env.RIO_RATE_LIMIT_MAX, 10, {
    min: 1,
    max: 500,
  }),
  blockMs: parsePositiveInt(process.env.RIO_RATE_LIMIT_BLOCK_MS, 86400000, {
    min: 1000,
    max: 86400000,
  }),
});

const maxBodyLimitMb = Math.max(1, Math.ceil(validationConfig.maxBodyBytes / (1024 * 1024)));

if (!apiKey) {
  console.warn(
    '[proxy] Atenção: defina RIO_API_KEY no arquivo .env.local para que o proxy injete a credencial.'
  );
}

if (!process.env.RIO_ALLOWED_ORIGINS) {
  console.warn(
    '[proxy] RIO_ALLOWED_ORIGINS não definido. Usando allowlist padrão de localhost para desenvolvimento.'
  );
}

app.disable('x-powered-by');
app.use(express.json({ limit: `${maxBodyLimitMb}mb` }));

app.use((error, req, res, next) => {
  if (error?.type === 'entity.too.large') {
    return res.status(413).json({
      error: `Payload excede o limite de ${validationConfig.maxBodyBytes} bytes.`,
    });
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      error: 'JSON inválido na requisição.',
    });
  }

  return next(error);
});

const setRateLimitHeaders = (res, rateResult) => {
  res.setHeader('X-RateLimit-Limit', String(rateResult.limit));
  res.setHeader('X-RateLimit-Remaining', String(rateResult.remaining));
  if (typeof rateResult.resetMs === 'number') {
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(rateResult.resetMs / 1000)));
  }
};

app.use('/api/chat', (req, res, next) => {
  const sourceValidation = validateRequestSource(req.headers, allowedOrigins);
  setCommonApiHeaders(res, sourceValidation.ok ? sourceValidation.origin : null);

  if (req.method === 'OPTIONS') {
    if (!sourceValidation.ok) {
      return res.status(403).json({ error: sourceValidation.error });
    }
    return res.status(204).end();
  }

  if (!sourceValidation.ok) {
    return res.status(403).json({ error: sourceValidation.error });
  }

  req.allowedOrigin = sourceValidation.origin;
  return next();
});

app.use('/api/chat', (req, res, next) => {
  const rateKey = `${getClientIp(req)}:${req.allowedOrigin ?? 'unknown'}`;
  const rateResult = rateLimiter(rateKey);
  setRateLimitHeaders(res, rateResult);

  if (!rateResult.allowed) {
    res.setHeader('Retry-After', String(Math.ceil(rateResult.retryAfterMs / 1000)));
    return res.status(429).json({
      error: 'Limite de requisições excedido. Tente novamente em instantes.',
    });
  }

  return next();
});

// Serve static files from dist/ directory (production only)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(projectRoot, 'dist');
  app.use(express.static(distPath));
}

app.post('/api/chat', async (req, res) => {
  if (!apiKey) {
    return res.status(500).json({
      error: 'RIO_API_KEY não está configurada no proxy.',
    });
  }

  const bodyBytes = estimateJsonBytes(req.body);
  if (bodyBytes > validationConfig.maxBodyBytes) {
    return res.status(413).json({
      error: `Payload excede o limite de ${validationConfig.maxBodyBytes} bytes.`,
    });
  }

  const payloadValidation = validateChatPayload(req.body, validationConfig);
  if (!payloadValidation.ok) {
    return res.status(400).json({ error: payloadValidation.error });
  }

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), upstreamTimeoutMs);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payloadValidation.payload),
      signal: timeoutController.signal,
    });

    const data = await parseUpstreamJson(response);
    res.status(response.status).json(data);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(504).json({
        error: 'Timeout ao consultar o serviço de IA.',
      });
    }

    console.error('[proxy] Erro ao encaminhar requisição:', error);
    res.status(502).json({
      error: 'Falha ao se comunicar com o serviço Rio API.',
    });
  } finally {
    clearTimeout(timeoutId);
  }
});

app.all('/api/chat', (req, res) => {
  res.setHeader('Allow', 'POST, OPTIONS');
  return res.status(405).json({ error: 'Método não permitido.' });
});

// SPA fallback - serve index.html for all other routes (production only)
if (process.env.NODE_ENV === 'production') {
  app.use((_req, res) => {
    res.sendFile(path.resolve(projectRoot, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`[proxy] Servidor iniciado em http://localhost:${port}`);
});
