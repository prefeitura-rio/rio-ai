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

const apiKey = process.env.RIO_API_KEY;
const apiUrl =
  process.env.RIO_API_URL ?? 'https://rio-api-test.onrender.com/v1/chat/completions';
const allowedOrigins = parseAllowedOrigins(process.env.RIO_ALLOWED_ORIGINS);
const validationConfig = buildValidationConfig(process.env);

const upstreamTimeoutMs = parsePositiveInt(
  process.env.RIO_UPSTREAM_TIMEOUT_MS,
  30000,
  {
    min: 1000,
    max: 120000,
  }
);

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

const setRateLimitHeaders = (res, rateResult) => {
  res.setHeader('X-RateLimit-Limit', String(rateResult.limit));
  res.setHeader('X-RateLimit-Remaining', String(rateResult.remaining));
  if (typeof rateResult.resetMs === 'number') {
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(rateResult.resetMs / 1000)));
  }
};

export default async function handler(req, res) {
  const sourceValidation = validateRequestSource(req.headers, allowedOrigins);
  setCommonApiHeaders(res, sourceValidation.ok ? sourceValidation.origin : null);

  if (req.method === 'OPTIONS') {
    if (!sourceValidation.ok) {
      return res.status(403).json({ error: sourceValidation.error });
    }
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  if (!sourceValidation.ok) {
    return res.status(403).json({ error: sourceValidation.error });
  }

  if (!apiKey) {
    console.error('RIO_API_KEY ausente.');
    return res.status(500).json({
      error: 'Configuração inválida no servidor: RIO_API_KEY ausente.',
    });
  }

  const rateKey = `${getClientIp(req)}:${sourceValidation.origin}`;
  const rateResult = rateLimiter(rateKey);
  setRateLimitHeaders(res, rateResult);

  if (!rateResult.allowed) {
    res.setHeader('Retry-After', String(Math.ceil(rateResult.retryAfterMs / 1000)));
    return res.status(429).json({
      error: 'Limite de requisições excedido. Tente novamente em instantes.',
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
    return res.status(response.status).json(data);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(504).json({
        error: 'Timeout ao consultar o serviço de IA.',
      });
    }

    console.error('Erro ao consultar upstream:', error);
    return res.status(502).json({
      error: 'Falha ao se comunicar com o serviço Rio API.',
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
