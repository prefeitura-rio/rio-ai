const DEFAULT_ALLOWED_ORIGINS = new Set([
  'https://ia.rio',
  'https://ai.rio',
  'http://ia.rio',
  'http://ai.rio',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

const VALID_ROLES = new Set(['system', 'user', 'assistant']);

const getHeaderValue = (headers, name) => {
  if (!headers) return undefined;
  const direct = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(direct)) {
    return direct[0];
  }
  return typeof direct === 'string' ? direct : undefined;
};

const normalizeOrigin = (value) => {
  if (!value || typeof value !== 'string') return null;
  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch {
    return null;
  }
};

const extractRefererOrigin = (referer) => {
  if (!referer || typeof referer !== 'string') return null;
  try {
    const parsed = new URL(referer);
    return normalizeOrigin(`${parsed.protocol}//${parsed.host}`);
  } catch {
    return null;
  }
};

const parseCsvList = (value) => {
  if (!value || typeof value !== 'string') return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const parsePositiveInt = (value, fallback, limits = {}) => {
  const { min = 1, max = Number.MAX_SAFE_INTEGER } = limits;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    return fallback;
  }
  return parsed;
};

export const parseAllowedOrigins = (rawValue) => {
  const parsed = parseCsvList(rawValue)
    .map((origin) => normalizeOrigin(origin))
    .filter((origin) => Boolean(origin));

  if (parsed.length > 0) {
    return new Set(parsed);
  }

  return new Set(DEFAULT_ALLOWED_ORIGINS);
};

export const parseAllowedModels = (rawValue) => {
  const parsed = parseCsvList(rawValue);
  if (parsed.length === 0) {
    return null;
  }
  return new Set(parsed);
};

export const validateRequestSource = (headers, allowedOrigins) => {
  const originHeader = getHeaderValue(headers, 'origin');
  const refererHeader = getHeaderValue(headers, 'referer');
  const normalizedOrigin = normalizeOrigin(originHeader);
  const normalizedRefererOrigin = extractRefererOrigin(refererHeader);

  if (normalizedOrigin && allowedOrigins.has(normalizedOrigin)) {
    if (
      normalizedRefererOrigin &&
      normalizedRefererOrigin !== normalizedOrigin
    ) {
      return {
        ok: false,
        error: 'Origem e referer divergentes.',
      };
    }
    return {
      ok: true,
      origin: normalizedOrigin,
    };
  }

  if (normalizedRefererOrigin && allowedOrigins.has(normalizedRefererOrigin)) {
    return {
      ok: true,
      origin: normalizedRefererOrigin,
    };
  }

  return {
    ok: false,
    error: 'Origem não permitida.',
  };
};

export const setCommonApiHeaders = (res, allowedOrigin) => {
  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, X-Requested-With, X-Session-Id'
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
};

export const estimateJsonBytes = (value) => {
  try {
    return Buffer.byteLength(JSON.stringify(value), 'utf8');
  } catch {
    return Number.MAX_SAFE_INTEGER;
  }
};

export const getClientIp = (req) => {
  const headers = req?.headers ?? {};
  const forwardedFor = getHeaderValue(headers, 'x-forwarded-for');
  const realIp = getHeaderValue(headers, 'x-real-ip');

  const forwardedCandidate = forwardedFor
    ? forwardedFor.split(',')[0]?.trim()
    : null;
  const fallbackIp =
    req?.ip ??
    req?.socket?.remoteAddress ??
    req?.connection?.remoteAddress ??
    null;
  const ip = forwardedCandidate || realIp || fallbackIp || 'unknown';

  return ip.replace(/^::ffff:/, '');
};

export const createRateLimiter = ({
  windowMs,
  maxRequests,
  blockMs,
  maxEntries = 5000,
}) => {
  const store = new Map();

  const cleanup = (now) => {
    if (store.size <= maxEntries) return;
    for (const [key, entry] of store) {
      const windowExpired = now - entry.windowStart > windowMs;
      const blockExpired = entry.blockedUntil > 0 && now >= entry.blockedUntil;
      if (windowExpired && (entry.blockedUntil === 0 || blockExpired)) {
        store.delete(key);
      }
      if (store.size <= maxEntries) {
        break;
      }
    }
  };

  return (key) => {
    const now = Date.now();
    cleanup(now);

    const currentKey = key || 'unknown';
    const existing = store.get(currentKey);
    const baseState = existing ?? {
      windowStart: now,
      count: 0,
      blockedUntil: 0,
    };

    const state = { ...baseState };
    const windowExpired = now - state.windowStart >= windowMs;

    if (windowExpired) {
      state.windowStart = now;
      state.count = 0;
    }

    if (state.blockedUntil > now) {
      return {
        allowed: false,
        retryAfterMs: state.blockedUntil - now,
        limit: maxRequests,
        remaining: 0,
      };
    }

    state.blockedUntil = 0;
    state.count += 1;

    if (state.count > maxRequests) {
      state.blockedUntil = now + blockMs;
      store.set(currentKey, state);
      return {
        allowed: false,
        retryAfterMs: blockMs,
        limit: maxRequests,
        remaining: 0,
      };
    }

    store.set(currentKey, state);
    const resetMs = Math.max(0, state.windowStart + windowMs - now);

    return {
      allowed: true,
      retryAfterMs: 0,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - state.count),
      resetMs,
    };
  };
};

const isValidModel = (model, maxModelLength) =>
  typeof model === 'string' &&
  model.length > 0 &&
  model.length <= maxModelLength &&
  /^[a-zA-Z0-9._:-]+$/.test(model);

const isAllowedUrl = (value) => {
  if (typeof value !== 'string' || value.length === 0) return false;
  if (value.startsWith('data:image/')) {
    return true;
  }
  try {
    const parsed = new URL(value);
    if (parsed.protocol === 'https:') {
      return true;
    }
    if (
      parsed.protocol === 'http:' &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const buildValidationConfig = (env) => {
  const maxBodyBytes = parsePositiveInt(
    env.RIO_MAX_BODY_BYTES,
    50 * 1024 * 1024,
    { min: 1024, max: 100 * 1024 * 1024 }
  );

  return {
    maxBodyBytes,
    maxMessages: parsePositiveInt(env.RIO_MAX_MESSAGES, 100, {
      min: 1,
      max: 100,
    }),
    maxMessageChars: parsePositiveInt(env.RIO_MAX_MESSAGE_CHARS, 200000, {
      min: 200,
      max: 200000,
    }),
    maxTotalChars: parsePositiveInt(env.RIO_MAX_TOTAL_CHARS, 1000000, {
      min: 1000,
      max: 1000000,
    }),
    maxBlocksPerMessage: parsePositiveInt(
      env.RIO_MAX_BLOCKS_PER_MESSAGE,
      50,
      { min: 1, max: 50 }
    ),
    maxAttachmentChars: parsePositiveInt(
      env.RIO_MAX_ATTACHMENT_CHARS,
      20000000,
      { min: 1000, max: 20000000 }
    ),
    maxModelLength: parsePositiveInt(env.RIO_MAX_MODEL_LENGTH, 200, {
      min: 8,
      max: 200,
    }),
    allowedModels: parseAllowedModels(env.RIO_ALLOWED_MODELS),
  };
};

const sanitizeMessageContent = (content, config, tracker) => {
  if (typeof content === 'string') {
    if (content.length > config.maxMessageChars) {
      return {
        ok: false,
        error: `Uma mensagem excede o limite de ${config.maxMessageChars} caracteres.`,
      };
    }
    tracker.totalChars += content.length;
    return {
      ok: true,
      content,
    };
  }

  if (!Array.isArray(content)) {
    return {
      ok: false,
      error: 'Formato de conteúdo inválido.',
    };
  }

  if (content.length === 0 || content.length > config.maxBlocksPerMessage) {
    return {
      ok: false,
      error: `Blocos por mensagem devem estar entre 1 e ${config.maxBlocksPerMessage}.`,
    };
  }

  const blocks = [];

  for (const block of content) {
    if (!block || typeof block !== 'object' || typeof block.type !== 'string') {
      return {
        ok: false,
        error: 'Bloco de conteúdo inválido.',
      };
    }

    if (block.type === 'text') {
      const text = block.text;
      if (typeof text !== 'string' || text.length > config.maxMessageChars) {
        return {
          ok: false,
          error: `Bloco de texto excede o limite de ${config.maxMessageChars} caracteres.`,
        };
      }
      tracker.totalChars += text.length;
      blocks.push({ type: 'text', text });
      continue;
    }

    if (block.type === 'image_url') {
      const url = block.image_url?.url;
      if (!isAllowedUrl(url) || url.length > config.maxAttachmentChars) {
        return {
          ok: false,
          error: 'URL de imagem inválida ou muito grande.',
        };
      }
      tracker.totalChars += url.length;
      blocks.push({ type: 'image_url', image_url: { url } });
      continue;
    }

    if (block.type === 'file') {
      const filename = block.file?.filename;
      const fileData = block.file?.file_data;
      if (
        typeof filename !== 'string' ||
        filename.length === 0 ||
        filename.length > 255
      ) {
        return {
          ok: false,
          error: 'Nome de arquivo inválido.',
        };
      }

      if (
        typeof fileData !== 'string' ||
        fileData.length === 0 ||
        fileData.length > config.maxAttachmentChars ||
        !fileData.startsWith('data:')
      ) {
        return {
          ok: false,
          error: 'Anexo inválido ou muito grande.',
        };
      }

      tracker.totalChars += fileData.length;
      blocks.push({
        type: 'file',
        file: {
          filename,
          file_data: fileData,
        },
      });
      continue;
    }

    return {
      ok: false,
      error: 'Tipo de bloco não permitido.',
    };
  }

  return {
    ok: true,
    content: blocks,
  };
};

export const validateChatPayload = (payload, config) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {
      ok: false,
      error: 'Payload inválido.',
    };
  }

  if (!isValidModel(payload.model, config.maxModelLength)) {
    return {
      ok: false,
      error: 'Model inválido.',
    };
  }

  if (config.allowedModels && !config.allowedModels.has(payload.model)) {
    return {
      ok: false,
      error: 'Model não permitido.',
    };
  }

  if (!Array.isArray(payload.messages)) {
    return {
      ok: false,
      error: 'messages deve ser um array.',
    };
  }

  if (payload.messages.length === 0 || payload.messages.length > config.maxMessages) {
    return {
      ok: false,
      error: `Quantidade de mensagens deve estar entre 1 e ${config.maxMessages}.`,
    };
  }

  if (payload.stream === true) {
    return {
      ok: false,
      error: 'stream=true não é suportado neste endpoint.',
    };
  }

  const tracker = { totalChars: 0 };
  const sanitizedMessages = [];

  for (const message of payload.messages) {
    if (!message || typeof message !== 'object' || Array.isArray(message)) {
      return {
        ok: false,
        error: 'Mensagem inválida.',
      };
    }

    if (!VALID_ROLES.has(message.role)) {
      return {
        ok: false,
        error: 'Role inválida em messages.',
      };
    }

    const contentValidation = sanitizeMessageContent(
      message.content,
      config,
      tracker
    );

    if (!contentValidation.ok) {
      return contentValidation;
    }

    sanitizedMessages.push({
      role: message.role,
      content: contentValidation.content,
    });
  }

  if (tracker.totalChars > config.maxTotalChars) {
    return {
      ok: false,
      error: `O conteúdo total excede ${config.maxTotalChars} caracteres.`,
    };
  }

  const sanitizedPayload = {
    model: payload.model,
    messages: sanitizedMessages,
    stream: false,
  };

  if (
    typeof payload.temperature === 'number' &&
    Number.isFinite(payload.temperature) &&
    payload.temperature >= 0 &&
    payload.temperature <= 2
  ) {
    sanitizedPayload.temperature = payload.temperature;
  }

  if (
    typeof payload.top_p === 'number' &&
    Number.isFinite(payload.top_p) &&
    payload.top_p >= 0 &&
    payload.top_p <= 1
  ) {
    sanitizedPayload.top_p = payload.top_p;
  }

  if (
    typeof payload.max_tokens === 'number' &&
    Number.isInteger(payload.max_tokens) &&
    payload.max_tokens > 0 &&
    payload.max_tokens <= 8192
  ) {
    sanitizedPayload.max_tokens = payload.max_tokens;
  }

  return {
    ok: true,
    payload: sanitizedPayload,
  };
};

export const parseUpstreamJson = async (response) => {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {
      error: 'Resposta inválida do serviço upstream.',
    };
  }
};
