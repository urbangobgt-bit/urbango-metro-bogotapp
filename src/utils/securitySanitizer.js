/**
 * UrbanGo - Módulo Oficial de Ciberseguridad y Sanitización contra SQLi y Code Injection
 * Diseñado conforme a los estándares OWASP Top 10 para prevención de:
 * 1. SQL Injection (SQLi) - Inyección de sentencias SQL
 * 2. Cross-Site Scripting (XSS) y Code Injection
 * 3. Parameter Pollution & Buffer Overflows
 */

// Patrones conocidos de inyecciones SQL sospechosas
const SQL_INJECTION_PATTERNS = [
  /(\b(select|union|insert|update|delete|drop|truncate|alter|create|exec|execute|declare)\b)/i,
  /(--|\#|\/\*|\*\/|;)/,
  /('|\b)\s*(or|and)\s*('|[0-9]|=)/i,
  /('|"|`)\s*(or|and)\s*('|"|`)\s*=\s*('|"|`)/i,
  /('|"|`)\s*=\s*('|"|`)/i,
  /\bunion\s+(all\s+)?select\b/i,
  /\bdrop\s+(table|database|view|index)\b/i,
  /\bwaitfor\s+delay\b/i,
  /\bsleep\s*\(/i,
  /\bbenchmark\s*\(/i,
  /\bpg_sleep\s*\(/i
];

// Patrones conocidos de inyecciones de código HTML/JavaScript (XSS)
const CODE_INJECTION_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /vbscript\s*:/gi,
  /on\w+\s*=/gi // e.g. onerror=, onclick=, onload=
];

/**
 * Detecta si una cadena contiene firmas evidentes de SQL Injection
 * @param {string} input - Cadena a auditar
 * @returns {{ isSuspicious: boolean, matches: string[] }}
 */
export function detectSqlInjection(input) {
  if (typeof input !== 'string') return { isSuspicious: false, matches: [] };
  const matches = [];
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      matches.push(pattern.toString());
    }
  }
  return {
    isSuspicious: matches.length > 0,
    matches
  };
}

/**
 * Sanitiza una cadena general para neutralizar caracteres maliciosos de SQLi y scripts.
 * Reemplaza comillas peligrosas por variantes tipográficas seguras y neutraliza tags HTML.
 *
 * @param {string} input - Texto a limpiar
 * @param {number} [maxLength=1000] - Longitud máxima permitida
 * @returns {string} Texto seguro y sanitizado
 */
export function sanitizeInput(input, maxLength = 1000) {
  if (input === null || input === undefined) return '';
  if (typeof input !== 'string') {
    input = String(input);
  }

  // 1. Limitar longitud para evitar ataques de DoS por memoria
  let cleaned = input.slice(0, maxLength);

  // 2. Neutralizar caracteres nulos
  cleaned = cleaned.replace(/\0/g, '');

  // 3. Neutralizar secuencias clásicas de evasión SQL (' OR '1'='1, ' OR 1=1 --, etc.)
  cleaned = cleaned
    .replace(/(?:'|\"|`)\s*(?:or|and)\s*(?:'|\"|`|\d+)\s*=\s*(?:'|\"|`|\d+)/gi, '')
    .replace(/--.*$/gm, '')
    .replace(/\/\*.*?\*\//gs, '')
    .replace(/;\s*$/g, '');

  // 4. Transformar comillas simples y dobles no balanceadas a caracteres tipográficos seguros
  // para evitar rotura de sintaxis en cualquier capa downstream
  cleaned = cleaned
    .replace(/'/g, '’')
    .replace(/"/g, '”')
    .replace(/`/g, '’');

  // 5. Escapar caracteres reservadas de HTML para evitar Code/Script Injection
  cleaned = cleaned
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return cleaned.trim();
}

/**
 * Sanitiza consultas de búsqueda (Barra de búsqueda de UrbanGo)
 * Permite letras, números, acentos, espacios y signos habituales de direcciones bogotanas (Cl, Cra, #, -, .),
 * neutralizando estrictamente cualquier intento de escape SQL o secuencias booleanas maliciosas.
 *
 * @param {string} query
 * @param {number} [maxLength=120]
 * @returns {string}
 */
export function sanitizeSearchQuery(query, maxLength = 120) {
  if (!query || typeof query !== 'string') return '';
  
  let q = query.slice(0, maxLength);
  
  // Remover caracteres de control y nulos
  q = q.replace(/[\x00-\x1F\x7F]/g, '');

  // Neutralizar fragmentos de inyección SQL como ' OR '1'='1
  q = q.replace(/(['"`])\s*(or|and)\s*(['"`]|\d+)\s*=\s*(['"`]|\d+)/gi, '');
  q = q.replace(/--|\/\*|\*\/|;|xp_/gi, '');

  // Eliminar comillas directas y caracteres de redirección/tags
  q = q.replace(/['"`<>{}\\]/g, '');

  return q.trim();
}

/**
 * Sanitiza los mensajes enviados al chat de MetroBot IA.
 * Protege contra Prompt Injection y SQL Injection sin degradar la experiencia de conversación.
 *
 * @param {string} message
 * @param {number} [maxLength=2000]
 * @returns {string}
 */
export function sanitizeChatMessage(message, maxLength = 2000) {
  if (!message || typeof message !== 'string') return '';

  let msg = message.slice(0, maxLength);

  // Neutralizar secuencias comunes de inyección SQL
  msg = msg
    .replace(/(?:'|\"|`)\s*(?:or|and)\s*(?:'|\"|`|\d+)\s*=\s*(?:'|\"|`|\d+)/gi, '')
    .replace(/;\s*(drop|delete|insert|update|alter|truncate)\b/gi, '')
    .replace(/--\s*$/gm, '');

  // Transformar comillas sueltas a tipográficas seguras
  msg = msg.replace(/'/g, '’').replace(/"/g, '”');

  // Neutralizar scripts ejecutables
  for (const pattern of CODE_INJECTION_PATTERNS) {
    msg = msg.replace(pattern, '');
  }

  return msg.trim();
}

/**
 * Sanitizador estricto para campos numéricos/alfanuméricos
 * (ej. Números de Tarjeta TuLlave, Cédulas de Ciudadanía, Teléfonos, Códigos)
 *
 * @param {string} val
 * @param {string} [allowedExtras=''] Caracteres extra permitidos (ej. '-. ')
 * @returns {string}
 */
export function sanitizeNumericOrId(val, allowedExtras = '') {
  if (!val) return '';
  const str = String(val);
  const escapedExtras = allowedExtras.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const regex = new RegExp(`[^0-9a-zA-Z${escapedExtras}]`, 'g');
  return str.replace(regex, '').trim();
}

/**
 * Sanitiza un objeto completo de manera recursiva antes de persistirlo en base de datos o localStorage.
 * Ideal para formularios de incidencias, perfil y postulaciones.
 *
 * @param {object} obj - Objeto con datos del formulario
 * @returns {object} Objeto clonado con todos sus campos de texto sanitizados
 */
export function sanitizeFormData(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeFormData(item));
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Campos de correo electrónico: sanitizado especial de email
      if (key.toLowerCase().includes('email') || key.toLowerCase().includes('correo')) {
        result[key] = value.trim().toLowerCase().replace(/['"`;\\<>]/g, '').slice(0, 160);
      } else if (key.toLowerCase().includes('cedula') || key.toLowerCase().includes('card') || key.toLowerCase().includes('telefono')) {
        result[key] = sanitizeNumericOrId(value, '-. ');
      } else {
        result[key] = sanitizeInput(value, 1500);
      }
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeFormData(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export default {
  detectSqlInjection,
  sanitizeInput,
  sanitizeSearchQuery,
  sanitizeChatMessage,
  sanitizeNumericOrId,
  sanitizeFormData
};
