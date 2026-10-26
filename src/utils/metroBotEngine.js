import { 
  METRO_SYSTEM_KNOWLEDGE, 
  NOTICIAS_KB, 
  EMPLEOS_KB,
  BOGOTA_LOCALIDADES_KB,
  BOGOTA_CENTROS_COMERCIALES_KB,
  BOGOTA_PARQUES_RECREACION_KB,
  BOGOTA_UNIVERSIDADES_EMPRESAS_KB,
  KNOWLEDGE_BASE
} from '../data/metroKnowledge.js';

import { 
  METROBOT_SYSTEM_INSTRUCTION, 
  METROBOT_SYSTEM_PROMPT, 
  getMetroBotSystemPrompt 
} from './metroBotPrompt.js';

export { 
  METROBOT_SYSTEM_INSTRUCTION, 
  METROBOT_SYSTEM_PROMPT, 
  getMetroBotSystemPrompt,
  KNOWLEDGE_BASE
};

/**
 * Detector de idioma del usuario con soporte ES, EN, PT, ZH, JA
 */
export function detectLanguage(query = '', currentLang = 'ES') {
  const q = String(query || '').trim();

  // 1. Detección por caracteres japoneses (Hiragana / Katakana)
  const jaRegex = /[\u3040-\u309F\u30A0-\u30FF]/;
  if (jaRegex.test(q)) return 'JA';

  // 2. Detección por ideogramas chinos (Hanzi)
  const zhRegex = /[\u4e00-\u9fa5]/;
  if (zhRegex.test(q)) return 'ZH';

  // 3. Detección por palabras clave en portugués
  const ptRegex = /\b(olá|ola|bom dia|boa tarde|estação|estações|trem|trens|vagas|emprego|saldo|obra|quanto|onde|cartão|passagem|recarregar|velocidade|baldeação|capacidade|lotação|passageiros|rota|como chegar|bairro|parque|obras|avanços)\b/i;
  if (ptRegex.test(q)) return 'PT';

  // 4. Detección por palabras clave en inglés
  const enKeywords = [
    'hello', 'hi', 'hey', 'news', 'job', 'jobs', 'station', 'stations', 'progress',
    'card', 'balance', 'recharge', 'metro', 'schedule', 'route', 'routes', 'work',
    'apply', 'closure', 'closures', 'train', 'trains', 'capacity', 'speed', 'profile',
    'where', 'how', 'when', 'who', 'what', 'fare', 'fares', 'transfer', 'transfers',
    'culture', 'civic', 'rules', 'subway'
  ];
  const words = q.toLowerCase().split(/\s+/);
  const matchEn = words.filter(w => enKeywords.includes(w)).length;
  if (matchEn >= 2 || (words.length <= 3 && matchEn >= 1)) return 'EN';

  // 5. Si el usuario tiene una preferencia de idioma activa explícita en la UI
  if (currentLang && typeof currentLang === 'string') {
    const cl = currentLang.trim().toUpperCase();
    if (['ES', 'EN', 'PT', 'ZH', 'JA'].includes(cl)) {
      return cl;
    }
  }

  return 'ES';
}

/**
 * Agrega el bloque de sugerencias dinámicas al final si no viene presente
 */
export function ensureSuggestionsBlock(response, lang = 'ES') {
  if (!response) return '';
  if (response.includes('[SUGERENCIAS]')) return response.trim();

  const l = (lang || 'ES').toUpperCase();

  if (l === 'JA') {
    return `${response.trim()}

[SUGERENCIAS]
- 📍 マルティプラザの最寄駅は？
- 🗺️ フォンティボンからセントロ・マヨールへの行き方は？
- 💳 TuLlaveカードの運賃とチャージ方法は？
- 💼 SENAの求人募集について`;
  }

  if (l === 'ZH') {
    return `${response.trim()}

[SUGERENCIAS]
- 📍 Multiplaza 附近有哪些地铁站？
- 🗺️ 从丰蒂邦如何前往 Centro Mayor？
- 💳 TuLlave 交通卡票价与 $0 换乘政策
- 💼 SENA 与地铁一号线官方招聘岗位`;
  }

  if (l === 'EN') {
    return `${response.trim()}

[SUGERENCIAS]
- 📍 Which stations are near Multiplaza?
- 🗺️ How do I get from Fontibón to Centro Mayor?
- 💳 How do fares, TuLlave card and $0 transfers work?
- 💼 Official job openings at SENA & Metro Línea 1`;
  }

  if (l === 'PT') {
    return `${response.trim()}

[SUGERENCIAS]
- 📍 Quais estações ficam perto do Multiplaza?
- 🗺️ Como chegar de Fontibón a Centro Mayor?
- 💳 Como funciona a tarifa e o cartão TuLlave?
- 💼 Como se candidatar às vagas do SENA e Metro?`;
  }

  return `${response.trim()}

[SUGERENCIAS]
- 📍 ¿Qué estaciones quedan cerca de Multiplaza?
- 🗺️ ¿Cómo llego desde Fontibón a Centro Mayor?
- 💳 ¿Cómo funciona el transbordo a $0 en TuLlave?
- 💼 ¿Cuáles son las vacantes con el SENA?`;
}

/**
 * Detector estricto de consultas de rutas, direcciones y ubicación de estaciones (multilingüe)
 */
export function isRouteOrMapQuery(query = '', text = '') {
  const q = (query || '').toLowerCase().trim();
  const t = (text || '').toLowerCase().trim();

  // Si el texto ya tiene formato de ruta oficial de MetroBot (cualquiera de los 5 idiomas)
  if (
    t.includes('🧭 **ruta sugerida:') ||
    t.includes('🧭 **ruta:') || 
    t.includes('ruta sugerida') ||
    t.includes('suggested route') ||
    t.includes('rota sugerida') ||
    t.includes('建议路线') ||
    t.includes('推奨ルート') ||
    t.includes('conexiones totales:') || 
    t.includes('total connections:') ||
    t.includes('conexecoes totais:') ||
    t.includes('换乘总计:') ||
    t.includes('乗り換え合計:') ||
    t.includes('punto de intercambio') || 
    t.includes('interchange / transfer point') ||
    t.includes('ponto de conexão') ||
    t.includes('estación de metro clave') ||
    t.includes('estación metro clave') ||
    t.includes('tramo metro') ||
    t.includes('[action: open_map_module]')
  ) {
    return true;
  }

  // Patrones sintácticos de origen a destino en varios idiomas:
  const routePatterns = [
    // Español
    /\b(?:de|desde)\s+[a-záéíóúñ\s0-9]+\s+(?:a|hacia|hasta|al)\s+[a-záéíóúñ\s0-9]+/i,
    /\b(?:cómo|como)\s+(?:llego|llegar|voy|ir|viajar)\b/i,
    /\b(?:en\s+qué|en\s+que)\s+estaci[oó]n\b/i,
    /\b(?:dónde|donde)\s+(?:queda|está|me\s+bajo)\b/i,
    /\b(?:estaci[oó]n|estacion)\s+(?:cerca|más\s+cercana|mas\s+cercana|de\s+metro)\b/i,
    /\b(?:pasa\s+por|queda\s+cerca)\b/i,
    /\b(?:trazado|viaducto|recorrido|mapa|mapa\s+interactivo)\b/i,
    /\b(?:ruta|rutas|itinerario|trayecto|desplazamiento)\b/i,
    /\b(?:ir|llegar|viajar)\s+(?:a|hacia|hasta|al)\b/i,
    // Inglés
    /\b(?:from)\s+[a-z\s0-9]+\s+(?:to)\s+[a-z\s0-9]+/i,
    /\b(?:how\s+(?:to|do\s+i)\s+get\s+(?:to)?)\b/i,
    /\b(?:nearest\s+station|which\s+station|closest\s+station)\b/i,
    /\b(?:interactive\s+map|metro\s+map|subway\s+map|route\s+to)\b/i,
    // Portugués
    /\b(?:de)\s+[a-z\s0-9]+\s+(?:para|a|até)\s+[a-z\s0-9]+/i,
    /\b(?:como\s+chegar)\b/i,
    /\b(?:qual\s+estação|estação\s+mais\s+próxima|mapa\s+interativo)\b/i,
    // Chino
    /从.+到.+/,
    /怎么去|如何到达|换乘路线|附近车站|交互式地图/,
    // Japonés
    /.+から.+まで/,
    /への行き方|行き方|最寄駅|路線図|乗換案内/
  ];

  if (routePatterns.some(p => p.test(q))) {
    return true;
  }

  // Si menciona dos puntos de la ciudad con conector
  const localities = [
    'bosa', 'fontibon', 'fontibón', 'kennedy', 'usme', 'suba', 'engativa', 'engativá',
    'chapinero', 'teusaquillo', 'santa fe', 'candelaria', 'martires', 'mártires',
    'puente aranda', 'tunjuelito', 'ciudad bolivar', 'ciudad bolívar', 'san cristobal',
    'san cristóbal', 'rafael uribe', 'usaquen', 'usaquén', 'barrios unidos', 'sumapaz',
    'castilla', 'portal 80', 'centro mayor', 'multiplaza', 'plaza central', 'aeropuerto',
    'calle 72', 'calle 26', 'calle 45', 'calle 63', 'calle 19', 'calle 100', 'campin', 'campín',
    'unicentro', 'titan', 'titán', 'santafe', 'santafé', 'colina'
  ];

  const matched = localities.filter(loc => q.includes(loc));
  if (matched.length >= 2 && /\b(a|hacia|hasta|al|to|para|到|まで)\b/i.test(q)) {
    return true;
  }

  return false;
}

/**
 * Detector estricto de consultas exclusivas de empleo, vacantes y convocatorias SENA (multilingüe)
 */
export function isEmploymentQuery(query = '', text = '') {
  const q = (query || '').toLowerCase().trim();
  const t = (text || '').toLowerCase().trim();

  // EXCLUSIÓN ESTRICTA: Si es una consulta de ruta, NO puede ser empleo
  if (isRouteOrMapQuery(q, t)) {
    return false;
  }

  const employmentKeywords = [
    // Español
    'empleo', 'empleos', 'vacante', 'vacantes', 'trabajo', 'trabajos', 'trabajar',
    'convocatoria', 'convocatorias', 'postular', 'postularme', 'postularse',
    'postulacion', 'postulación', 'postulaciones', 'sena', 'hoja de vida', 'hojas de vida',
    'contratacion', 'contratación', 'contrataciones', 'trabajar en el metro', 'trabajar con el metro',
    'oferta laboral', 'ofertas laborales', 'feria de empleo', 'feria laboral',
    // Inglés
    'job', 'jobs', 'vacancy', 'vacancies', 'career', 'careers', 'hiring', 'work at metro',
    'job opening', 'job openings', 'apply for job', 'recruitment',
    // Portugués
    'vaga', 'vagas', 'emprego', 'empregos', 'trabalhar no metrô', 'trabalhar no metro',
    'candidatura', 'candidatar', 'recrutamento', 'currículo', 'curriculo',
    // Chino
    '招聘', '求职', '应聘', '工作机会', '招工', '岗位', '空缺职位',
    // Japonés
    '採用', '求人', '就職', '仕事', '応募', '募集'
  ];

  return employmentKeywords.some(kw => q.includes(kw));
}

/**
 * Agrega el comando de acción dinámica si la respuesta o la consulta corresponden a los módulos principales
 * Bajo las REGLAS DE ASIGNACIÓN ESTRICTA DE TARJETAS ([ACTION])
 */
export function ensureActionTrigger(text, query = '') {
  if (!text) return '';
  const q = (query || '').toLowerCase().trim();
  const t = text.toLowerCase().trim();

  // 1. REGLA ESTRICTA 1: Consultas de rutas, direcciones y ubicación de estaciones
  // PROHIBIDO adjuntar [ACTION: OPEN_EMPLOYMENT_MODULE] en preguntas de rutas aunque mencionen Bosa, Kennedy, Usme o Fontibón.
  if (isRouteOrMapQuery(q, t)) {
    // Limpiar cualquier etiqueta previa errónea (ej. de empleo) y forzar OPEN_MAP_MODULE
    const cleaned = text.replace(/\[ACTION:\s*[A-Z0-9_]+\]/g, '').trim();
    return appendActionTrigger(cleaned, 'OPEN_MAP_MODULE');
  }

  // 2. REGLA ESTRICTA 2: Consultas exclusivas de trabajo, vacantes y SENA
  if (isEmploymentQuery(q, t)) {
    const cleaned = text.replace(/\[ACTION:\s*[A-Z0-9_]+\]/g, '').trim();
    return appendActionTrigger(cleaned, 'OPEN_EMPLOYMENT_MODULE');
  }

  // Si ya tiene un [ACTION: ...], respetarlo
  if (/\[ACTION:\s*[A-Z0-9_]+\]/.test(text)) {
    return text;
  }

  // 3. REGLA ESTRICTA 3: Noticias, hitos y porcentaje de avance de obra
  if ([
    'noticia', 'novedad', 'boletin', 'boletín', 'comunicado', 'avance', '82.33', '82,33',
    'obra', 'obras', 'hito', 'viga', 'pilote', 'intercambiador', 'cronograma', 'inaugura',
    'fecha de entrega', 'cuando opera', 'cuándo opera', 'marcha blanca', 'pruebas dinamicas',
    'pruebas dinámicas', 'news', 'progress', 'notícias', 'notícia', 'avanço', '新闻', '进展',
    'ニュース', '進捗'
  ].some(k => q.includes(k) || t.includes(k))) {
    return appendActionTrigger(text, 'OPEN_NEWS_MODULE');
  }

  // 4. REGLA ESTRICTA 4: Saldo, recargas y tarjeta TuLlave
  if ([
    'saldo', 'recarga', 'recargar', 'tarjeta', 'tullave', 'tu llave', 'tarifa', 'pasaje',
    'precio', 'costo', '110 minutos', 'cuanto vale', 'cuánto vale', 'cuanto cuesta', 'cuánto cuesta',
    'fare', 'fares', 'balance', 'recharge', 'card', 'cartão', 'saldo', 'tarifa', '余额', '充值',
    '交通卡', '票价', '残高', 'チャージ', '運賃'
  ].some(k => q.includes(k) || t.includes(k))) {
    return appendActionTrigger(text, 'OPEN_BALANCE_MODULE');
  }

  // 5. REGLA ESTRICTA 5: Cultura y pedagogía (#BogotáModoMetro, Vagón Escuela)
  if ([
    'cultura', 'convivencia', 'norma', 'normas', 'vagon escuela', 'vagón escuela', 'bogotamodometro',
    'modo metro', 'mascota', 'bicicleta', 'bici', 'civismo', 'hábito', 'habito', 'mural',
    'culture', 'civic', 'cultura cidadã', '文明', '市民文化', 'マナー', '市民規範'
  ].some(k => q.includes(k) || t.includes(k))) {
    return appendActionTrigger(text, 'OPEN_CULTURE_MODULE');
  }

  // 6. REGLA ESTRICTA 6: Foro ciudadano, opinión, comentarios, sugerencias
  if ([
    'foro', 'debate', 'opinion', 'opinión', 'opinar', 'comentario', 'comentarios', 'sugerencia',
    'sugerencias', 'participacion', 'participación', 'propuesta', 'propuestas', 'comunidad', 'vecinal',
    'forum', 'discuss', 'fórum', 'opinião', 'comunidade', '论坛', '社区讨论', 'フォーラム', '意見'
  ].some(k => q.includes(k) || t.includes(k))) {
    return appendActionTrigger(text, 'OPEN_FORUM_MODULE');
  }

  return text;
}

function appendActionTrigger(text, actionKey) {
  if (text.includes('[SUGERENCIAS]')) {
    const parts = text.split('[SUGERENCIAS]');
    return `${parts[0].trim()}\n\n[ACTION: ${actionKey}]\n\n[SUGERENCIAS]${parts[1]}`;
  }
  return `${text.trim()}\n\n[ACTION: ${actionKey}]`;
}

/**
 * Mensaje de bienvenida inicial multilingüe
 */
export function getInitialBotGreeting(language = 'es') {
  const l = (language || 'es').toLowerCase();
  if (l === 'ja') {
    return `こんにちは！私は **MetroBot IA** 🤖、ボゴタ地下鉄（EMB）および **UrbanGo** の公式都市モビリティ・AIアシスタントです。

ルート案内、求人募集、Cultura Metroマナー教育、最新工事進捗（82.33%）についてお気軽にお尋ねください。

[SUGERENCIAS]
- 📍 マルティプラザの最寄駅はどこ？
- 🗺️ フォンティボンからセントロ・マヨールへの行き方は？
- 💼 SENAの求人募集について
- 🌱 #BogotáModoMetroのマナーについて`;
  }
  if (l === 'zh') {
    return `您好！我是 **MetroBot IA** 🤖，波哥大地铁公司（EMB）及 **UrbanGo** 官方全域交通与城市出行AI智能助手。

您可以向我咨询出行路线规划、招聘岗位信息、#BogotáModoMetro 地铁文明倡议及最新工程建设进展（82.33%）。

[SUGERENCIAS]
- 📍 Multiplaza 购物中心附近有哪些地铁站？
- 🗺️ 从丰蒂邦如何前往 Centro Mayor？
- 💼 SENA 与地铁一号线官方招聘岗位
- 🌱 #BogotáModoMetro 地铁文明规范`;
  }
  if (l === 'pt') {
    return `Olá! Sou o **MetroBot IA** 🤖, a Inteligência Artificial Oficial da Empresa Metro de Bogotá no aplicativo UrbanGo.

Posso ajudá-lo com rotas e deslocamentos, vagas de emprego com o SENA, a campanha #BogotáModoMetro e dados oficiais da obra ao 82,33%. Como posso ajudar hoje?

[SUGERENCIAS]
- 📍 Quais estações ficam perto do Multiplaza?
- 🗺️ Como chegar de Fontibón a Centro Mayor?
- 💼 Quais são as vagas com o SENA?
- 🌱 O que é o #BogotáModoMetro?`;
  }
  if (l === 'en') {
    return `Hello! I am **MetroBot AI** 🤖, the Official Artificial Intelligence of Empresa Metro de Bogotá on UrbanGo.

I assist users and technical evaluators with precision across route planning, official job openings with SENA, the #BogotáModoMetro civic culture initiative, and technical progress updates (82.33%). How can I help you today?

[SUGERENCIAS]
- 📍 Which stations are near Multiplaza?
- 🗺️ How do I get from Fontibón to Centro Mayor?
- 💼 Official job openings at SENA & Metro Línea 1
- 🌱 What is the #BogotáModoMetro initiative?`;
  }
  return `¡Hola! Soy **MetroBot IA** 🤖, la Inteligencia Artificial Oficial de la Empresa Metro de Bogotá en la aplicación UrbanGo.

Estoy a tu servicio para resolver consultas sobre rutas y desplazamientos, convocatorias laborales con el SENA, la estrategia ciudadana #BogotáModoMetro y el avance oficial de las obras al 82,33%. ¿En qué puedo orientarte hoy?

[SUGERENCIAS]
- 📍 ¿Qué estaciones quedan cerca de Multiplaza?
- 🗺️ ¿Cómo llego desde Fontibón a Centro Mayor?
- 💼 ¿Cuáles son las vacantes con el SENA?
- 🌱 ¿Qué es la estrategia #BogotáModoMetro?`;
}

/**
 * MOTOR CENTRAL DE RESPUESTAS DE METROBOT IA:
 * 1. Intenta llamar al endpoint de IA en el servidor (/api/chat con gemini-3.8-flash y temperature: 0.2)
 * 2. Si no hay conexión o falla, ejecuta el motor heurístico determinista completo
 */
export async function getMetroBotResponse(
  userInput, 
  lang = 'ES', 
  t = (k) => k, 
  history = [], 
  knowledgeBase = KNOWLEDGE_BASE
) {
  if (!userInput || !userInput.trim()) {
    return getInitialBotGreeting(lang);
  }

  const query = userInput.trim();
  const effectiveLang = detectLanguage(query, lang);

  // 1. Amplitud de memoria contextual: conservar los últimos 10 turnos de conversación activos (hasta 20 mensajes)
  const activeHistory = Array.isArray(history) ? history.slice(-20) : [];

  // Intentar llamada al backend proxy con Gemini 3.8 Flash
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500);

    const apiRes = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: query,
        lang: effectiveLang,
        history: activeHistory,
        knowledgeBase
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && data.text && typeof data.text === 'string' && data.text.trim()) {
        const withSuggestions = ensureSuggestionsBlock(data.text, effectiveLang);
        return ensureActionTrigger(withSuggestions, query);
      }
    }
  } catch (e) {
    // Si falla la llamada HTTP a Gemini (offline, timeout o error de red),
    // se pasa de inmediato al motor de conocimiento local sin error visible.
  }

  const localRes = getMetroBotLocalResponse(query, effectiveLang, t);
  return ensureActionTrigger(localRes, query);
}

/**
 * Resuelve rutas punto a punto dinámicas entre localidades y puntos de interés de Bogotá
 * Estructura estricta según especificación oficial CASO 1:
 * 🧭 **Ruta:** Origen ➔ Destino
 * 🔄 **Total de Abordajes / Transbordos:** [X abordajes (Y transbordos a $0)]
 * 1. **Paso 1 (Abordaje inicial):** ...
 * 2. **Paso 2 (Punto de cambio / Transbordo):** ...
 * 3. **Paso 3 (Tramo Metro / Destino final):** ...
 * ⏱️ **Tiempo estimado:** ...
 * 💡 **Tip #BogotáModoMetro:** ...
 */
/**
 * Formateador de ruta intermodal multilingüe
 */
function formatRouteResponse(orig, dest, effectiveLang = 'ES') {
  const l = (effectiveLang || 'ES').toUpperCase();

  if (l === 'EN') {
    return `🧭 **Suggested Route:** ${orig.name} ➔ ${dest.name}
🔄 **Total Connections:** 2 boardings (1 transfer at $0 COP)

1. **Boarding 1 (Origin):** Begin your trip at ${orig.name} using ${orig.tm}.
2. **Interchange / Transfer Point:** Board Bogotá Metro Line 1 at **${orig.metro}** and travel along the continuous 23.9 km elevated viaduct at a commercial speed of 42.5 km/h.
3. **Boarding 2 (Destination / Final Leg):** Alight at **${dest.metro}** and make an intermodal connection via ${dest.conn} to ${dest.name}.

⏱️ **Estimated Time:** Projected savings of 40 to 55 minutes compared to conventional transit.
💡 **#BogotáModoMetro Tip:** With your personalized TuLlave card, you have a 110-minute window for $0 COP transfers between the Metro, TransMilenio, and SITP.

[ACTION: OPEN_MAP_MODULE]`;
  }

  if (l === 'PT') {
    return `🧭 **Rota Sugerida:** ${orig.name} ➔ ${dest.name}
🔄 **Conexões Totais:** 2 embarques (1 baldeação a $0 COP)

1. **Embarque 1 (Origem):** Inicie seu deslocamento em ${orig.name} utilizando ${orig.tm}.
2. **Ponto de Conexão / Baldeação:** Acesse a Linha 1 do Metrô na estação **${orig.metro}** e viaje pelo viaduto contínuo de 23,9 km a uma velocidade comercial de 42.5 km/h.
3. **Embarque 2 (Destino / Trecho Final):** Desembarque em **${dest.metro}** e realize a integração intermodal com ${dest.conn} até ${dest.name}.

⏱️ **Tempo estimado:** Economia estimada de 40 a 55 minutos frente ao tráfego tradicional.
💡 **Dica #BogotáModoMetro:** Com seu cartão TuLlave personalizado, você tem uma janela de 110 minutos para baldeações a $0 COP.

[ACTION: OPEN_MAP_MODULE]`;
  }

  if (l === 'ZH') {
    return `🧭 **建议路线:** ${orig.name} ➔ ${dest.name}
🔄 **换乘总计:** 2次乘车（1次 $0 COP 免费换乘）

1. **第1程乘车（起点）:** 在 ${orig.name} 出发，搭乘 ${orig.tm}。
2. **换乘中枢 / 换乘点:** 在 **${orig.metro}** 站进站换乘波哥大地铁一号线，途经23.9公里全线高架桥，商业运营时速 42.5 km/h。
3. **第2程乘车（目的地 / 最终路段）:** 在 **${dest.metro}** 站出站，无缝换乘接驳 ${dest.conn} 前往 ${dest.name}。

⏱️ **预计耗时:** 相比常规地面交通预计可节省 40 至 55 分钟。
💡 **#BogotáModoMetro 文明贴士:** 使用个人实名 TuLlave 交通卡，可在 110 分钟换乘窗口期内享受 $0 COP 免费公铁换乘。

[ACTION: OPEN_MAP_MODULE]`;
  }

  if (l === 'JA') {
    return `🧭 **推奨ルート:** ${orig.name} ➔ ${dest.name}
🔄 **乗り換え合計:** 乗車2回（$0 COP 無料乗り換え1回）

1. **第1区間（出発地）:** ${orig.name} より ${orig.tm} を利用して出発します。
2. **乗り換え拠点 / 接続駅:** **${orig.metro}** よりボゴタ地下鉄1号線に乗車し、全長23.9kmの高架桥区間を表定速度42.5 km/hで走行します。
3. **第2区間（目的地 / 最終区間）:** **${dest.metro}** にて降車し、${dest.conn} で ${dest.name} へ接続します。

⏱️ **所要時間（見込み）:** 従来の道路交通と比較して約40〜55分の時間短縮が見込まれます。
💡 **#BogotáModoMetro マナーのヒント:** 登録済みTuLlaveカードをご利用の場合、110分以内の乗り換えは $0 COP（無料）となります。

[ACTION: OPEN_MAP_MODULE]`;
  }

  return `🧭 **Ruta Sugerida:** ${orig.name} ➔ ${dest.name}
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

1. **Abordaje 1 (Origen):** Inicia tu recorrido en ${orig.name} utilizando ${orig.tm}.
2. **Punto de Intercambio / Transbordo:** Ingresa a la Línea 1 del Metro en **${orig.metro}** y viaja por el viaducto continuo de 23,9 km a velocidad comercial de 42.5 km/h.
3. **Abordaje 2 (Destino / Tramo Final):** Desciende en **${dest.metro}** y realiza enlace intermodal con ${dest.conn} hacia ${dest.name}.

⏱️ **Tiempo estimado:** Ahorro proyectado de 40 a 55 minutos frente al transporte convencional.
💡 **Tip #BogotáModoMetro:** Con tu tarjeta TuLlave personalizada dispones de 110 minutos para transbordar a $0 COP.

[ACTION: OPEN_MAP_MODULE]`;
}

/**
 * Formateador de ruta al Aeropuerto El Dorado multilingüe
 */
function formatAirportRoute(effectiveLang = 'ES') {
  const l = (effectiveLang || 'ES').toUpperCase();

  if (l === 'EN') {
    return `🧭 **Suggested Route:** Metro Line 1 Network ➔ El Dorado International Airport (Air Terminal)
🔄 **Total Connections:** 2 boardings (1 transfer at $0 COP)

1. **Boarding 1 (Origin):** Board at any station on Metro Line 1 heading north towards Chapinero.
2. **Interchange / Transfer Point:** Alight at **Station 13 (Calle 26 with Av. Caracas)** at the intermodal hub. *(Note: The Metro does not have a direct station at the airport)*.
3. **Boarding 2 (Destination / Final Leg):** Connect directly to Trunk Calle 26 (K60 or Feeder K16) on a direct articulated/dual bus to El Dorado Airport Terminal.

⏱️ **Estimated Time:** 40-minute savings in rush hour via the exclusive Calle 26 transit lane.
💡 **#BogotáModoMetro Tip:** Protect your belongings and validate your $0 COP transfer within the 110-minute TuLlave window.

[ACTION: OPEN_MAP_MODULE]`;
  }

  if (l === 'PT') {
    return `🧭 **Rota Sugerida:** Rede Metrô Linha 1 ➔ Aeroporto Internacional El Dorado (Terminal Aéreo)
🔄 **Conexões Totais:** 2 embarques (1 baldeação a $0 COP)

1. **Embarque 1 (Origem):** Embarque em qualquer estação da Linha 1 do Metrô no sentido norte para Chapinero.
2. **Ponto de Conexão / Baldeação:** Desembarque na **Estação 13 (Calle 26 com Av. Caracas)** no hub intermodal. *(Nota: O Metrô não possui estação direta no aeroporto)*.
3. **Embarque 2 (Destino / Trecho Final):** Conecte-se diretamente à Troncal Calle 26 (K60 ou Alimentador K16) em ônibus articulado direto ao Terminal El Dorado.

⏱️ **Tempo estimado:** Economia de 40 minutos no pico graças à faixa exclusiva da Calle 26.
💡 **Dica #BogotáModoMetro:** Cuide de seus pertences e valide sua baldeação a $0 COP na janela de 110 minutos do TuLlave.

[ACTION: OPEN_MAP_MODULE]`;
  }

  if (l === 'ZH') {
    return `🧭 **建议路线:** 地铁一号线全网 ➔ 埃尔多拉多国际机场（El Dorado 航站楼）
🔄 **换乘总计:** 2次乘车（1次 $0 COP 免费换乘）

1. **第1程乘车（起点）:** 在地铁一号线任一车站乘车往北行驶向 Chapinero 方向。
2. **换乘中枢 / 换乘点:** 在 **第13站（Calle 26 与 Av. Caracas 枢纽）** 下车出闸换乘。*（注：地铁一号线未在航站楼设直达站）*。
3. **第2程乘车（目的地 / 最终路段）:** 直接接驳换乘 26街快速公交主干线（K60 或接驳车 K16），乘坐双铰接大巴直抵埃尔多拉多航站楼。

⏱️ **预计耗时:** 依托 26 街公交专用道，早晚高峰可稳定节省 40 分钟。
💡 **#BogotáModoMetro 文明贴士:** 请保管好行李，并在 110 分钟 TuLlave 优惠期内完成刷卡免费换乘。

[ACTION: OPEN_MAP_MODULE]`;
  }

  if (l === 'JA') {
    return `🧭 **推奨ルート:** 地下鉄1号線ネットワーク ➔ エルドラド国際空港（旅客ターミナル）
🔄 **乗り換え合計:** 乗車2回（$0 COP 無料乗り換え1回）

1. **第1区間（出発地）:** 地下鉄1号線の各駅よりチャピネロ方面（北行き）に乗車します。
2. **乗り換え拠点 / 接続駅:** **第13駅（Calle 26 / Av. Caracas）** の複合乗換拠点にて降車します。*（注：空港直結の地下鉄駅はありません）*。
3. **第2区間（目的地 / 最終区間）:** Calle 26専用レーン幹線（K60またはK16連絡バス）に直結し、空港ターミナルへ直行します。

⏱️ **所要時間（見込み）:** Calle 26専用レーンの利用によりラッシュ時に約40分の短縮となります。
💡 **#BogotáModoMetro マナーのヒント:** お手回り品にご注意の上、TuLlaveカードの110分以内無料乗り換えをご活用ください。

[ACTION: OPEN_MAP_MODULE]`;
  }

  return `🧭 **Ruta Sugerida:** Red Metro Línea 1 ➔ Aeropuerto Internacional El Dorado (Terminal Aéreo)
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

1. **Abordaje 1 (Origen):** Aborda en cualquier estación de la Línea 1 del Metro de Bogotá con sentido norte hacia Chapinero.
2. **Punto de Intercambio / Transbordo:** Desciende en **Estación 13 (Calle 26 con Av. Caracas)** en el intercambiador intermodal. *(Nota: El Metro no tiene estación directa en el aeropuerto)*.
3. **Abordaje 2 (Destino / Tramo Final):** Conecta directamente con la Troncal Calle 26 (K60 o Alimentador K16) en bus dual/articulado directo al Terminal Aéreo de El Dorado.

⏱️ **Tiempo estimado:** Ahorro de 40 minutos en hora pico gracias al carril exclusivo de la Calle 26.
💡 **Tip #BogotáModoMetro:** Cuida tus pertenencias y valida tu transbordo a $0 COP dentro de la ventana de 110 minutos de TuLlave.

[ACTION: OPEN_MAP_MODULE]`;
}

/**
 * Resuelve rutas punto a punto dinámicas entre localidades y puntos de interés de Bogotá
 */
export function resolveDynamicRoute(userInput, effectiveLang = 'ES') {
  if (!userInput) return null;
  const q = userInput.toLowerCase();
  const l = (effectiveLang || 'ES').toUpperCase();

  // ==========================================================================
  // DISAMBIGUACIÓN DE LOCALIDADES AMPLIAS SIN SECTOR ESPECÍFICO
  // Regla: Prohibición de asociación automática por localidad
  // ==========================================================================
  if (
    (q.includes('cómo llego a kennedy') || q.includes('como llego a kennedy') || q === 'kennedy' || q === 'a kennedy' || q === 'to kennedy' || q.includes('how to get to kennedy')) &&
    !q.includes('timiza') && !q.includes('castilla') && !q.includes('tintal') && !q.includes('hospital') && !q.includes('bosa') && !q.includes('de ') && !q.includes('from ')
  ) {
    if (l === 'EN') {
      return `🧭 **Suggested Route:** Connection to the Locality of Kennedy
🔄 **Total Connections:** 2 boardings (1 transfer at $0 COP)

Kennedy is a very broad locality and two neighborhoods in the same locality require completely different stations and transfers. Please specify your exact neighborhood or destination:

• **Av. Primero de Mayo / Timiza / Kennedy Hospital Sector:** Board Metro Line 1 to **Station 4 (Carrera 80)** or **Station 5 (Timiza / Boyacá)**.
• **Castilla / Tintal Sector:** Alight at **Station 5** and take an SITP Zonal bus westward on Av. Boyacá or Av. Américas.
• **Corabastos / Portal Américas / Patio Bonito Sector:** Connect at **Station 3 (Portal Américas)** or Trunk Américas.

⏱️ **Estimated Time:** Projected savings of 40 to 55 minutes with Line 1 integration.
💡 **#BogotáModoMetro Tip:** With your personalized TuLlave card, you have a 110-minute window for $0 COP transfers between Metro, TransMilenio, and SITP.

[ACTION: OPEN_MAP_MODULE]`;
    }

    if (l === 'PT') {
      return `🧭 **Rota Sugerida:** Conexão para a Localidade de Kennedy
🔄 **Conexões Totais:** 2 embarques (1 baldeação a $0 COP)

Kennedy é uma localidade extensa e bairros diferentes exigem estações e baldeações distintas. Por favor, informe seu bairro ou destino específico:

• **Setor Av. Primero de Mayo / Timiza / Hospital de Kennedy:** Embarque na Linha 1 até a **Estação 4 (Carrera 80)** ou **Estação 5 (Timiza / Boyacá)**.
• **Setor Castilla / Tintal:** Desembarque na **Estação 5** e pegue ônibus SITP Zonal sentido oeste pela Av. Boyacá ou Av. Américas.
• **Setor Corabastos / Portal Américas / Patio Bonito:** Conecte-se na **Estação 3 (Portal Américas)** ou Troncal Américas.

⏱️ **Tempo estimado:** Economia estimada de 40 a 55 minutos com a Linha 1.
💡 **Dica #BogotáModoMetro:** Com seu cartão TuLlave personalizado, você dispõe de 110 minutos para baldeações a $0 COP entre o Metrô, TransMilenio e SITP.

[ACTION: OPEN_MAP_MODULE]`;
    }

    if (l === 'ZH') {
      return `🧭 **建议路线:** 前往肯尼迪区 (Kennedy) 换乘指引
🔄 **换乘总计:** 2次乘车（1次 $0 COP 免费换乘）

肯尼迪区地域广阔，同一行政区内的不同社区需要通过完全不同的车站与公交线路接驳。请注明您的具体街区或目的地：

• **Av. Primero de Mayo / Timiza / 肯尼迪医院片区:** 搭乘地铁一号线至 **第4站 (Carrera 80)** 或 **第5站 (Timiza / Boyacá)**。
• **Castilla / Tintal 片区:** 在 **第5站** 下车，向西换乘走 Av. Boyacá 或 Av. Américas 的 SITP 区域巴士。
• **Corabastos / Portal Américas / Patio Bonito 片区:** 在 **第3站 (Portal Américas)** 或美洲快速公交走廊换乘。

⏱️ **预计耗时:** 地铁一号线开通后预计可节省 40 至 55 分钟。
💡 **#BogotáModoMetro 文明贴士:** 持实名 TuLlave 交通卡，可在 110 分钟内享受 $0 COP 地铁与公交换乘优惠。

[ACTION: OPEN_MAP_MODULE]`;
    }

    if (l === 'JA') {
      return `🧭 **推奨ルート:** ケネディ区（Kennedy）方面へのアクセス案内
🔄 **乗り換え合計:** 乗車2回（$0 COP 無料乗り換え1回）

ケネディ区は面積が広く、地区によって最寄駅や乗換系統が大きく異なります。具体的な目的地や地区名をお知らせください：

• **Av. Primero de Mayo / Timiza / ケネディ病院地区:** 地下鉄1号線 **第4駅 (Carrera 80)** または **第5駅 (Timiza / Boyacá)** で下車。
• **Castilla / Tintal地区:** **第5駅** で下車し、Av. BoyacáまたはAv. Américas方面のSITP路線バスに乗り換え。
• **Corabastos / Portal Américas / Patio Bonito地区:** **第3駅 (Portal Américas)** またはトランスミレニオ幹線で接続。

⏱️ **所要時間（見込み）:** 1号線利用により約40〜55分の短縮が見込まれます。
💡 **#BogotáModoMetro マナーのヒント:** TuLlaveカードの110分以内無料乗り換え特典をご活用ください。

[ACTION: OPEN_MAP_MODULE]`;
    }

    return `🧭 **Ruta Sugerida:** Conexión hacia la Localidad de Kennedy
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

La localidad de Kennedy es extensa y dos barrios de la misma localidad requieren estaciones y transbordos completamente distintos. Por favor indícanos tu barrio o destino específico:

• **Sector Av. Primero de Mayo / Timiza / Hospital de Kennedy:** Aborda la Línea 1 del Metro hasta la **Estación 4 (Carrera 80)** o **Estación 5 (Timiza / Boyacá)**.
• **Sector Castilla / Tintal:** Desciende en **Estación 5** y toma bus SITP Zonal hacia el occidente por la Av. Boyacá o Av. Américas.
• **Sector Corabastos / Portal Américas / Patio Bonito:** Conecta en **Estación 3 (Portal Américas)** o Troncal Américas.

⏱️ **Tiempo estimado:** Ahorro proyectado de 40 a 55 minutos con la integración de la Línea 1.
💡 **Tip #BogotáModoMetro:** Con tu tarjeta TuLlave personalizada tienes una ventana de 110 minutos para transbordar a $0 COP entre el Metro, TransMilenio y SITP.

[ACTION: OPEN_MAP_MODULE]`;
  }

  if (
    (q.includes('cómo llego a suba') || q.includes('como llego a suba') || q === 'suba' || q === 'a suba' || q === 'to suba' || q.includes('how to get to suba')) &&
    !q.includes('portal') && !q.includes('rincon') && !q.includes('rincón') && !q.includes('colina') && !q.includes('bosa') && !q.includes('de ') && !q.includes('from ')
  ) {
    if (l === 'EN') {
      return `🧭 **Suggested Route:** Connection to the Locality of Suba
🔄 **Total Connections:** 2 boardings (1 transfer at $0 COP)

Metro Line 1 terminus is Station 16 (Calle 72). To reach Suba, your connection depends on your exact sector:

• **Portal Suba / Tibabuyes / Rincón Sector:** At **Station 16 (Calle 72)**, connect with Trunk Suba of TransMilenio or future Underground Line 2.
• **Parque La Colina / Boyacá Sector:** Alight at **Station 16** or connect with an SITP Zonal bus northwards along Av. Boyacá or Cra 15.

⏱️ **Estimated Time:** Approximate savings of 45 to 60 minutes.
💡 **#BogotáModoMetro Tip:** Remember Line 1 terminates at Calle 72; integration to Suba takes place via TransMilenio and feeder routes.

[ACTION: OPEN_MAP_MODULE]`;
    }

    if (l === 'PT') {
      return `🧭 **Rota Sugerida:** Conexão para a Localidade de Suba
🔄 **Conexões Totais:** 2 embarques (1 baldeação a $0 COP)

A Linha 1 do Metrô termina na Estação 16 (Calle 72). Para chegar a Suba, a conexão depende do seu setor exato:

• **Setor Portal Suba / Tibabuyes / Rincón:** Na **Estação 16 (Calle 72)** conecte-se com a Troncal Suba do TransMilenio ou a futura Linha 2 Subterrânea.
• **Setor Parque La Colina / Boyacá:** Desembarque na **Estação 16** ou pegue ônibus SITP Zonal para o norte pela Av. Boyacá ou Cra 15.

⏱️ **Tempo estimado:** Economia aproximada de 45 a 60 minutos.
💡 **Dica #BogotáModoMetro:** A integração para Suba é realizada na Calle 72 com o TransMilenio e alimentadores.

[ACTION: OPEN_MAP_MODULE]`;
    }

    if (l === 'ZH') {
      return `🧭 **建议路线:** 前往苏巴区 (Suba) 换乘指引
🔄 **换乘总计:** 2次乘车（1次 $0 COP 免费换乘）

地铁一号线北端终点为第16站（Calle 72）。前往苏巴区需根据具体街区进行公铁接驳：

• **Portal Suba / Tibabuyes / Rincón 片区:** 在 **第16站 (Calle 72)** 换乘 TransMilenio 苏巴快速公交专线或未来全地下的地铁二号线。
• **Parque La Colina / Boyacá 片区:** 在 **第16站** 下车，换乘沿 Av. Boyacá 或 Cra 15 向北行驶的 SITP 区域巴士。

⏱️ **预计耗时:** 预计可节省约 45 至 60 分钟。
💡 **#BogotáModoMetro 文明贴士:** 地铁一号线在 72 街设综合枢纽，换乘至苏巴区可享受 TuLlave $0 免费公铁换乘。

[ACTION: OPEN_MAP_MODULE]`;
    }

    if (l === 'JA') {
      return `🧭 **推奨ルート:** スバ区（Suba）方面へのアクセス案内
🔄 **乗り換え合計:** 乗車2回（$0 COP 無料乗り換え1回）

地下鉄1号線の北側終点は第16駅（Calle 72）となります。スバ区へは以下の通りお乗り換えください：

• **Portal Suba / Tibabuyes / Rincón地区:** **第16駅 (Calle 72)** にてトランスミレニオ・スバ線または将来の地下鉄2号線へ接続。
• **Parque La Colina / Boyacá地区:** **第16駅** で下車し、Av. BoyacáまたはCra 15北方面のSITP路線バスに乗り換え。

⏱️ **所要時間（見込み）:** 約45〜60分の時間短縮となります。
💡 **#BogotáModoMetro マナーのヒント:** 1号線終点のCalle 72複合乗換拠点にてTuLlaveカードによるスムーズな乗り換えが可能です。

[ACTION: OPEN_MAP_MODULE]`;
    }

    return `🧭 **Ruta Sugerida:** Conexión hacia la Localidad de Suba
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

La Línea 1 del Metro finaliza en la Estación 16 (Calle 72). Para llegar a Suba, la conexión depende de tu sector exacto:

• **Sector Portal Suba / Tibabuyes / Rincón:** En **Estación 16 (Calle 72)** conecta con la Troncal Suba de TransMilenio o la futura Línea 2 Subterránea.
• **Sector Parque La Colina / Boyacá:** Desciende en **Estación 16** o conecta con bus SITP Zonal hacia el norte por la Av. Boyacá o Cra 15.

⏱️ **Tiempo estimado:** Ahorro aproximado de 45 a 60 minutos.
💡 **Tip #BogotáModoMetro:** Recuerda que la Línea 1 no entra directamente a Suba; la integración se realiza en Calle 72 con TransMilenio o alimentadores.

[ACTION: OPEN_MAP_MODULE]`;
  }

  // ==========================================================================
  // MATRIZ DE POIs Y PUNTOS DE REFERENCIA CON ENTRADAS PÚBLICAS OFICIALES
  // ==========================================================================
  const POI_MAP = {
    // CENTROS COMERCIALES
    andino: { 
      name: 'Centro Comercial El Andino (Chapinero / Zona T)', 
      zone: 'Chapinero / Zona T (Entradas por Cll 82 / Cra 11 / Cra 13)', 
      metro: 'Estación 15 (Calle 63) o Estación 16 (Calle 72 / Intercambiador Modal)', 
      tm: 'Troncal Caracas / Cra 11 / Cra 13', 
      conn: 'SITP Zonal por Cra 11 o Cra 13 hacia Cll 82, o caminata de 8 a 10 min por el corredor peatonal de la Zona T hasta la entrada principal' 
    },
    'el andino': { 
      name: 'Centro Comercial El Andino (Chapinero / Zona T)', 
      zone: 'Chapinero / Zona T (Entradas por Cll 82 / Cra 11 / Cra 13)', 
      metro: 'Estación 15 (Calle 63) o Estación 16 (Calle 72 / Intercambiador Modal)', 
      tm: 'Troncal Caracas / Cra 11 / Cra 13', 
      conn: 'SITP Zonal por Cra 11 o Cra 13 hacia Cll 82, o caminata de 8 a 10 min por el corredor peatonal de la Zona T hasta la entrada principal' 
    },
    atlantis: {
      name: 'Centro Comercial Atlantis (Chapinero / Zona T)',
      zone: 'Chapinero / Zona T (Entradas por Cll 81 / Cra 13)',
      metro: 'Estación 16 (Calle 72 / Intercambiador Modal)',
      tm: 'Troncal Caracas / Cra 13',
      conn: 'Caminata de 9 min o bus SITP Zonal por Cra 13 hasta Cll 81'
    },
    'el retiro': {
      name: 'Centro Comercial El Retiro (Chapinero / Zona T)',
      zone: 'Chapinero / Zona T (Entrada por Cll 81 / Cra 11)',
      metro: 'Estación 16 (Calle 72 / Intercambiador Modal)',
      tm: 'Troncal Caracas / Cra 11',
      conn: 'Caminata o bus SITP Zonal por Cra 11 hasta la entrada de Cll 81'
    },
    multiplaza: { 
      name: 'Centro Comercial Multiplaza (Fontibón / Av. Boyacá con Cll 13)', 
      zone: 'Fontibón (Entrada por corredor Av. Boyacá con Cll 13)', 
      metro: 'Estación 5 (Primero de Mayo con Boyacá) o Estación 6 (Av. 68)', 
      tm: 'Av. Boyacá / Calle 13', 
      conn: 'Bus SITP Zonal por el corredor de la Av. Boyacá norte hasta la Calle 13' 
    },
    'plaza central': { 
      name: 'Centro Comercial Plaza Central (Puente Aranda / Av. Boyacá con Cll 11)', 
      zone: 'Puente Aranda (Entrada por Av. Boyacá con Cll 11)', 
      metro: 'Estación 5 (Primero de Mayo con Boyacá) o Estación 6 (Av. 68)', 
      tm: 'Av. Boyacá / Calle 11', 
      conn: 'Bus SITP Zonal por Av. Boyacá norte hasta Cll 11' 
    },
    unicentro: {
      name: 'Centro Comercial Unicentro (Usaquén / Cra 15 con Cll 127)',
      zone: 'Usaquén (Entrada principal por Cra 15 con Cll 127)',
      metro: 'Estación 16 (Calle 72 con Caracas)',
      tm: 'Troncal Norte / Cra 15',
      conn: 'Troncal Norte o SITP Zonal por Cra 15 norte hasta la entrada de la Calle 127'
    },
    santafe: {
      name: 'Centro Comercial Santafé (Suba - Autonorte / Cll 183)',
      zone: 'Suba / Autonorte (Entrada peatonal Autopista Norte con Cll 183)',
      metro: 'Estación 16 (Calle 72 con Caracas)',
      tm: 'Troncal Norte (Portal Norte)',
      conn: 'Troncal Norte hacia Portal Norte y alimentador o bus zonal hasta Cll 183'
    },
    'santafé': {
      name: 'Centro Comercial Santafé (Suba - Autonorte / Cll 183)',
      zone: 'Suba / Autonorte (Entrada peatonal Autopista Norte con Cll 183)',
      metro: 'Estación 16 (Calle 72 con Caracas)',
      tm: 'Troncal Norte (Portal Norte)',
      conn: 'Troncal Norte hacia Portal Norte y alimentador o bus zonal hasta Cll 183'
    },
    'titan plaza': {
      name: 'Centro Comercial Titán Plaza (Engativá / Av. Boyacá con Cll 80)',
      zone: 'Engativá (Entrada peatonal Av. Boyacá con Cll 80)',
      metro: 'Estación 16 (Calle 72 con Caracas) o Estación 5 (Boyacá)',
      tm: 'Troncal Calle 80 / Av. Boyacá',
      conn: 'Troncal Calle 80 hacia el occidente o SITP Zonal por la Av. Boyacá'
    },
    'titán plaza': {
      name: 'Centro Comercial Titán Plaza (Engativá / Av. Boyacá con Cll 80)',
      zone: 'Engativá (Entrada peatonal Av. Boyacá con Cll 80)',
      metro: 'Estación 16 (Calle 72 con Caracas) o Estación 5 (Boyacá)',
      tm: 'Troncal Calle 80 / Av. Boyacá',
      conn: 'Troncal Calle 80 hacia el occidente o SITP Zonal por la Av. Boyacá'
    },
    'centro mayor': { 
      name: 'Centro Comercial Centro Mayor (Antonio Nariño - Tunjuelito / Autopista Sur)', 
      zone: 'Antonio Nariño (Entrada por pasarela peatonal techada desde Estación General Santander)', 
      metro: 'Estación 8 (NQS con Cll 8 Sur) o Estación 9 (Calle 1 Sur)', 
      tm: 'Troncal NQS (General Santander)', 
      conn: 'Troncal NQS Sur y acceso directo por la pasarela peatonal techada' 
    },
    aeropuerto: { 
      name: 'Aeropuerto Internacional El Dorado (Fontibón / Terminal Aéreo)', 
      zone: 'Fontibón (Terminal Aéreo / ¡Sin estación directa de Metro!)', 
      metro: 'Estación 13 (Calle 26 con Caracas)', 
      tm: 'Troncal Calle 26 (Portal El Dorado / K60 / K16)', 
      conn: 'Bus dual/articulado directo de la Troncal Calle 26 al Terminal de Pasajeros' 
    },
    'el dorado': { 
      name: 'Aeropuerto Internacional El Dorado (Fontibón / Terminal Aéreo)', 
      zone: 'Fontibón (Terminal Aéreo / ¡Sin estación directa de Metro!)', 
      metro: 'Estación 13 (Calle 26 con Caracas)', 
      tm: 'Troncal Calle 26 (Portal El Dorado / K60 / K16)', 
      conn: 'Bus dual/articulado directo de la Troncal Calle 26 al Terminal de Pasajeros' 
    },

    // UNIVERSIDADES
    javeriana: {
      name: 'Pontificia Universidad Javeriana (Chapinero / Cra 7 con Cll 40)',
      zone: 'Chapinero (Entradas peatonales por Cra 7 y Cll 40/45)',
      metro: 'Estación 14 (Calle 45 con Caracas)',
      tm: 'Troncal Caracas / Cra 7',
      conn: 'Caminata de 4 a 6 minutos hacia el oriente por la Cll 45 hasta la Cra 7'
    },
    nacional: {
      name: 'Universidad Nacional de Colombia (Teusaquillo / Cll 45 - Cra 30)',
      zone: 'Teusaquillo (Entradas peatonales por Cll 45, Cll 26 y Cra 30)',
      metro: 'Estación 14 (Calle 45 con Caracas) o Estación 13 (Calle 26)',
      tm: 'Troncal Caracas / Troncal NQS',
      conn: 'Caminata de 5 minutos por la Calle 45 occidente o conexión con Troncal NQS'
    },
    unal: {
      name: 'Universidad Nacional de Colombia (Teusaquillo / Cll 45 - Cra 30)',
      zone: 'Teusaquillo (Entradas peatonales por Cll 45, Cll 26 y Cra 30)',
      metro: 'Estación 14 (Calle 45 con Caracas) o Estación 13 (Calle 26)',
      tm: 'Troncal Caracas / Troncal NQS',
      conn: 'Caminata de 5 minutos por la Calle 45 occidente o conexión con Troncal NQS'
    },
    andes: {
      name: 'Universidad de los Andes (Santa Fe - La Candelaria / Cra 1)',
      zone: 'Santa Fe (Entrada peatonal por Cra 1 y Eje Ambiental / Cll 19)',
      metro: 'Estación 12 (Calle 19 con Caracas)',
      tm: 'Troncal Caracas / Eje Ambiental',
      conn: 'Caminata de 6 a 8 minutos por el Eje Ambiental / Cll 19 hacia los Cerros Orientales'
    },
    uniandes: {
      name: 'Universidad de los Andes (Santa Fe - La Candelaria / Cra 1)',
      zone: 'Santa Fe (Entrada peatonal por Cra 1 y Eje Ambiental / Cll 19)',
      metro: 'Estación 12 (Calle 19 con Caracas)',
      tm: 'Troncal Caracas / Eje Ambiental',
      conn: 'Caminata de 6 a 8 minutos por el Eje Ambiental / Cll 19 hacia los Cerros Orientales'
    },

    // LOCALIDADES Y CORREDORES
    castilla: { name: 'Castilla (Kennedy)', zone: 'Suroccidente (Kennedy)', metro: 'Estación 5 (Av. Primero de Mayo con Av. Boyacá)', tm: 'Av. de las Américas / Av. Cali', conn: 'Ruta zonal SITP / Troncal Américas' },
    'portal 80': { name: 'Portal 80 (Engativá)', zone: 'Noroccidente (Engativá)', metro: 'Estación 16 (Calle 72 con Caracas)', tm: 'Troncal Calle 80', conn: 'Bus articulado o zonal por la Troncal Calle 80' },
    'calle 80': { name: 'Corredor Calle 80 (Engativá)', zone: 'Noroccidente', metro: 'Estación 16 (Calle 72 con Caracas)', tm: 'Troncal Calle 80', conn: 'Troncal Calle 80' },
    usme: { name: 'Usme (Sector Portal Usme)', zone: 'Sur', metro: 'Estación 9 (Calle 1 Sur con Caracas)', tm: 'Troncal Caracas Sur (Portal Usme)', conn: 'Troncal Caracas Sur' },
    bosa: { name: 'Bosa (Patio Taller / Bosa Centro)', zone: 'Suroccidente', metro: 'Estación 1 (Patio Taller) o Estación 2 (Av. Cali)', tm: 'Alimentador Bosa / Portal Américas', conn: 'Viaducto Línea 1 en Estación 1 o 2' },
    kennedy: { name: 'Kennedy (Av. Primero de Mayo / Timiza)', zone: 'Suroccidente', metro: 'Estación 4, 5 (Timiza) o 6 (Av. 68)', tm: 'Corredor Av. Primero de Mayo / Troncal Américas', conn: 'Línea 1 en Av. Primero de Mayo' },
    fontibon: { name: 'Fontibón (Fontibón Centro / Cll 13)', zone: 'Occidente', metro: 'Estación 7 (Primero de Mayo con Américas) o Estación 13 (Calle 26)', tm: 'Troncal Calle 26 / Calle 13 (SITP Zonal)', conn: 'SITP Zonal o Troncal Calle 26' },
    'fontibón': { name: 'Fontibón (Fontibón Centro / Cll 13)', zone: 'Occidente', metro: 'Estación 7 (Primero de Mayo con Américas) o Estación 13 (Calle 26)', tm: 'Troncal Calle 26 / Calle 13 (SITP Zonal)', conn: 'SITP Zonal o Troncal Calle 26' },
    suba: { name: 'Suba (Portal Suba / Av. Suba)', zone: 'Noroccidente', metro: 'Estación 16 (Calle 72 con Caracas)', tm: 'Troncal Suba (Portal Suba) / Av. 68', conn: 'Troncal Suba o futura Línea 2 Subterránea' },
    engativa: { name: 'Engativá (Calle 26 / Cll 80)', zone: 'Noroccidente', metro: 'Estación 13 (Calle 26) o Estación 16 (Calle 72)', tm: 'Troncal Calle 26 (K) / Troncal Calle 80', conn: 'Troncal Calle 26 o bus zonal' },
    'engativá': { name: 'Engativá (Calle 26 / Cll 80)', zone: 'Noroccidente', metro: 'Estación 13 (Calle 26) o Estación 16 (Calle 72)', tm: 'Troncal Calle 26 (K) / Troncal Calle 80', conn: 'Troncal Calle 26 o bus zonal' },
    chapinero: { name: 'Chapinero (Calle 63 / Calle 72)', zone: 'Nororiente', metro: 'Estación 14 (Calle 45), 15 (Calle 63) o 16 (Calle 72)', tm: 'Troncal Caracas / Carrera 7ma', conn: 'Viaducto Metro sobre Av. Caracas' },
    teusaquillo: { name: 'Teusaquillo (Calle 26 / Calle 45)', zone: 'Centro-Norte', metro: 'Estación 13 (Calle 26) o Estación 14 (Calle 45)', tm: 'Troncal NQS / Troncal Caracas', conn: 'Troncal Calle 26 o conexión peatonal' },
    'santa fe': { name: 'Santa Fe (Hospitales / Cll 19)', zone: 'Centro', metro: 'Estación 11 (Hospital) o Estación 12 (Calle 19)', tm: 'Troncal Caracas / Eje Ambiental', conn: 'Descenso directo en viaducto Caracas' },
    candelaria: { name: 'La Candelaria (Centro Histórico)', zone: 'Centro Histórico', metro: 'Estación 12 (Calle 19)', tm: 'Eje Ambiental / Estación Universidades', conn: 'Caminata de 4 minutos por Eje Ambiental' },
    martires: { name: 'Los Mártires (Calle 2 / Hospital)', zone: 'Centro', metro: 'Estación 10 (Calle 2) o Estación 11 (Hospital)', tm: 'Troncal Caracas', conn: 'Acceso directo en viaducto Caracas' },
    'mártires': { name: 'Los Mártires (Calle 2 / Hospital)', zone: 'Centro', metro: 'Estación 10 (Calle 2) o Estación 11 (Hospital)', tm: 'Troncal Caracas', conn: 'Acceso directo en viaducto Caracas' },
    'puente aranda': { name: 'Puente Aranda (Américas / Cra 50)', zone: 'Centro-Occidente', metro: 'Estación 7 (Américas) o Estación 8 (NQS con Cll 8 Sur)', tm: 'Troncal Américas / Troncal NQS', conn: 'Integración nodal Primero de Mayo y NQS' },
    tunjuelito: { name: 'Tunjuelito (General Santander)', zone: 'Sur', metro: 'Estación 9 (Calle 1 Sur con Caracas / General Santander)', tm: 'Troncal Caracas Sur / Troncal NQS', conn: 'Conexión desde Portal Tunal hacia Estación 9' },
    'ciudad bolivar': { name: 'Ciudad Bolívar (Mirador / Paraíso)', zone: 'Sur', metro: 'Estación 9 (Calle 1 Sur con Caracas) o Estación 1 (Bosa)', tm: 'TransMiCable / Troncal Tunal', conn: 'TransMiCable hasta Portal Tunal y conexión directa' },
    'ciudad bolívar': { name: 'Ciudad Bolívar (Mirador / Paraíso)', zone: 'Sur', metro: 'Estación 9 (Calle 1 Sur con Caracas) o Estación 1 (Bosa)', tm: 'TransMiCable / Troncal Tunal', conn: 'TransMiCable hasta Portal Tunal y conexión directa' },
    'san cristobal': { name: 'San Cristóbal (Portal 20 de Julio)', zone: 'Suroriente', metro: 'Estación 10 (Calle 2) o Estación 11 (Hospital)', tm: 'Troncal Carrera 10 (Portal 20 de Julio)', conn: 'Conexión Carrera 10 a Estación 10/11' },
    'san cristóbal': { name: 'San Cristóbal (Portal 20 de Julio)', zone: 'Suroriente', metro: 'Estación 10 (Calle 2) o Estación 11 (Hospital)', tm: 'Troncal Carrera 10 (Portal 20 de Julio)', conn: 'Conexión Carrera 10 a Estación 10/11' },
    'rafael uribe': { name: 'Rafael Uribe Uribe (Caracas Sur)', zone: 'Sur', metro: 'Estación 9 (Calle 1 Sur) o Estación 10 (Calle 2)', tm: 'Troncal Caracas Sur / Cra 10', conn: 'Alimentador hacia Av. Caracas' },
    usaquen: { name: 'Usaquén (Cra 15 / Cll 100 / Cll 127)', zone: 'Norte', metro: 'Estación 16 (Calle 72 con Caracas)', tm: 'Troncal Norte / Carrera 7ma', conn: 'Troncal Norte o bus zonal Cra 15/7' },
    'usaquén': { name: 'Usaquén (Cra 15 / Cll 100 / Cll 127)', zone: 'Norte', metro: 'Estación 16 (Calle 72 con Caracas)', tm: 'Troncal Norte / Carrera 7ma', conn: 'Troncal Norte o bus zonal Cra 15/7' },
    'barrios unidos': { name: 'Barrios Unidos (Calle 72 / Cll 63)', zone: 'Norte', metro: 'Estación 15 (Calle 63) o Estación 16 (Calle 72)', tm: 'Troncal Caracas / Troncal NQS', conn: 'Intercambiador modal Calle 72' },
    'calle 72': { name: 'Zona Financiera (Calle 72)', zone: 'Norte', metro: 'Estación 16 (Calle 72 con Caracas)', tm: 'Troncal Caracas / Carrera 7ma', conn: 'Intercambiador modal y conexión futura con Línea 2' }
  };

  // ==========================================================================
  // 1. MATRIZ DE CONEXIONES PRIORITARIAS OFICIALES Y POIs MODELO
  // ==========================================================================

  // Bosa ➔ Centro Comercial El Andino / Zona T (RESPUESTA MODELO EXACTA)
  if (
    q.includes('bosa') && 
    (q.includes('andino') || q.includes('el andino') || q.includes('atlantis') || q.includes('el retiro') || q.includes('zona t'))
  ) {
    if (l === 'EN') {
      return `🧭 **Suggested Route:** Bosa (Patio Taller / Bosa Centro) ➔ El Andino Mall (Chapinero / Zona T)
🔄 **Total Connections:** 2 boardings (1 transfer at $0 COP)

1. **Boarding 1 (Metro Line 1 Leg):** Board Line 1 at **Station 1 (Bosa)** or **Station 2** on Av. Villavicencio heading north towards Chapinero.
2. **Interchange / Transfer Point:** Alight at **Station 15 (Calle 63)** or **Station 16 (Calle 72 / Modal Interchange)**.
3. **Boarding 2 (Final Leg):** Take an SITP Zonal bus on Carrera 11 or Carrera 13 towards Calle 82, or walk 8 to 10 minutes along the pedestrian walkway of Zona T to the main entrance of **El Andino Mall**.

⏱️ **Estimated Time:** 32 minutes (Projected savings of over 45 minutes compared to traditional transit).
💡 **#BogotáModoMetro Tip:** Transfer between the Metro and Zonal bus with your TuLlave card within the 110-minute window for a $0 COP transfer.

[ACTION: OPEN_MAP_MODULE]`;
    }
    if (l === 'PT') {
      return `🧭 **Rota Sugerida:** Bosa (Pátio Oficina / Bosa Centro) ➔ Shopping El Andino (Chapinero / Zona T)
🔄 **Conexões Totais:** 2 embarques (1 baldeação a $0 COP)

1. **Embarque 1 (Trecho Metrô Linha 1):** Embarque na Linha 1 na **Estação 1 (Bosa)** ou **Estação 2** na Av. Villavicencio no sentido norte rumo a Chapinero.
2. **Ponto de Conexão / Baldeação:** Desembarque na **Estação 15 (Calle 63)** ou **Estação 16 (Calle 72 / Intercâmbio Modal)**.
3. **Embarque 2 (Trecho Final):** Pegue o ônibus SITP Zonal na Carrera 11 ou Carrera 13 até a Calle 82, ou caminhe de 8 a 10 minutos pelo calçadão da Zona T até a entrada principal do **Shopping El Andino**.

⏱️ **Tempo estimado:** 32 minutos (Economia projetada de mais de 45 minutos em relação ao transporte tradicional).
💡 **Dica #BogotáModoMetro:** Realize a troca entre o Metrô e o ônibus Zonal com seu cartão TuLlave dentro da janela de 110 minutos para garantir a baldeação a $0 COP.

[ACTION: OPEN_MAP_MODULE]`;
    }
    if (l === 'ZH') {
      return `🧭 **建议路线:** Bosa (车辆段 / Bosa 核心区) ➔ El Andino 购物中心 (Chapinero / T区)
🔄 **换乘总计:** 2次乘车（1次 $0 COP 免费换乘）

1. **第1程乘车（地铁一号线）:** 在 Av. Villavicencio 上的 **第1站 (Bosa)** 或 **第2站** 进站，搭乘向北往 Chapinero 方向的地铁列车。
2. **换乘中枢 / 换乘点:** 在 **第15站 (Calle 63)** 或 **第16站 (Calle 72 综合枢纽)** 下车。
3. **第2程乘车（最终接驳）:** 在 Carrera 11 或 Carrera 13 换乘 SITP 区域巴士至 Calle 82，或沿着 T 区步行街步行 8 至 10 分钟直达 **El Andino 购物中心** 主入口。

⏱️ **预计耗时:** 仅需32分钟（相比传统地面交通节省超45分钟）。
💡 **#BogotáModoMetro 文明贴士:** 使用实名 TuLlave 交通卡在 110 分钟窗口期内完成地铁与接驳公交换乘，享受 $0 COP 免费公铁换乘。

[ACTION: OPEN_MAP_MODULE]`;
    }
    if (l === 'JA') {
      return `🧭 **推奨ルート:** Bosa（車両基地 / Bosa中心部）➔ エル・アンディーノSC（Chapinero / Zona T）
🔄 **乗り換え合計:** 乗車2回（$0 COP 無料乗り換え1回）

1. **第1区間（地下鉄1号線）:** Av. Villavicencioの **第1駅（Bosa）** または **第2駅** よりチャピネロ方面（北行き）に乗車。
2. **乗り換え拠点 / 接続駅:** **第15駅（Calle 63）** または **第16駅（Calle 72 複合乗換中枢）** で下車。
3. **第2区間（最終区間）:** Carrera 11またはCarrera 13でSITP路線バスに乗車しCalle 82へ、またはZona Tの遊歩道を徒歩8〜10分で **El Andinoショッピングセンター** 正面入口へ。

⏱️ **所要時間（見込み）:** 32分（従来の交通と比較して45分以上の短縮）。
💡 **#BogotáModoMetro マナーのヒント:** TuLlaveカードで110分以内に乗り換えると、$0 COP（無料）で公鉄乗り換えが可能です。

[ACTION: OPEN_MAP_MODULE]`;
    }

    return `🧭 **Ruta Sugerida:** Bosa (Patio Taller / Bosa Centro) ➔ Centro Comercial El Andino (Chapinero / Zona T)
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

1. **Abordaje 1 (Tramo Metro Línea 1):** Aborda la Línea 1 en la **Estación 1 (Bosa)** o **Estación 2** sobre la Av. Villavicencio con sentido norte hacia Chapinero.
2. **Punto de Intercambio / Transbordo:** Desciende en la **Estación 15 (Calle 63)** o **Estación 16 (Calle 72 / Intercambiador Modal)**.
3. **Abordaje 2 (Tramo Final):** Toma bus SITP Zonal sobre la Carrera 11 o Carrera 13 hacia la Calle 82, o realiza una caminata de 8 a 10 minutos por el corredor peatonal de la Zona T hasta la entrada principal del **CC El Andino**.

⏱️ **Tiempo estimado:** 32 minutos (Ahorro proyectado de más de 45 minutos frente al transporte tradicional).
💡 **Tip #BogotáModoMetro:** Realiza el cambio entre el Metro y el bus Zonal con tu tarjeta TuLlave dentro de la ventana de 110 minutos para aprovechar el transbordo a $0 COP.

[ACTION: OPEN_MAP_MODULE]`;
  }

  // Fontibón ➔ Bosa
  if (((q.includes('fontibon') || q.includes('fontibón')) && q.includes('bosa'))) {
    if (l !== 'ES') return formatRouteResponse(POI_MAP.fontibon, POI_MAP.bosa, effectiveLang);
    return `🧭 **Ruta Sugerida:** Fontibón (Fontibón Centro / Cll 13) ➔ Bosa (Patio Taller / Bosa Centro)
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

1. **Abordaje 1 (Origen):** Toma bus SITP Zonal por la Calle 13 o Av. Esperanza en dirección hacia la Av. Boyacá o Av. de las Américas.
2. **Punto de Intercambio / Transbordo:** Ingresa a la Línea 1 del Metro en la **Estación 7 (Av. Primero de Mayo con Américas)** o **Estación 5 (Av. Primero de Mayo con Av. Boyacá)**.
3. **Abordaje 2 (Destino / Tramo Final):** Aborda el tren de la Línea 1 hacia el suroccidente por el viaducto elevado hasta descender en **Estación 1 (Patio Taller)** o **Estación 2 (Av. Cali)** en Bosa.

⏱️ **Tiempo estimado:** Ahorro aproximado de 45 a 60 minutos frente al transporte habitual.
💡 **Tip #BogotáModoMetro:** Con tu tarjeta TuLlave personalizada tienes 110 minutos para transbordar a $0 COP.

[ACTION: OPEN_MAP_MODULE]`;
  }

  // Bosa ➔ Fontibón
  if ((q.includes('bosa') && (q.includes('fontibon') || q.includes('fontibón')))) {
    if (l !== 'ES') return formatRouteResponse(POI_MAP.bosa, POI_MAP.fontibon, effectiveLang);
    return `🧭 **Ruta Sugerida:** Bosa (Patio Taller / Bosa Centro) ➔ Fontibón (Fontibón Centro / Cll 13)
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

1. **Abordaje 1 (Origen):** Aborda en **Estación 1 (Patio Taller)** o **Estación 2 (Av. Cali)** en el viaducto elevado de la Línea 1 hacia el norte.
2. **Punto de Intercambio / Transbordo:** Desciende en **Estación 7 (Primero de Mayo con Américas)** o **Estación 13 (Calle 26)**.
3. **Abordaje 2 (Destino / Tramo Final):** Conecta con bus SITP Zonal / Troncal Calle 13 o Calle 26 en dirección occidente hasta Fontibón Centro.

⏱️ **Tiempo estimado:** Ahorro proyectado de 50 minutos.
💡 **Tip #BogotáModoMetro:** Con tu tarjeta TuLlave personalizada tienes 110 minutos para transbordar a $0 COP.

[ACTION: OPEN_MAP_MODULE]`;
  }

  // Castilla ➔ Portal 80
  if ((q.includes('castilla') && (q.includes('portal 80') || q.includes('portal de la 80') || q.includes('calle 80')))) {
    if (l !== 'ES') return formatRouteResponse(POI_MAP.castilla, POI_MAP['portal 80'], effectiveLang);
    return `🧭 **Ruta Sugerida:** Castilla (Kennedy) ➔ Portal 80 (Engativá)
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

1. **Abordaje 1 (Origen):** Toma ruta zonal SITP o bus alimentador por la Av. de las Américas / Av. Cali desde Castilla.
2. **Punto de Intercambio / Transbordo:** Transborda en la **Estación 5 (Av. Primero de Mayo)** o conecta hacia la Troncal Calle 80.
3. **Abordaje 2 (Destino / Tramo Final):** Toma el bus articulado o zonal por la Troncal Calle 80 hasta el Portal 80.

⏱️ **Tiempo estimado:** Ahorro proyectado de 20 a 30 minutos.
💡 **Tip #BogotáModoMetro:** Usa tu tarjeta TuLlave personalizada para acceder al transbordo a $0 en la ventana de 110 minutos.

[ACTION: OPEN_MAP_MODULE]`;
  }

  // Portal 80 ➔ Castilla
  if (((q.includes('portal 80') || q.includes('portal de la 80') || q.includes('calle 80')) && q.includes('castilla'))) {
    if (l !== 'ES') return formatRouteResponse(POI_MAP['portal 80'], POI_MAP.castilla, effectiveLang);
    return `🧭 **Ruta Sugerida:** Portal 80 (Engativá) ➔ Castilla (Kennedy)
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

1. **Abordaje 1 (Origen):** Toma el bus articulado o zonal por la Troncal Calle 80 hacia el oriente o conecta en la Estación 16 (Calle 72).
2. **Punto de Intercambio / Transbordo:** Transborda hacia la **Estación 5 (Av. Primero de Mayo)** o conecta con la Troncal Av. de las Américas.
3. **Abordaje 2 (Destino / Tramo Final):** Toma ruta zonal SITP por la Av. de las Américas / Av. Cali hasta Castilla.

⏱️ **Tiempo estimado:** Ahorro proyectado de 20 a 30 minutos.
💡 **Tip #BogotáModoMetro:** Usa tu tarjeta TuLlave personalizada para acceder al transbordo a $0 en la ventana de 110 minutos.

[ACTION: OPEN_MAP_MODULE]`;
  }

  // Bosa ➔ Chapinero / Teusaquillo / Calle 72
  if ((q.includes('bosa') && (q.includes('chapinero') || q.includes('teusaquillo') || q.includes('calle 72') || q.includes('cll 72') || q.includes('72')))) {
    if (l !== 'ES') return formatRouteResponse(POI_MAP.bosa, POI_MAP.chapinero, effectiveLang);
    return `🧭 **Ruta Sugerida:** Bosa (Patio Taller) ➔ Chapinero (Zona Financiera Calle 72)
🔄 **Conexiones Totales:** 1 solo abordaje (0 transbordos)

1. **Abordaje 1 (Origen):** Aborda directamente en **Estación 1 (Patio Taller)** o **Estación 2 (Av. Cali)** en el viaducto elevado de la Línea 1.
2. **Punto de Intercambio / Transbordo:** Trayecto continuo y directo por el viaducto elevado sin necesidad de transbordo intermedio.
3. **Abordaje 2 (Destino / Tramo Final):** Desciende en **Estación 14 (Calle 45)**, **Estación 15 (Calle 63)** o **Estación 16 (Calle 72 / Intercambiador Modal)**.

⏱️ **Tiempo estimado:** 27 minutos de recorrido total (ahorro de más de 65 minutos frente a los 90-100 min actuales).
💡 **Tip #BogotáModoMetro:** Deja salir antes de ingresar a los vagones para agilizar el flujo de abordaje en las puertas automáticas PSD.

[ACTION: OPEN_MAP_MODULE]`;
  }

  // Usme ➔ Fontibón
  if ((q.includes('usme') && (q.includes('fontibon') || q.includes('fontibón')))) {
    if (l !== 'ES') return formatRouteResponse(POI_MAP.usme, POI_MAP.fontibon, effectiveLang);
    return `🧭 **Ruta Sugerida:** Usme (Portal Usme) ➔ Fontibón (Fontibón Centro / Cll 13)
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

1. **Abordaje 1 (Origen):** Toma alimentador o bus Troncal en Portal Usme en dirección norte por la Troncal Caracas.
2. **Punto de Intercambio / Transbordo:** Realiza transbordo en **Estación 9 (Calle 1 Sur con Caracas / General Santander)** e ingresa al viaducto de la Línea 1 del Metro.
3. **Abordaje 2 (Destino / Tramo Final):** Viaja en Metro hasta **Estación 7 (Primero de Mayo con Américas)** o **Estación 13 (Calle 26)** y toma SITP Zonal directo por Calle 13 hacia Fontibón Centro.

⏱️ **Tiempo estimado:** Ahorro aproximado de 55 a 65 minutos (tiempo total de ~35 minutos frente a los 95 minutos actuales).
💡 **Tip #BogotáModoMetro:** Con tu tarjeta TuLlave personalizada tienes una ventana de 110 minutos para transbordar a $0 COP.

[ACTION: OPEN_MAP_MODULE]`;
  }

  // Suba ➔ Bosa
  if ((q.includes('suba') && q.includes('bosa'))) {
    if (l !== 'ES') return formatRouteResponse(POI_MAP.suba, POI_MAP.bosa, effectiveLang);
    return `🧭 **Ruta Sugerida:** Suba (Portal Suba) ➔ Bosa (Patio Taller / Bosa Centro)
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

1. **Abordaje 1 (Origen):** Aborda en Troncal Suba (Portal Suba) o bus de conexión hacia el sur hasta la Calle 72.
2. **Punto de Intercambio / Transbordo:** Ingresa a la Línea 1 del Metro en el intercambiador de la **Estación 16 (Calle 72 con Av. Caracas)**.
3. **Abordaje 2 (Destino / Tramo Final):** Viaja en sentido suroccidente por el viaducto continuo de la Línea 1 hasta **Estación 1 (Patio Taller)** o **Estación 2 (Av. Cali)** en Bosa.

⏱️ **Tiempo estimado:** Ahorro de más de 50 minutos (trayecto total de ~45 minutos vs 1h 40m habituales).
💡 **Tip #BogotáModoMetro:** Haz la fila con orden en el andén y mantén libres las puertas automáticas PSD.

[ACTION: OPEN_MAP_MODULE]`;
  }

  // Engativá / Calle 26 ➔ Kennedy
  if (((q.includes('engativa') || q.includes('engativá') || q.includes('calle 26')) && q.includes('kennedy'))) {
    if (l !== 'ES') return formatRouteResponse(POI_MAP.engativa, POI_MAP.kennedy, effectiveLang);
    return `🧭 **Ruta Sugerida:** Engativá (Calle 26) ➔ Kennedy (Av. Primero de Mayo / Timiza)
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

1. **Abordaje 1 (Origen):** Toma Troncal Calle 26 (K) o bus zonal en dirección oriente hasta la Av. Caracas.
2. **Punto de Intercambio / Transbordo:** En **Estación 13 (Calle 26 con Caracas)**, transborda de forma directa a la Línea 1 del Metro en sentido suroccidente.
3. **Abordaje 2 (Destino / Tramo Final):** Viaja por el viaducto hasta descender en **Estación 4**, **Estación 5 (Timiza)** o **Estación 6 (Av. 68)** sobre el corredor de la Av. Primero de Mayo en Kennedy.

⏱️ **Tiempo estimado:** Ahorro aproximado de 40 a 50 minutos.
💡 **Tip #BogotáModoMetro:** Cuida las instalaciones y no consumas alimentos ni bebidas en estaciones o vagones.

[ACTION: OPEN_MAP_MODULE]`;
  }

  // Ciudad Bolívar / Tunal ➔ Zona Financiera (Cll 72)
  if (((q.includes('ciudad bolivar') || q.includes('ciudad bolívar') || q.includes('tunal')) && (q.includes('72') || q.includes('financiera') || q.includes('chapinero')))) {
    if (l !== 'ES') return formatRouteResponse(POI_MAP['ciudad bolivar'], POI_MAP.chapinero, effectiveLang);
    return `🧭 **Ruta Sugerida:** Ciudad Bolívar (Mirador del Paraíso / Tunal) ➔ Chapinero (Calle 72)
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

1. **Abordaje 1 (Origen):** Toma TransMiCable desde Mirador del Paraíso hasta Portal Tunal o bus alimentador hacia la Av. Caracas.
2. **Punto de Intercambio / Transbordo:** Conecta en **Estación 9 (Calle 1 Sur con Caracas)** e ingresa al viaducto elevado de la Línea 1 del Metro.
3. **Abordaje 2 (Destino / Tramo Final):** Viaja directo hacia el norte en la Línea 1 hasta descender en **Estación 16 (Calle 72 con Caracas)**.

⏱️ **Tiempo estimado:** Ahorro aproximado de 45 a 55 minutos.
💡 **Tip #BogotáModoMetro:** Paga tu pasaje con orgullo ciudadano; el Metro es patrimonio de todos los bogotanos.

[ACTION: OPEN_MAP_MODULE]`;
  }

  // Suba ➔ Plaza Central / Multiplaza
  if (q.includes('suba') && (q.includes('multiplaza') || q.includes('plaza central'))) {
    if (l !== 'ES') return formatRouteResponse(POI_MAP.suba, POI_MAP.multiplaza, effectiveLang);
    return `🧭 **Ruta Sugerida:** Suba (Portal Suba) ➔ CC Multiplaza / Plaza Central (Av. Boyacá con Cll 13)
🔄 **Conexiones Totales:** 3 abordajes (2 transbordos a $0)

1. **Abordaje 1 (Origen):** Toma Troncal Suba (Portal Suba) o bus zonal hacia el sur hasta la Calle 72.
2. **Punto de Intercambio / Transbordo:** En **Estación 16 (Calle 72 con Caracas)**, aborda la Línea 1 del Metro con sentido suroccidente.
3. **Abordaje 2 (Destino / Tramo Final):** Desciende en **Estación 5 (Av. Primero de Mayo con Av. Boyacá)** y toma SITP alimentador hacia el norte por la Boyacá hasta la entrada de Plaza Central / Multiplaza (Calle 13).

⏱️ **Tiempo estimado:** Ahorro aproximado de 50 a 60 minutos (viaje de ~45 minutos vs 1h 45m habituales).
💡 **Tip #BogotáModoMetro:** Haz la fila para permitir un flujo de movilidad continuo y seguro.

[ACTION: OPEN_MAP_MODULE]`;
  }

  // Fontibón ➔ Centro Mayor
  if ((q.includes('fontibon') || q.includes('fontibón')) && q.includes('centro mayor')) {
    if (l !== 'ES') return formatRouteResponse(POI_MAP.fontibon, POI_MAP['centro mayor'], effectiveLang);
    return `🧭 **Ruta Sugerida:** Fontibón (Fontibón Centro) ➔ Centro Comercial Centro Mayor (Autopista Sur)
🔄 **Conexiones Totales:** 2 abordajes (1 transbordo a $0)

1. **Abordaje 1 (Origen):** Aborda bus SITP Zonal por la Calle 13 o Calle 26 en dirección oriente.
2. **Punto de Intercambio / Transbordo:** Conecta en **Estación 7 (Primero de Mayo con Américas)** o **Estación 8 (NQS con Calle 8 Sur)** con la Línea 1 del Metro o Troncal NQS.
3. **Abordaje 2 (Destino / Tramo Final):** Desciende en Estación General Santander / Estación 8 y cruza por la pasarela techada peatonal directa a Centro Mayor.

⏱️ **Tiempo estimado:** Reducción de 90 a solo 28 minutos.
💡 **Tip #BogotáModoMetro:** Cede el asiento a personas mayores, mujeres embarazadas o personas con movilidad reducida.

[ACTION: OPEN_MAP_MODULE]`;
  }

  // Aeropuerto El Dorado
  if (q.includes('aeropuerto') || q.includes('el dorado') || q.includes('airport')) {
    return formatAirportRoute(effectiveLang);
  }

  // ==========================================================================
  // 2. EXTRACTOR DINÁMICO GENERAL ORIGEN ➔ DESTINO CON ENTRADAS OFICIALES
  // ==========================================================================
  let originKey = null;
  let destKey = null;

  const routeRegex = /(?:de |desde |from )?([a-záéíóúñ\s]+?)(?:\s+(?:a|hacia|hasta|al|to|para|到|まで)\s+)([a-záéíóúñ\s]+)/i;
  const match = q.match(routeRegex);

  if (match) {
    const rawOrigin = match[1].trim();
    const rawDest = match[2].trim();

    for (const key of Object.keys(POI_MAP)) {
      if (rawOrigin.includes(key)) originKey = key;
      if (rawDest.includes(key)) destKey = key;
    }
  }

  if (!originKey || !destKey) {
    const keysFound = [];
    for (const key of Object.keys(POI_MAP)) {
      const idx = q.indexOf(key);
      if (idx !== -1) {
        keysFound.push({ key, idx });
      }
    }
    keysFound.sort((a, b) => a.idx - b.idx);
    if (keysFound.length >= 2 && keysFound[0].key !== keysFound[1].key) {
      originKey = keysFound[0].key;
      destKey = keysFound[1].key;
    }
  }

  if (originKey && destKey && originKey !== destKey) {
    const orig = POI_MAP[originKey];
    const dest = POI_MAP[destKey];
    return formatRouteResponse(orig, dest, effectiveLang);
  }

  return null;
}

/**
 * Diccionario central de respuestas temáticas locales multilingües (ES, EN, PT, ZH, JA)
 */
function getLocalizedTopicResponse(topicKey, effectiveLang = 'ES') {
  const l = (effectiveLang || 'ES').toUpperCase();

  const TOPIC_RESPONSES = {
    greeting: {
      EN: `🤖 **Hello! I am MetroBot AI, the Official Artificial Intelligence of Empresa Metro de Bogotá on UrbanGo.**

I am at your service as Bogotá's intelligent multimodal GPS and transit itinerary assistant. I can guide you with technical precision and numerical accuracy on:

🧭 **Routes & Multimodal Connections:** Ask me how to travel from any origin to any destination in Bogotá (e.g., *"Usme to Fontibón"*, *"Bosa to Chapinero"*, *"Suba to Plaza Central"*, *"How do I get to the Airport?"*).
🚆 **Capacity & Technical Operations:** 1,800 passengers per train, 72,000 PHSM, commercial speed of 42.5 km/h, automatic GoA4 CBTC signaling, and continuous elevated viaduct.
🚧 **Official Construction Progress:** Viaduct at 82.33% accumulated execution, 6 active launching girders, Calle 72 interchange at 98%, and dynamic tests in late 2026.
💳 **Cards & Transfers:** TuLlave card (physical or NFC), 110-minute window with $0 COP transfers, and subsidized social fares (Sisbén, Seniors, and PwD).
💼 **Job Openings:** Official operational and technical positions managed 100% free with SENA and Metro Línea 1 S.A.S.
🌱 **#BogotáModoMetro Civic Culture:** Civic behavior rules, platform etiquette, School Train Car (Vagón Escuela), and civic pedagogy.

Which route or query would you like to plan today?`,
      PT: `🤖 **Olá! Sou o MetroBot IA, a Inteligência Artificial Oficial da Empresa Metro de Bogotá no UrbanGo.**

Estou a seu serviço como GPS inteligente multimodal e assistente de mobilidade urbana da cidade. Posso orientá-lo com precisão técnica e rigor numérico em:

🧭 **Rotas e Conexões Multimodais:** Pergunte-me como ir de qualquer origem a qualquer destino em Bogotá (ex: *"Usme a Fontibón"*, *"Bosa a Chapinero"*, *"Suba a Plaza Central"*, *"Como chego ao Aeroporto?"*).
🚆 **Capacidade e Operação Técnica:** Lotação de 1.800 passageiros por trem, 72.000 PHSM, velocidade comercial de 42.5 km/h, sistema CBTC GoA4 automático e viaduto elevado.
🚧 **Avanço Oficial das Obras:** Viaduto com 82,33% de avanço acumulado, 6 vigas lançadoras, intercambiador Calle 72 a 98% e testes dinâmicos no final de 2026.
💳 **Cartões e Baldeações:** Cartão TuLlave (físico ou NFC), janela de 110 minutos com baldeação a $0 COP e tarifas subsidiadas (Sisbén, Idosos e PCD).
💼 **Vagas de Emprego:** Informações oficiais de vagas operacionais e técnicas gratuitas com o SENA e Metro Línea 1 S.A.S.
🌱 **Cultura #BogotáModoMetro:** Normas de convivência cidadã, respeito nas plataformas, Vagão Escola e pedagogia urbana.

Qual trajeto ou dúvida você deseja planejar hoje?`,
      ZH: `🤖 **您好！我是 MetroBot IA，波哥大地铁公司（EMB）及 UrbanGo 官方出行智能AI助手。**

我致力于为您提供权威精准的波哥大综合交通导航与出行规划服务，具备严谨的数据支持：

🧭 **全网换乘与路径规划:** 您可以随时查询波哥大任意起讫点出行方案（例如：*“Usme 到 Fontibón”*、*“Bosa 到 Chapinero”*、*“Suba 到 Plaza Central”*、*“如何前往埃尔多拉多机场？”*）。
🚆 **额定载客与技术标准:** 单列车载客量 1,800人、高峰运力 72,000人次/小时/单向（PHSM）、商业运营时速 42.5 km/h、GoA4级无人驾驶 CBTC 信号系统及全线高架。
🚧 **官方工程最新进展:** 高架桥累计完成 82.33%、6台大型架桥机同步施工作业、72街立体互通达 98%、2026年末启动车辆动态实测。
💳 **交通卡与优惠换乘:** TuLlave 卡（实体卡或手机NFC）、110分钟窗口期内 $0 COP 免费公铁换乘及政府优抚直补（Sisbén、长者及残障人士）。
💼 **公开直聘岗位公告:** 由哥伦比亚国家职业培训局（SENA）与 Metro Línea 1 S.A.S. 特许经营公司联合推出的全免费技术实训与就业岗位。
🌱 **#BogotáModoMetro 文明倡议:** 公民文明出行规范、候车秩序、地铁科普教学车厢（Vagón Escuela）与市民实操实训。

今天有什么出行路线或地铁问题需要我为您解答？`,
      JA: `🤖 **こんにちは！私は MetroBot IA、ボゴタ地下鉄（EMB）および UrbanGo 公式都市モビリティ・AIアシスタントです。**

ボゴタ全域のマルチモーダルGPS・移動案内として、正確な数値と公式データに基づいてご案内いたします：

🧭 **ルートと乗換案内:** ボゴタ市内のあらゆる出発地から目的地までの経路案内（例：*「ウスメからフォンティボンへ」*、*「ボサからチャピネロへ」*、*「スバからプラザ・セントラルへ」*、*「空港への行き方」* など）。
🚆 **定員と技術仕様:** 編成定員1,800名、最大輸送力毎时片道72,000名（PHSM）、表定速度42.5 km/h、GoA4全自動無人運転CBTCシステム、完全高架橋構造。
🚧 **公式工事進捗:** 高架橋累積進捗82.33%、架橋機6台稼働中、Calle 72立体交差98%、2026年第4四半期に車両走行試験開始。
💳 **ICカードと運賃制度:** TuLlaveカード（ICまたはNFC）、110分以内 $0 COP（無料）乗り換え制度、福祉優遇割引運賃。
💼 **採用・求人情報:** SENA公的雇用庁およびMetro Línea 1 S.A.S.を通じた完全無料の技術・運行職採用。
🌱 **#BogotáModoMetro 市民マナー:** 整列乗車、乗降マナー、体験型スクール車両（Vagón Escuela）、市民教育プログラム。

本日はどのようなルートやご質問を調べますか？`,
      ES: `🤖 **¡Hola! Soy MetroBot IA, la Inteligencia Artificial Oficial de la Empresa Metro de Bogotá en UrbanGo.**

Estoy a tu servicio como GPS inteligente multimodal y asistente de movilidad de la ciudad. Puedo orientarte con precisión técnica y rigor numérico en:

🧭 **Rutas y Conexiones Multimodales:** Pregúntame cómo ir de cualquier origen a cualquier destino en Bogotá (ej: *"Usme a Fontibón"*, *"Bosa a Chapinero"*, *"Suba a Plaza Central"*, *"¿Cómo llego al Aeropuerto?"*).
🚆 **Aforo y Operación Técnica:** Capacidad de 1.800 pasajeros por tren, 72.000 PHSM, velocidad comercial de 42.5 km/h, sistema CBTC GoA4 automático y viaducto elevado.
🚧 **Avance de Obra Oficial:** Viaducto al 82,33% de avance acumulado, 6 vigas lanzadoras, intercambiador Calle 72 al 98% y pruebas dinámicas en el último trimestre de 2026.
💳 **Tarjetas y Transbordos:** Tarjeta TuLlave (física o NFC), ventana de 110 minutos con transbordo a $0 COP y tarifas subsidiadas (Sisbén, Adulto Mayor y PCD).
💼 **Convocatorias de Empleo:** Información oficial de vacantes operativas y técnicas gratuitas con el SENA y Metro Línea 1 S.A.S.
🌱 **Cultura #BogotáModoMetro:** Normas de convivencia cívica, respeto en andenes, Vagón Escuela y pedagogía ciudadana.

¿Qué consulta o recorrido deseas planificar hoy?`
    },
    thanks: {
      EN: `🚆 **You are very welcome!** At **Empresa Metro de Bogotá** and **UrbanGo**, we are here to assist you and make every minute of your trip count.

Remember to practice **#BogotáModoMetro** daily: queue calmly, let passengers exit before boarding, and care for the transport system transforming Bogotá. Have a great journey!`,
      PT: `🚆 **Com o maior prazer!** Na **Empresa Metro de Bogotá** e no **UrbanGo**, estamos à sua disposição para que cada minuto da sua viagem seja produtivo.

Lembre-se de viver o **#BogotáModoMetro** todos os dias: faça a fila com calma, deixe sair antes de entrar e cuide do transporte de Bogotá. Boa viagem!`,
      ZH: `🚆 **非常荣幸为您服务！** **波哥大地铁公司（EMB）** 与 **UrbanGo** 竭诚为您的便捷出行保驾护航。

请与我们共同践行 **#BogotáModoMetro** 文明乘车理念：文明排队、先下后上、爱护公共交通设施。祝您旅途愉快！`,
      JA: `🚆 **どういたしまして！** **ボゴタ地下鉄（EMB）** と **UrbanGo** は、皆様の安全で快適な移動をサポートいたします。

**#BogotáModoMetro** のマナーの実践にご協力ください。整列乗車、降りる人が先、公共交通を大切に。良い一日を！`,
      ES: `🚆 **¡Con el mayor gusto!** En la **Empresa Metro de Bogotá** y **UrbanGo** estamos para servirte y hacer que cada minuto de tu viaje cuente.

Recuerda vivir a diario el **#BogotáModoMetro**: haz la fila con calma, deja salir antes de entrar y cuida el sistema de transporte que transformará a Bogotá. ¡Buen viaje!`
    },
    aforo: {
      EN: `🚆 **Bogotá Metro Passenger Capacity:**
Each Line 1 train consists of 6 100% electric cars with a capacity for **1,800 passengers**. The system is engineered to transport up to **72,000 passengers per hour per direction** (PHSM) and over **1,000,000 passengers per day** on Line 1.`,
      PT: `🚆 **Capacidade e Lotação do Metrô de Bogotá:**
Cada trem da Linha 1 possui 6 vagões 100% elétricos com capacidade para **1.800 passageiros**. O sistema foi projetado para transportar até **72.000 passageiros por hora/sentido** (PHSM) e mais de **1.000.000 de passageiros por dia** na Linha 1.`,
      ZH: `🚆 **波哥大地铁运力与客载定员：**
地铁一号线每列列车编组6节100%纯电动车厢，额定载客量为 **1,800名乘客**。系统最高设计运力达到 **单向每小时72,000人次（PHSM）**，一号线全线日均客运量超 **1,000,000人次**。`,
      JA: `🚆 **ボゴタ地下鉄の定員と輸送能力：**
1号線の各編成は100%電気駆動の6両編成で、定員は **1,800名** です。最大輸送力は **毎時片道72,000名（PHSM）**、1号線全体で **1日100万人以上** の旅客輸送を担います。`,
      ES: `🚆 **Aforo y Capacidad del Metro de Bogotá:**
Cada tren de la Línea 1 consta de 6 vagones 100% eléctricos y cuenta con capacidad para **1.800 pasajeros**. El sistema está diseñado para movilizar hasta **72.000 pasajeros por hora/sentido** (PHSM) y más de **1.000.000 de pasajeros al día** en la Línea 1.`
    },
    velocidad: {
      EN: `⚡ **Speed and Travel Times (Line 1):**
• **Average commercial speed:** **42.5 km/h** (including station dwell times).
• **Maximum design speed:** **80 km/h**.
• **Train frequency:** Intervals of **100 to 140 seconds** during peak hours.
• **Time savings:** Reduces the journey from Bosa to Calle 72 from 80-100 minutes down to just **27 minutes**.`,
      PT: `⚡ **Velocidade e Tempos de Viagem (Linha 1):**
• **Velocidade comercial média:** **42.5 km/h** (incluindo paradas).
• **Velocidade máxima de projeto:** **80 km/h**.
• **Frequência entre trens:** Intervalos de **100 a 140 segundos** nos horários de pico.
• **Economia de tempo:** Reduz o trajeto de Bosa até a Calle 72 de 80-100 minutos para apenas **27 minutos**.`,
      ZH: `⚡ **运行速度与旅行时间测算（一号线）：**
• **平均商业运营时速：** **42.5 km/h**（含各站停站与开关门耗时）。
• **最高设计时速：** **80 km/h**。
• **高峰发车间隔：** **100 至 140 秒**（自动无人驾驶频次）。
• **大幅缩短通勤时间：** 从 Bosa 到 Calle 72 全程仅需 **27分钟**（传统交通需80至100分钟）。`,
      JA: `⚡ **運行速度と所要時間（1号線）：**
• **平均表定速度：** **42.5 km/h**（駅停車時間を含む）。
• **最高設計速度：** **80 km/h**。
• **ラッシュ時運行間隔：** **100〜140秒** 間隔。
• **移動時間の大幅短縮：** BosaからCalle 72まで通常80〜100分かかるところをわずか **27分** で結びます。`,
      ES: `⚡ **Velocidad y Tiempos de Viaje (Línea 1):**
• **Velocidad comercial promedio:** **42.5 km/h** (incluyendo paradas en estaciones).
• **Velocidad máxima de diseño:** **80 km/h**.
• **Frecuencia entre trenes:** Intervalos de **100 a 140 segundos** en horas pico.
• **Ahorro de tiempo:** Reduce el trayecto de Bosa a la Calle 72 de 80-100 minutos a solo **27 minutos**.`
    },
    tecnica: {
      EN: `🎛️ **Technical Specifications and Operation:**
• **Rolling Stock:** 100% electric trains on standard steel rails.
• **Signaling & Control:** CBTC (Communication-Based Train Control) with **GoA4** driverless automation.
• **Energy Efficiency:** Regenerative braking returns up to **30% of energy** back to the electrical grid.
• **Alignment:** 100% elevated continuous viaduct of 23.9 km at an average height of **13.5 meters**.`,
      PT: `🎛️ **Especificações Técnicas e Operação:**
• **Material Rodante:** Trens 100% elétricos sobre trilhos de aço.
• **Sistema de Controle:** CBTC com automação **GoA4** (operação sem condutor).
• **Eficiência Energética:** Frenagem regenerativa devolve até **30% da energia** à rede elétrica.
• **Traçado:** Viaduto 100% elevado de 23,9 km a **13,5 metros** de altura média.`,
      ZH: `🎛️ **技术规格与系统运行标准：**
• **车辆制式：** 100% 纯电动钢轮钢轨制式列车。
• **信号控制：** 基于通信的列车控制系统（CBTC），具备 **GoA4 级全自动无人驾驶** 功能。
• **节能环保：** 配备再生制动能量回收装置，可向电网回馈高达 **30% 的再生电能**。
• **线路结构：** 全长 23.9 公里全线连续高架桥，桥面平均净空高度达 **13.5米**。`,
      JA: `🎛️ **技術仕様および運行システム：**
• **走行方式：** 鋼製レール上を走る100%電気駆動車両。
• **制御システム：** CBTC（無線列車制御システム）による **GoA4 完全自動無人運転**。
• **省エネ性能：** 回生ブレーキにより最大 **30%の電力** を送電網に回生。
• **構造形式：** 全長23.9kmの完全連続高架構造（平均高さ **13.5m**）。`,
      ES: `🎛️ **Especificaciones Técnicas y Operación:**
• **Rodadura:** Trenes 100% eléctricos sobre rieles de acero.
• **Sistema de Control:** CBTC (Communication-Based Train Control) con automatización **GoA4** (operación sin conductor).
• **Eficiencia energética:** Frenado regenerativo que devuelve hasta un **30% de la energía** a la red eléctrica.
• **Trazado:** Viaducto 100% elevado de 23,9 km a **13,5 metros** de altura promedio.`
    },
    cronograma: {
      EN: `📅 **Official Schedule & Delivery of Line 1:**
• **Current Progress (2026):** Viaduct accumulated execution at **82.33%** with 6 launching girders active in Bosa, Av. Primero de Mayo, and Av. Caracas.
• **Dynamic Train Testing:** Commencing in the **last quarter of 2026** on the 5.7 km test track at the Bosa Yard.
• **Trial Run & Integrated Testing:** Synchronization of the GoA4 CBTC system throughout 2027.
• **Official Commercial Opening:** Scheduled for the **first half of 2028**, mobilizing over 1,000,000 passengers daily.

[ACTION: OPEN_NEWS_MODULE]`,
      PT: `📅 **Cronograma Oficial de Entrega e Operação da Linha 1:**
• **Avanço atual (2026):** Viaduto acumulado em **82,33%** de execução com 6 vigas lançadoras ativas em Bosa, Av. Primero de Mayo e Av. Caracas.
• **Testes dinâmicos com trens:** Início no **último trimestre de 2026** na via de testes de 5,7 km no Pátio de Bosa.
• **Fase de testes integrados:** Sincronização do sistema GoA4 CBTC durante todo o ano de 2027.
• **Início da operação comercial:** Programado para o **primeiro semestre de 2028**, transportando mais de 1.000.000 de passageiros/dia.

[ACTION: OPEN_NEWS_MODULE]`,
      ZH: `📅 **一号线权威建设工期与通车节点：**
• **当前实测进展（2026）：** 全线高架桥施工进度累计达 **82.33%**，6台大型架桥机正在 Bosa、Primero de Mayo 及 Caracas 标段全天候作业。
• **车辆动态上线调试：** 将于 **2026年第四季度** 在 Bosa 车辆基地 5.7 公里试验线正式启动。
• **全自动联调联试与空载试运行：** 2027年全年进行 GoA4 CBTC 信号系统综合测试。
• **官方正式商业载客运营：** 定于 **2028年上半年** 正式开通，日均运送乘客超 1,000,000 人次。

[ACTION: OPEN_NEWS_MODULE]`,
      JA: `📅 **1号線 公式スケジュールと開業予定：**
• **現在進捗（2026年）：** 高架橋工事の累積進捗は **82.33%**、架橋機6台がBosa、Primero de Mayo、Av. Caracasで稼働中。
• **車両動的走行試験：** **2026年第4四半期** にBosa車両基地の5.7km試験線にて開始。
• **総合試運転フェーズ：** 2027年を通じてGoA4 CBTCシステムの同期・安全試験を実施。
• **公式商業運行開始：** **2028年上半期** に正式開業予定、1日100万人以上を輸送。

[ACTION: OPEN_NEWS_MODULE]`,
      ES: `📅 **Cronograma Oficial de Entrega y Operación de la Línea 1:**
• **Avance actual (2026):** Viaducto acumulado al **82,33%** de ejecución con 6 vigas lanzadoras activas en Bosa, Av. Primero de Mayo y Av. Caracas.
• **Pruebas dinámicas con trenes:** Inician en el **último trimestre de 2026** en la vía de prueba de 5,7 km en el Patio Taller de Bosa.
• **Fase de marcha blanca y ensayos integrados:** Sincronización del sistema CBTC GoA4 durante todo 2027.
• **Inicio de operación comercial oficial:** Programado para el **primer semestre de 2028**, movilizando a más de 1.000.000 de pasajeros al día.

[ACTION: OPEN_NEWS_MODULE]`
    },
    horarios: {
      EN: `🕒 **Official Projected Operating Hours (Line 1):**
• **Monday to Saturday:** From **4:30 a.m. to 11:30 p.m.**
• **Sundays & Holidays:** From **5:00 a.m. to 10:30 p.m.**
• **Peak hour frequency:** Automated trains every **100 to 140 seconds** (under 2.5 minutes wait time).
• **Off-peak frequency:** Continuous 3 to 5-minute intervals managed by the GoA4 system.`,
      PT: `🕒 **Horários Oficiais de Operação Projetados (Linha 1):**
• **Segunda a Sábado:** Das **4:30 a.m. às 11:30 p.m.**
• **Domingos e Feriados:** Das **5:00 a.m. às 10:30 p.m.**
• **Frequência em horários de pico:** Trens automáticos a cada **100 a 140 segundos** (menos de 2,5 minutos de espera).
• **Frequência em horários de vale:** Intervalos contínuos de 3 a 5 minutos garantidos pelo sistema GoA4.`,
      ZH: `🕒 **波哥大地铁一号线官方规划运营服务时间：**
• **周一至周六：** **04:30 至 23:30**
• **周日及法定节假日：** **05:00 至 22:30**
• **早晚高峰发车间隔：** GoA4 全自动无人驾驶列车每 **100 至 140 秒** 一班（平均候车低于2.5分钟）。
• **平峰期发车间隔：** 3 至 5 分钟稳定高频运转。`,
      JA: `🕒 **ボゴタ地下鉄1号線 公式運行予定時間：**
• **月曜〜土曜：** **4:30〜23:30**
• **日曜・祝日：** **5:00〜22:30**
• **ラッシュ時運行間隔：** GoA4全自動運転により **100〜140秒** ごとに運行（待ち時間2.5分未満）。
• **オフピーク時運行間隔：** 3〜5分の高頻度運行を維持。`,
      ES: `🕒 **Horarios Oficiales Proyectados de Operación (Línea 1):**
• **Lunes a Sábado:** De **4:30 a.m. a 11:30 p.m.**
• **Domingos y Festivos:** De **5:00 a.m. a 10:30 p.m.**
• **Frecuencia en horas pico:** Trenes automáticos cada **100 a 140 segundos** (menos de 2.5 minutos de espera).
• **Frecuencia en horas valle:** Intervalos continuos de 3 a 5 minutos garantizados por el sistema GoA4.`
    },
    tullave: {
      EN: `💳 **Cards, Fares, and Transfers (Unified System):**
• **Payment method:** TuLlave card (physical or digital NFC).
• **Transfer window:** **110 minutes with $0 COP transfers** between Metro, TransMilenio, and SITP zonal buses.
• **Guaranteed subsidized fares:**
  - **Seniors (62+ years):** Monthly district fare subsidy.
  - **Sisbén IV (A1 to B7):** Preferential discounted fares per ride.
  - **People with Disabilities (PwD):** Monthly transport subsidy credited directly to the card.

[ACTION: OPEN_BALANCE_MODULE]`,
      PT: `💳 **Cartões, Tarifas e Baldeações (Sistema Unificado):**
• **Forma de pagamento:** Cartão TuLlave (físico ou NFC digital).
• **Janela de baldeação:** **110 minutos com baldeação a $0 COP** entre Metrô, TransMilenio e ônibus zonais do SITP.
• **Tarifas subsidiadas garantidas:**
  - **Idosos (62+ anos):** Subsídio tarifário mensal distrital.
  - **Sisbén IV (A1 a B7):** Tarifa preferencial subsidiada por viagem.
  - **Pessoas com Deficiência (PCD):** Crédito mensal subsidiado no cartão.

[ACTION: OPEN_BALANCE_MODULE]`,
      ZH: `💳 **交通卡、票价与换乘政策（全网一票制体系）：**
• **支付介质：** TuLlave 交通卡（实体卡或手机 NFC 虚拟卡）。
• **免费换乘期：** **110分钟窗口期内 $0 COP 免费公铁换乘**（适用于波哥大地铁、TransMilenio 快速公交及 SITP 普线）。
• **专项优待政策补贴：**
  - **62岁以上长者:** 享受波哥大首都区定向月度出行补贴。
  - **Sisbén IV 重点优抚群体（A1-B7）:** 每单程享受政府票价优惠直减。
  - **残障人士（PCD）:** 每月定向交通专项补贴直接打入交通卡。

[ACTION: OPEN_BALANCE_MODULE]`,
      JA: `💳 **乗車カード、運賃体系および乗り換え制度：**
• **支払方法：** TuLlaveカード（ICカードまたはスマホNFC対応）。
• **無料乗り換え制度：** 地下鉄・トランスミレニオ・SITPバス間は **110分以内 $0 COP（無料）** で乗り換え可能。
• **優遇・割引運賃制度：**
  - **シニア（62歳以上）：** 首都区月額運賃補助制度。
  - **Sisbén IV 支援対象者（A1〜B7）：** 1乗車ごとの優遇補助運賃。
  - **障害をお持ちの方（PCD）：** カードへの直接月額交通手当付与。

[ACTION: OPEN_BALANCE_MODULE]`,
      ES: `💳 **Tarjetas, Tarifas y Transbordos (Sistema Unificado):**
• **Medio de pago:** Tarjeta TuLlave (física o NFC digital).
• **Ventana de transbordo:** **110 minutos con transbordo a $0 COP** entre Metro, TransMilenio y buses zonales del SITP.
• **Tarifas preferenciales garantizadas:**
  - **Adultos Mayores (62+ años):** Tarifa con subsidio mensual distrital.
  - **Sisbén IV (A1 a B7):** Tarifa preferencial con pasajes subsidiados por viaje.
  - **Personas con Discapacidad (PCD):** Subsidio mensual de transporte cargado a la tarjeta.

[ACTION: OPEN_BALANCE_MODULE]`
    },
    avance: {
      EN: `🚧 **Official Construction Progress (2026 Data):**
• **Viaduct accumulated physical progress:** **82.33%** completed.
• **Equipment:** **6 launching girders** active in Bosa, Av. Primero de Mayo, and Av. Caracas.
• **Calle 72 Interchange:** **98% progress** (including 120-meter underground pedestrian tunnel for future connection to Line 2).
• **Dynamic testing:** Beginning at the Bosa Yard test track in the **last quarter of 2026**.

[ACTION: OPEN_NEWS_MODULE]`,
      PT: `🚧 **Avanço Oficial das Obras (Dados a 2026):**
• **Execução física acumulada do viaduto:** **82,33%** concluída.
• **Equipamentos:** **6 vigas lançadoras** ativas em Bosa, Av. Primero de Mayo e Av. Caracas.
• **Intercambiador Calle 72:** **98% de avanço** (inclui galeria subterrânea de pedestres de 120 metros para conexão com a Linha 2).
• **Testes dinâmicos:** Início no trecho de testes do Pátio de Bosa no **último trimestre de 2026**.

[ACTION: OPEN_NEWS_MODULE]`,
      ZH: `🚧 **官方工程最新进展（2026权威数据）：**
• **全线高架桥主体施工进度：** 累计达到 **82.33%**。
• **重型设备配置：** **6台架桥机** 在 Bosa、Primero de Mayo 及 Av. Caracas 全速施工。
• **72街立体换乘中枢（Calle 72）：** **进度已达 98%**（含长达120米通往未来二号线的地下人行接驳廊道）。
• **车辆动态实跑测试：** **2026年第四季度** 在 Bosa 车辆基地试验线全面启动。

[ACTION: OPEN_NEWS_MODULE]`,
      JA: `🚧 **公式工事進捗データ（2026年最新）：**
• **高架橋本体の累積施工進捗：** **82.33%** を達成。
• **稼働設備：** Bosa、Primero de Mayo、Av. Caracasにて **6基の架橋機** が稼働中。
• **Calle 72立体交差中枢：** **進捗98%**（将来の2号線接続用120m地下連絡通路を含む）。
• **車両走行試験（動的試験）：** **2026年第4四半期** にBosa車両基地試験線にて開始予定。

[ACTION: OPEN_NEWS_MODULE]`,
      ES: `🚧 **Avance de Obra Oficial (Datos a 2026):**
• **Avance físico acumulado del viaducto:** **82,33%** de ejecución.
• **Equipamiento:** **6 vigas lanzadoras** activas en Bosa, Av. Primero de Mayo y Av. Caracas.
• **Intercambiador Calle 72:** **98% de avance** (incluye galería peatonal subterránea de 120 metros para conexión futura con Línea 2).
• **Pruebas dinámicas:** Inicio en el tramo de prueba del Patio Taller de Bosa en el **último trimestre de 2026**.

[ACTION: OPEN_NEWS_MODULE]`
    },
    empleo: {
      EN: `💼 **Official Job Openings for Bogotá Metro Line 1:**

Operational positions (CBTC rail traffic operators, high-voltage electricians, electromechanical technicians, and track inspectors) are managed 100% free through the **SENA Public Employment Agency** (ape.sena.edu.co) and concessionaire **Metro Línea 1 S.A.S.** (metrolinea1.com).

🔧 **Available Technical & Operational Roles:**
• **CBTC Rail Traffic Controllers & Operators:** Monitoring and operating automatic trains with GoA4 driverless technology.
• **Medium & High Voltage Electrical Technicians:** Maintenance of traction power substations (SET) and overhead catenaries.
• **Electromechanical Technicians & Track Inspectors:** Diagnostics and maintenance of permanent track and turnout points.
• **Civil Works & Assembly Assistants:** Entry-level and experienced roles with paid certified technical training.

📢 **Official & Free Application Channels:**
1. **SENA Public Employment Agency:** Official portal **ape.sena.edu.co**.
2. **Concessionaire Metro Línea 1 S.A.S.:** Talent portal **www.metrolinea1.com**.
3. **Empresa Metro de Bogotá (EMB):** Institutional website **www.metrodebogota.gov.co**.

⚠️ Applications are completely free of charge. No legitimate recruiter charges for interviews, medical exams, or onboarding.

[ACTION: OPEN_EMPLOYMENT_MODULE]`,
      PT: `💼 **Convocatórias de Emprego Oficiais da Linha 1 do Metrô de Bogotá:**

As vagas operacionais (operadores CBTC, eletricistas de média e alta tensão, técnicos eletromecânicos e inspetores de via) são gerenciadas 100% gratuitamente por meio da **Agência Pública de Emprego do SENA** (ape.sena.edu.co) e da concessionária **Metro Línea 1 S.A.S.** (metrolinea1.com).

🔧 **Perfis Técnicos e Operacionais Disponíveis:**
• **Controladores e Operadores de Tráfego Ferroviário CBTC:** Monitoramento e condução de trens automáticos com tecnologia GoA4 sem condutor.
• **Técnicos Eletricistas de Média e Alta Tensão:** Manutenção de subestações de tração (SET) e catenárias.
• **Técnicos Eletromecânicos e Inspetores de Via Permanente:** Diagnóstico e manutenção de trilhos e aparelhos de via.
• **Auxiliares de Obras Civis e Montagem:** Vagas com e sem experiência prévia com treinamento técnico remunerado.

📢 **Canais Oficiais e Gratuitos de Candidatura:**
1. **Agência Pública de Emprego do SENA:** Portal oficial **ape.sena.edu.co**.
2. **Concessionária Metro Línea 1 S.A.S.:** Portal de talentos **www.metrolinea1.com**.
3. **Empresa Metro de Bogotá (EMB):** Site institucional **www.metrodebogota.gov.co**.

⚠️ Os processos seletivos são totalmente gratuitos. Nenhum intermediário cobra taxas para exames médicos ou cadastramento de currículos.

[ACTION: OPEN_EMPLOYMENT_MODULE]`,
      ZH: `💼 **波哥大地铁一号线官方公开招聘与就业岗位：**

所有一线运营与工程技术岗位（CBTC无人驾驶调度员、高压电气工程师、机电维保技师及线路巡检员）均 100% 免费由 **哥伦比亚国家学徒服务局（SENA）公共就业服务平台**（ape.sena.edu.co）与 **Metro Línea 1 S.A.S.特许经营公司**（metrolinea1.com）联合直招。

🔧 **热招技术与运营岗位类别：**
• **CBTC 铁路列车调度员与控制中心操作员：** 负责GoA4全自动无人驾驶列车系统的监控与运行调度。
• **中高压电气维护技师：** 负责牵引变电所（SET）与接触网供电系统的维护检修。
• **机电技工与轨道线路巡检员：** 负责钢轨几何尺寸、道岔及机电设备的状态诊断与周期保养。
• **土建施工与轨道装配普工/学徒：** 提供带薪专业技术实训，欢迎有无工程经验者报名。

📢 **官方直聘报名渠道（绝无中介费）：**
1. **SENA 公共就业服务局:** 官方平台 **ape.sena.edu.co**。
2. **Metro Línea 1 S.A.S. 特许经营公司:** 招聘官网 **www.metrolinea1.com**。
3. **波哥大地铁公司 (EMB):** 官方网站 **www.metrodebogota.gov.co**。

⚠️ 所有岗位应聘与考评均 100% 免费。严禁向求职者收取体检费、建档费或入职中介费。

[ACTION: OPEN_EMPLOYMENT_MODULE]`,
      JA: `💼 **ボゴタ地下鉄1号線 公式採用・求人情報：**

運行・技術職（CBTC自動運転指令員、高圧電気技術者、電気機械技術者、軌道保守員）の選考は、**SENA（国家職業訓練庁）公的雇用庁**（ape.sena.edu.co）およびコンセッショネア**Metro Línea 1 S.A.S.**（metrolinea1.com）を通じて **完全無料** で実施されています。

🔧 **募集中の技術・運行職種：**
• **CBTC 運行管理指令員および運行担当者：** GoA4自動運転技術を搭載した列車の運行監視および制御センター業務。
• **中高圧電気保守技術者：** 牽引変電所（SET）および架線システムの保守・点検業務。
• **電気機械技術者および軌道保守員：** 軌道、分岐器、地上設備の診断・定期維持管理。
• **土木・架設補助員：** 有給での技術研修制度あり、未経験者・経験者ともに応募可能。

📢 **公式・無料の応募窓口：**
1. **SENA 公的雇用庁 (APE):** 公式ポータル **ape.sena.edu.co**。
2. **コンセッショネア Metro Línea 1 S.A.S.:** 採用ポータル **www.metrolinea1.com**。
3. **Empresa Metro de Bogotá (EMB):** 機関サイト **www.metrodebogota.gov.co**。

⚠️ 応募手続きは完全無料です。健康診断や履歴書受付に関して金銭を要求する仲介業者には十分ご注意ください。

[ACTION: OPEN_EMPLOYMENT_MODULE]`,
      ES: `💼 **Convocatorias Laborales Oficiales de la Primera Línea del Metro de Bogotá:**

Las vacantes operativas (operadores y controladores de tráfico CBTC, técnicos electricistas de media y alta tensión, electromecánicos e inspectores de vía) se gestionan de forma 100% gratuita a través de la **Agencia Pública de Empleo del SENA** (ape.sena.edu.co) y el concesionario **Metro Línea 1 S.A.S.** (metrolinea1.com).

🔧 **Vacantes Técnicas y Operativas Disponibles:**
* **Operadores y Controladores de Tráfico Ferroviario CBTC:** Monitoreo y operación de trenes automáticos con tecnología GoA4.
* **Técnicos Electricistas de Media y Alta Tensión:** Mantenimiento de subestaciones de tracción (SET) y catenarias.
* **Técnicos Electromecánicos e Inspectores de Vía Permanente:** Monitoreo, diagnóstico y mantenimiento de rieles y aparatos de vía.
* **Auxiliares de Obra Civil y Montaje:** Plazas con y sin experiencia previa con formación técnica remunerada.

📢 **Canales Oficiales y Gratuitos de Postulación:**
1. **Agencia Pública de Empleo del SENA:** Portal web oficial **ape.sena.edu.co**.
2. **Concesionario Metro Línea 1 S.A.S.:** Portal de talento **www.metrolinea1.com**.
3. **Empresa Metro de Bogotá (EMB):** Sitio web institucional **www.metrodebogota.gov.co**.

⚠️ Las postulaciones son totalmente gratuitas. Ningún intermediario cobra por vinculación laboral.

[ACTION: OPEN_EMPLOYMENT_MODULE]`
    },
    cultura: {
      EN: `🌱 **Metro Culture and #BogotáModoMetro:**
• **Campaign:** **#BogotáModoMetro** and **#MetroTransMilenioEsUno**.
• **Golden Rules:**
  1. Do not consume food or beverages inside stations or train cars.
  2. Always queue patiently to allow smooth passenger flow.
  3. Let passengers exit before boarding train cars.
  4. Keep circulation areas, PSD doors, and escalators unobstructed.
  5. Pay your fare with pride and treat everyone with courtesy and empathy.
• **Initiatives:** School Train Car (Vagón Escuela), 50 urban murals on viaduct pylons, and workshops across 300 schools.

[ACTION: OPEN_CULTURE_MODULE]`,
      PT: `🌱 **Cultura Metrô e #BogotáModoMetro:**
• **Campanha:** **#BogotáModoMetro** e **#MetroTransMilenioEsUno**.
• **Regras de ouro:**
  1. Não consumir alimentos ou bebidas nas estações ou vagões.
  2. Fazer fila de forma organizada para um fluxo contínuo.
  3. Deixar sair antes de entrar nos vagões.
  4. Manter desobstruídas as portas de plataforma (PSD) e escadas.
  5. Pagar sua passagem com orgulho e tratar todos com respeito.
• **Iniciativas:** Vagão Escola, 50 murais urbanos nos pilares e oficinas em 300 colégios.

[ACTION: OPEN_CULTURE_MODULE]`,
      ZH: `🌱 **地铁文明与 #BogotáModoMetro 公民倡议：**
• **宣传主题：** **#BogotáModoMetro** 与 **#MetroTransMilenioEsUno**（地铁与公交融为一体）。
• **五大文明出行准则：**
  1. 站内及车厢内严禁饮食。
  2. 文明排队，有序候车，保障通道通畅。
  3. 遵守“先下后上”规则。
  4. 请勿倚靠屏蔽门（PSD），勿阻塞自动扶梯与安全疏散通道。
  5. 主动刷卡购票，关爱老弱妇孺，文明礼让。
• **公众科普工程：** 地铁科普教学车厢（Vagón Escuela）、高架桥立柱50幅主题壁画展，以及辐射300所中小学的市民文明实操课堂。

[ACTION: OPEN_CULTURE_MODULE]`,
      JA: `🌱 **地下鉄マナーと #BogotáModoMetro 市民規範：**
• **推進キャンペーン：** **#BogotáModoMetro** および **#MetroTransMilenioEsUno**。
• **5大マナー規範：**
  1. 駅構内および車内での飲食はご遠慮ください。
  2. スムーズな乗降のため、整列乗車にご協力ください。
  3. 降りる方を先にお通しください。
  4. ホームドア（PSD）やエスカレーター付近の通路を塞がないでください。
  5. 運賃を正しく支払い、お互いに思いやりを持って利用しましょう。
• **教育活動：** 体験型スクール車両（Vagón Escuela）、高架橋橋脚の50のアート壁画、300校での学校向け出前講座を展開中。

[ACTION: OPEN_CULTURE_MODULE]`,
      ES: `🌱 **Cultura Metro y #BogotáModoMetro:**
• **Campaña:** **#BogotáModoMetro** y **#MetroTransMilenioEsUno**.
• **Normas clave:**
  1. No consumir alimentos ni bebidas dentro de estaciones o vagones.
  2. Hacer la fila para permitir un flujo de movilidad continuo.
  3. Dejar salir antes de entrar a los vagones.
  4. Mantener despejadas las zonas de circulación, puertas PSD y escaleras.
  5. Pagar el pasaje con orgullo y actuar con respeto y empatía.
• **Iniciativas:** Vagón Escuela (Metro Escuela), 50 murales urbanos en pilonas y talleres pedagógicos en 300 colegios de las 9 localidades.

[ACTION: OPEN_CULTURE_MODULE]`
    },
    fallback: {
      EN: `🚆 **MetroBot AI Official Assistant:**
I can resolve any query regarding the Bogotá Metro system with precision. Try asking me directly:

🧭 **Routes:** *"How do I get from Usme to Fontibón?"*, *"From Bosa to Calle 72?"*, *"How do I reach Unicentro or the Airport?"*
🚆 **Technical Data:** *"What is the passenger capacity of the trains?"*, *"How fast does it travel?"*, *"How does the GoA4 CBTC system work?"*
🚧 **Construction & Dates:** *"What is the completion percentage?"*, *"When does the metro begin commercial operation?"*
💳 **Fares & Cards:** *"How does the $0 COP transfer work with TuLlave?"*, *"What are the operating hours?"*
💼 **Employment:** *"What are the official job openings with SENA?"*`,
      PT: `🚆 **Assistente Oficial MetroBot IA:**
Posso responder com exatidão a qualquer dúvida sobre o sistema do Metrô de Bogotá. Experimente perguntar diretamente:

🧭 **Rotas:** *"Como ir de Usme a Fontibón?"*, *"De Bosa à Calle 72?"*, *"Como chego a Unicentro ou ao Aeroporto?"*
🚆 **Dados Técnicos:** *"Qual é a lotação dos trens?"*, *"A que velocidade viaja?"*, *"Como funciona o sistema GoA4 CBTC?"*
🚧 **Obras e Datas:** *"Qual é o percentual de avanço?"*, *"Quando o metrô começa a operar?"*
💳 **Tarifas e Cartões:** *"Como funciona a baldeação a $0 no TuLlave?"*, *"Quais são os horários de operação?"*
💼 **Emprego:** *"Quais são as vagas com o SENA?"*`,
      ZH: `🚆 **MetroBot IA 官方智能出行助手：**
我可以为您精准解答关于波哥大地铁工程与出行系统的各项问题。您可以尝试直接提问：

🧭 **路线规划:** *“从 Usme 如何前往 Fontibón？”*、*“从 Bosa 到 Calle 72 怎么走？”*、*“如何前往 Unicentro 或机场？”*
🚆 **技术参数:** *“列车的额定载客量是多少？”*、*“商业运行速度多快？”*、*“GoA4 全自动无人驾驶系统如何运作？”*
🚧 **工程进度:** *“高架桥累计完成百分比是多少？”*、*“地铁何时正式通车运营？”*
💳 **票价与卡务:** *“TuLlave 交通卡 $0 换乘政策如何使用？”*、*“地铁运营服务时间是什么？”*
💼 **官方招聘:** *“SENA 目前有哪些官方直招岗位？”*`,
      JA: `🚆 **MetroBot IA 公式アシスタント：**
ボゴタ地下鉄システムに関するあらゆるご質問に正確にお答えいたします。以下のように直接お尋ねください：

🧭 **ルート検索:** *「ウスメからフォンティボンへの行き方は？」*、*「ボサからCalle 72へのルートは？」*、*「ユニセントロや空港への行き方は？」*
🚆 **技術データ:** *「列車の定員と輸送力は？」*、*「運転速度はどのくらい？」*、*「GoA4 CBTC自動運転の仕組みは？」*
🚧 **工事と日程:** *「現在の施工進捗率は？」*、*「いつ正式開業しますか？」*
💳 **運賃とカード:** *「TuLlaveカードの $0 無料乗り換えの仕組みは？」*、*「運行時間は何時から何時まで？」*
💼 **求人採用:** *「SENAでの公式求人募集には何がありますか？」*`,
      ES: `🚆 **Asistente Oficial MetroBot IA:**
Puedo resolverte con exactitud cualquier consulta sobre el sistema Metro de Bogotá. Prueba preguntándome de forma directa:

🧭 **Rutas:** *"¿Cómo voy de Usme a Fontibón?"*, *"¿De Bosa a la Calle 72?"*, *"¿Cómo llego a Unicentro o al Aeropuerto?"*
🚆 **Datos Técnicos:** *"¿Cuál es el aforo de los trenes?"*, *"¿A qué velocidad viaja?"*, *"¿Cómo funciona el sistema CBTC GoA4?"*
🚧 **Obras y Fechas:** *"¿Cuál es el porcentaje de avance?"*, *"¿Cuándo empieza a operar el metro?"*
💳 **Tarifas y Tarjetas:** *"¿Cómo funciona el transbordo a $0 en TuLlave?"*, *"¿Cuáles son los horarios de servicio?"*
💼 **Empleo:** *"¿Cuáles son las vacantes con el SENA?"*`
    }
  };

  const item = TOPIC_RESPONSES[topicKey];
  if (!item) return '';
  return item[l] || item.ES;
}

/**
 * MOTOR DE CONOCIMIENTO LOCAL DETERMINISTA Y DETALLADO
 * Cobertura rigurosa y estricta para responder a:
 * - Saludos, Ayuda e Identidad (MetroBot IA oficial)
 * - CASO 1: Rutas, trayectos y conexiones intermodales
 * - CASO 2: Consultas técnicas y de infraestructura (Aforo, velocidad, obras, tarifas, horarios)
 * - CASO 3: Empleo y vacantes SENA con [ACTION: OPEN_EMPLOYMENT_MODULE]
 * - Fichas individuales de las 16 Estaciones y Línea 2 Subterránea
 * - Cultura Metro y #BogotáModoMetro
 */
export function getMetroBotLocalResponse(userInput, effectiveLang = 'ES', t = (k) => k) {
  const query = userInput.toLowerCase().trim();

  // ==========================================================================
  // SALUDOS, PRESENTACIÓN, IDENTIDAD Y QUÉ PUEDE HACER (NO CONFUNDIR CON RUTAS)
  // ==========================================================================
  if (
    query === 'hola' || 
    query === 'buenas' || 
    query.startsWith('hola ') || 
    query.startsWith('buenos dias') || 
    query.startsWith('buenos días') || 
    query.startsWith('buenas tardes') || 
    query.startsWith('buenas noches') ||
    query.includes('como estas') || 
    query.includes('cómo estás') || 
    query.includes('quien eres') || 
    query.includes('quién eres') || 
    query.includes('que eres') || 
    query.includes('qué eres') || 
    query.includes('que puedes hacer') || 
    query.includes('qué puedes hacer') || 
    query.includes('como me puedes ayudar') || 
    query.includes('cómo me puedes ayudar') || 
    query.includes('que preguntas puedo hacer') || 
    query.includes('qué preguntas puedo hacer') || 
    query.includes('que es urbango') || 
    query.includes('qué es urbango') ||
    query === 'ayuda' ||
    query === 'menu' ||
    query === 'menú' ||
    query === 'hello' || query === 'hi' || query === 'hey' || query.includes('who are you') || query.includes('what can you do') || query.includes('help') ||
    query === 'olá' || query === 'ola' || query.includes('quem é você') || query.includes('o que você faz') ||
    query.includes('你好') || query.includes('你是谁') || query.includes('能做什么') || query.includes('帮助') ||
    query.includes('こんにちは') || query.includes('誰ですか') || query.includes('何ができますか') || query.includes('ヘルプ')
  ) {
    return ensureSuggestionsBlock(getLocalizedTopicResponse('greeting', effectiveLang), effectiveLang);
  }

  // ==========================================================================
  // AGRADECIMIENTOS Y DESPEDIDAS
  // ==========================================================================
  if (
    query === 'gracias' || 
    query.startsWith('muchas gracias') || 
    query.startsWith('gracias ') || 
    query === 'ok gracias' || 
    query === 'listo gracias' || 
    query === 'perfecto gracias' ||
    query === 'adios' || 
    query === 'adiós' || 
    query === 'chao' || 
    query === 'hasta luego' ||
    query === 'excelente' ||
    query === 'listo' ||
    query.includes('thank') || query.includes('thanks') || query.includes('bye') ||
    query.includes('obrigado') || query.includes('obrigada') || query.includes('tchau') ||
    query.includes('谢谢') || query.includes('感谢') || query.includes('再见') ||
    query.includes('ありがとう') || query.includes('感謝') || query.includes('さようなら')
  ) {
    return ensureSuggestionsBlock(getLocalizedTopicResponse('thanks', effectiveLang), effectiveLang);
  }

  // ==========================================================================
  // CASO 1: PRIORIDAD RUTA O MAPA SI ES CONSULTA DE RUTA / DIRECCIONES
  // ==========================================================================
  if (isRouteOrMapQuery(query)) {
    const dynamicRoute = resolveDynamicRoute(query, effectiveLang);
    if (dynamicRoute) {
      return ensureSuggestionsBlock(dynamicRoute, effectiveLang);
    }
  }

  // ==========================================================================
  // CASO 2: CONSULTAS TÉCNICAS Y DE INFRAESTRUCTURA (RESPUESTAS EXACTAS DIRECTAS)
  // ==========================================================================

  // 1. AFORO Y CAPACIDAD
  if (
    query.includes('aforo') || 
    query.includes('capacidad') || 
    query.includes('cuantos pasajeros') || 
    query.includes('cuántos pasajeros') || 
    query.includes('pasajeros por tren') ||
    query.includes('phsm') ||
    query.includes('capacity') ||
    query.includes('passengers') ||
    query.includes('lotação') ||
    query.includes('capacidade') ||
    query.includes('载客量') ||
    query.includes('定员') ||
    query.includes('定員') ||
    query.includes('輸送力') ||
    (query.includes('demanda') && query.includes('diaria'))
  ) {
    return ensureSuggestionsBlock(getLocalizedTopicResponse('aforo', effectiveLang), effectiveLang);
  }

  // 2. VELOCIDAD Y TIEMPOS DE VIAJE
  if (
    query.includes('velocidad') || 
    query.includes('frecuencia') || 
    query.includes('intervalo') || 
    query.includes('cuanto demora') || 
    query.includes('cuánto demora') || 
    query.includes('cuanto tarda') || 
    query.includes('cuánto tarda') ||
    query.includes('speed') ||
    query.includes('how long') ||
    query.includes('velocidade') ||
    query.includes('tempo de viagem') ||
    query.includes('速度') ||
    query.includes('时速') ||
    query.includes('所要時間') ||
    query.includes('スピード') ||
    (query.includes('tiempo') && (query.includes('viaje') || query.includes('bosa a') || query.includes('calle 72')))
  ) {
    return ensureSuggestionsBlock(getLocalizedTopicResponse('velocidad', effectiveLang), effectiveLang);
  }

  // 3. ESPECIFICACIONES TÉCNICAS Y OPERACIÓN
  if (
    query.includes('rodadura') || 
    query.includes('rieles de acero') || 
    query.includes('cbtc') || 
    query.includes('goa4') || 
    query.includes('frenado regenerativo') || 
    query.includes('eficiencia energetica') || 
    query.includes('eficiencia energética') || 
    query.includes('sin conductor') ||
    query.includes('driverless') ||
    query.includes('sem condutor') ||
    query.includes('无人驾驶') ||
    query.includes('自動運転') ||
    (query.includes('altura') && query.includes('viaducto'))
  ) {
    return ensureSuggestionsBlock(getLocalizedTopicResponse('tecnica', effectiveLang), effectiveLang);
  }

  // 4. CRONOGRAMA, FECHAS DE ENTREGA E INAUGURACIÓN
  if (
    query.includes('inauguracion') || 
    query.includes('inauguración') || 
    query.includes('cuando empieza') || 
    query.includes('cuándo empieza') || 
    query.includes('cuando estara listo') || 
    query.includes('cuándo estará listo') || 
    query.includes('cuando opera') || 
    query.includes('cuándo opera') || 
    query.includes('fecha de entrega') ||
    query.includes('en que año') ||
    query.includes('en qué año') ||
    query.includes('opening') ||
    query.includes('when does it open') ||
    query.includes('inauguração') ||
    query.includes('quando opera') ||
    query.includes('通车') ||
    query.includes('何时开通') ||
    query.includes('開業') ||
    query.includes('いつ運行')
  ) {
    return ensureSuggestionsBlock(getLocalizedTopicResponse('cronograma', effectiveLang), effectiveLang);
  }

  // 5. HORARIOS DE OPERACIÓN
  if (
    query.includes('horario') || 
    query.includes('a que hora abre') || 
    query.includes('a qué hora abre') || 
    query.includes('a que hora cierra') || 
    query.includes('a qué hora cierra') || 
    query.includes('hora de servicio') ||
    query.includes('schedule') ||
    query.includes('operating hours') ||
    query.includes('opening hours') ||
    query.includes('horários') ||
    query.includes('运营时间') ||
    query.includes('营业时间') ||
    query.includes('運行時間') ||
    query.includes('営業時間')
  ) {
    return ensureSuggestionsBlock(getLocalizedTopicResponse('horarios', effectiveLang), effectiveLang);
  }

  // 6. PRECIO DEL PASAJE, TARIFAS Y TULLAVE
  if (
    query.includes('cuanto vale el pasaje') || 
    query.includes('cuánto vale el pasaje') || 
    query.includes('cuanto cuesta el pasaje') || 
    query.includes('cuánto cuesta el pasaje') || 
    query.includes('precio del pasaje') || 
    query.includes('valor del pasaje') ||
    query.includes('tullave') || 
    query.includes('tarjeta') || 
    query.includes('tarifa') || 
    query.includes('saldo') || 
    query.includes('recarga') || 
    query.includes('sisben') || 
    query.includes('sisbén') || 
    query.includes('adulto mayor') || 
    query.includes('discapacidad') ||
    query.includes('110 minutos') ||
    query.includes('fare') ||
    query.includes('fares') ||
    query.includes('ticket') ||
    query.includes('recharge') ||
    query.includes('cartão') ||
    query.includes('passagem') ||
    query.includes('票价') ||
    query.includes('充值') ||
    query.includes('交通卡') ||
    query.includes('運賃') ||
    query.includes('チャージ')
  ) {
    return ensureSuggestionsBlock(getLocalizedTopicResponse('tullave', effectiveLang), effectiveLang);
  }

  // 7. AVANCE DE OBRA (DATOS A 2026)
  if (
    query.includes('avance') || 
    query.includes('obra') || 
    query.includes('82.33') || 
    query.includes('82,33') || 
    query.includes('porcentaje') || 
    query.includes('vigas lanzadoras') || 
    query.includes('pilotes') ||
    query.includes('intercambiador') ||
    query.includes('pruebas dinamicas') ||
    query.includes('pruebas dinámicas') ||
    query.includes('progress') ||
    query.includes('construction') ||
    query.includes('avanço') ||
    query.includes('obras') ||
    query.includes('工程进度') ||
    query.includes('施工进展') ||
    query.includes('工事進捗')
  ) {
    return ensureSuggestionsBlock(getLocalizedTopicResponse('avance', effectiveLang), effectiveLang);
  }

  // 8. BICICLETAS, PATINETAS Y MASCOTAS
  if (
    query.includes('bici') || 
    query.includes('bicicleta') || 
    query.includes('cicloparqueadero') || 
    query.includes('patineta') ||
    query.includes('mascota') ||
    query.includes('perro') ||
    query.includes('gato')
  ) {
    return ensureSuggestionsBlock(`🚲 **Bicicletas, Patinetas y Mascotas en el Metro de Bogotá:**
• **Cicloparqueaderos:** Las 16 estaciones cuentan con cicloparqueaderos cerrados y vigilados con más de 5.000 cupos en total.
• **Bicicletas y patinetas a bordo:**
  - Bicicletas plegables: Acceso permitido en cualquier horario.
  - Bicicletas estándar: Acceso habilitado en horas valle y domingos/festivos en coches extremos debidamente demarcados.
• **Mascotas:**
  - Perros guía y animales de asistencia: Acceso 100% irrestricto en todo momento.
  - Mascotas pequeñas/medianas: Permitidas en guacales, morrales o contenedores rígidos cerrados.`, effectiveLang);
  }

  // 9. ACCESIBILIDAD Y SILLAS DE RUEDAS
  if (
    query.includes('accesibilidad') || 
    query.includes('ascensor') || 
    query.includes('silla de ruedas') || 
    query.includes('rampa') || 
    query.includes('pcd') || 
    query.includes('invidente') || 
    query.includes('ciego')
  ) {
    return ensureSuggestionsBlock(`♿ **Accesibilidad Universal en la Primera Línea del Metro:**
• **Acceso 100% adaptado:** Todas las 16 estaciones cuentan con ascensores directos desde el nivel de calle hasta los andenes y pasarelas intermedias.
• **Puertas de andén (PSD):** Barreras automáticas de vidrio en los 145 metros de andén, sincronizadas milimétricamente con las puertas de los trenes para abordaje a nivel cero sin brechas.
• **Señalización podotáctil y Braille:** Rutas podotáctiles en todas las estaciones para invidentes y señalética háptica accesible.
• **Zonas prioritarias en coches:** Espacios exclusivos con cinturón y anclaje para sillas de ruedas en cada tren.`, effectiveLang);
  }

  // 10. SEGURIDAD, POLICÍA Y EMERGENCIAS
  if (
    query.includes('seguridad') || 
    query.includes('policia') || 
    query.includes('policía') || 
    query.includes('emergencia') || 
    query.includes('panico') || 
    query.includes('pánico') || 
    query.includes('acoso') || 
    query.includes('robo')
  ) {
    return ensureSuggestionsBlock(`🛡️ **Seguridad Integral y Red de Emergencias del Metro:**
• **Centro de Control Operacional (CCO):** Monitoreo en tiempo real 24/7 mediante más de 1.200 cámaras de circuito cerrado con reconocimiento de incidentes.
• **Botones de emergencia (Intercomunicadores):** Presentes en todos los vagones y andenes para comunicación directa e instantánea con el centro de control.
• **Policía de Transporte Masivo:** Presencia permanente de cuadrantes de policía en cada estación y pasarela de intercambio.
• **Línea Púrpura Distrital:** Puntos de atención y protocolo de cero tolerancia al acoso en todo el sistema.`, effectiveLang);
  }

  // ==========================================================================
  // CASO 3: EMPLEO Y VACANTES DE TRABAJO (SENA + METRO LÍNEA 1 S.A.S.)
  // ==========================================================================
  if (
    !isRouteOrMapQuery(query) && 
    isEmploymentQuery(query)
  ) {
    return ensureSuggestionsBlock(getLocalizedTopicResponse('empleo', effectiveLang), effectiveLang);
  }

  // ==========================================================================
  // CULTURA METRO Y #BOGOTÁMODOMETRO
  // ==========================================================================
  if (
    query.includes('cultura') || 
    query.includes('convivencia') || 
    query.includes('normas') || 
    query.includes('habito') || 
    query.includes('hábito') || 
    query.includes('bogotamodometro') || 
    query.includes('modo metro') || 
    query.includes('vagon escuela') || 
    query.includes('vagón escuela') ||
    query.includes('mural') ||
    query.includes('colegio') ||
    query.includes('culture') ||
    query.includes('etiquette') ||
    query.includes('civic') ||
    query.includes('regras') ||
    query.includes('habitos') ||
    query.includes('文明') ||
    query.includes('礼仪') ||
    query.includes('マナー') ||
    query.includes('エチケット')
  ) {
    return ensureSuggestionsBlock(getLocalizedTopicResponse('cultura', effectiveLang), effectiveLang);
  }

  // ==========================================================================
  // NOTICIAS Y TITULARES OFICIALES
  // ==========================================================================
  if (
    query.includes('noticia') || 
    query.includes('novedad') || 
    query.includes('titular') || 
    query.includes('comunicado') || 
    query.includes('boletin') || 
    query.includes('boletín') || 
    query.includes('prensa') ||
    query.includes('artículo') ||
    query.includes('articulo')
  ) {
    return ensureSuggestionsBlock(`📰 **Boletín Informativo y Noticias Oficiales de la Empresa Metro de Bogotá (Septiembre 2026):**

1. **Hito histórico: El viaducto de la Línea 1 supera el 82,33% de ejecución física**
   - Con 6 vigas lanzadoras activas en Bosa, Primero de Mayo y Av. Caracas, se consolidan más de 3.200 pilotes PHC y 1.100 dovelas.

2. **Intercambiador subterráneo de la Calle 72 alcanza el 98% de avance**
   - Habilitado el paso a desnivel vehicular mixto y lista la galería subterránea de 120 metros para la futura conexión con la Línea 2.

3. **Operación 100% eléctrica evitará 171.000 toneladas de CO₂ al año**
   - Flota de 30 trenes con frenado regenerativo y subestaciones con energía de fuentes renovables certificadas.

4. **Convocatoria de empleo técnico SENA y Metro Línea 1**
   - Más de 180 vacantes activas y gratuitas para operadores CBTC, electricistas de tracción y mantenimiento.

[ACTION: OPEN_NEWS_MODULE]`, effectiveLang);
  }

  // ==========================================================================
  // LÍNEA 2 DEL METRO SUBTERRÁNEA
  // ==========================================================================
  if (
    query.includes('linea 2') || 
    query.includes('línea 2') || 
    query.includes('subterranea') || 
    query.includes('subterránea') || 
    query.includes('fontanar')
  ) {
    return ensureSuggestionsBlock(`🚇 **Línea 2 del Metro de Bogotá (L2MB - Trazado Subterráneo Noroccidental):**

📍 **Datos Técnicos y Alcance:**
• **Longitud:** **15,5 km** (100% subterránea, excepto el patio taller en Fontanar del Río).
• **Estaciones:** **11 estaciones** en total (10 subterráneas + 1 en superficie).
• **Localidades Beneficiadas (4):** Chapinero (Calle 72), Barrios Unidos, Engativá y Suba.
• **Tiempo de Viaje:** Reduce el recorrido desde Fontanar del Río hasta la Calle 72 de 100 minutos a solo **20 minutos** para más de 1,4 millones de habitantes.
• **Intercambiador Calle 72:** Galería subterránea de 120 metros para transferencia modal fluida con la Estación 16 de la Línea 1.
• **Financiación:** Crédito con la banca multilateral (BID, Banco Mundial, Banco Europeo de Inversiones - BEI y CAF).

[ACTION: OPEN_MAP_MODULE]`, effectiveLang);
  }

  // ==========================================================================
  // RED DE 16 ESTACIONES DE LA LÍNEA 1 (LISTA COMPLETA O CONSULTA INDIVIDUAL)
  // ==========================================================================
  if (
    query.includes('16 estaciones') || 
    (query.includes('estaciones') && (query.includes('cuales son') || query.includes('cuáles son') || query.includes('recorrido') || query.includes('lista') || query.includes('nombres')))
  ) {
    return ensureSuggestionsBlock(`🚇 **Red Oficial de 16 Estaciones de la Primera Línea del Metro de Bogotá (PLMB):**

Recorrido de **23,9 km** 100% elevado sobre viaducto continuo (10 estaciones integradas con TransMilenio):
• **Estación 1:** Av. Villavicencio con Carrera 96 (Bosa / Patio Taller).
• **Estación 2:** Av. Villavicencio con Av. Cali.
• **Estación 3:** Av. Villavicencio con Av. Boyacá.
• **Estación 4:** Av. Primero de Mayo con Av. Poporo Indio (Kennedy).
• **Estación 5:** Av. Primero de Mayo con Av. Boyacá (Timiza / Hospital de Kennedy).
• **Estación 6:** Av. Primero de Mayo con Av. 68.
• **Estación 7:** Av. Primero de Mayo con Av. Américas.
• **Estación 8:** Av. NQS con Calle 8 Sur.
• **Estación 9:** Calle 1 Sur con Av. Caracas (Nodo Sur Caracas / General Santander).
• **Estación 10:** Av. Caracas con Calle 2.
• **Estación 11:** Av. Caracas con Calle 11 (Hospital).
• **Estación 12:** Av. Caracas con Calle 19.
• **Estación 13:** Av. Caracas con Calle 26 (Conexión Aeropuerto El Dorado).
• **Estación 14:** Av. Caracas con Calle 45 (Nodo Universitario UNAL / Javeriana).
• **Estación 15:** Av. Caracas con Calle 63 (Chapinero Central / Movistar Arena).
• **Estación 16:** Av. Caracas con Calle 72 (Intercambiador modal subterráneo e integración Línea 2).

🌱 **Mensaje de Cultura Metro:** Las 16 estaciones cuentan con andenes de 145 metros, puertas automáticas PSD y accesibilidad universal con ascensores calle-andén.

[ACTION: OPEN_MAP_MODULE]`, effectiveLang);
  }

  // ==========================================================================
  // ESTACIONES ESPECÍFICAS INDIVIDUALES (E1 A E16 / CALLE 72 / CALLE 26 / BOSA...)
  // ==========================================================================
  const ESTACIONES_INFO = [
    { num: 1, name: 'Estación 1 - Patio Taller Bosa / El Porvenir', loc: 'Bosa', cruce: 'Av. Villavicencio con Carrera 96', conn: 'Alimentador Bosa y SITP Zonal', bicis: 350 },
    { num: 2, name: 'Estación 2 - Bosa / Gibraltar', loc: 'Bosa', cruce: 'Av. Villavicencio con Av. Cali', conn: 'SITP Zonal Tintal y Av. Cali', bicis: 150 },
    { num: 3, name: 'Estación 3 - Portal Américas / Chicalá', loc: 'Kennedy', cruce: 'Av. Villavicencio con Av. Boyacá', conn: 'Troncal Américas y Alimentadores', bicis: 800 },
    { num: 4, name: 'Estación 4 - Carrera 80 / Ciudad Kennedy', loc: 'Kennedy', cruce: 'Av. Primero de Mayo con Carrera 80', conn: 'SITP Zonal Av. Villavicencio', bicis: 200 },
    { num: 5, name: 'Estación 5 - Timiza / Hospital de Kennedy', loc: 'Kennedy', cruce: 'Av. Primero de Mayo con Av. Boyacá', conn: 'SITP Zonal y Red Hospitalaria', bicis: 220 },
    { num: 6, name: 'Estación 6 - Avenida Primero de Mayo', loc: 'Kennedy', cruce: 'Av. Primero de Mayo con Av. 68', conn: 'Corredor Av. Boyacá y Troncal 68', bicis: 280 },
    { num: 7, name: 'Estación 7 - Plaza de Las Américas', loc: 'Puente Aranda', cruce: 'Av. Primero de Mayo con Av. Américas', conn: 'Futura Troncal Av. 68 y Américas', bicis: 320 },
    { num: 8, name: 'Estación 8 - SENA / Carrera 50', loc: 'Puente Aranda', cruce: 'Av. NQS con Calle 8 Sur', conn: 'Troncal NQS y Complejo Industrial', bicis: 250 },
    { num: 9, name: 'Estación 9 - NQS / General Santander', loc: 'Puente Aranda / Antonio Nariño', cruce: 'Calle 1 Sur con Av. Caracas', conn: 'Troncal NQS y Caracas Sur (Usme/Tunal)', bicis: 400 },
    { num: 10, name: 'Estación 10 - Calle 2 / Hortúa', loc: 'Los Mártires / Santa Fe', cruce: 'Av. Caracas con Calle 2', conn: 'Troncal Caracas Sur y San Juan de Dios', bicis: 180 },
    { num: 11, name: 'Estación 11 - Restrepo / Calle 10 Sur / Hospital', loc: 'Los Mártires', cruce: 'Av. Caracas con Calle 11', conn: 'Troncal Carrera 10 y redes hospitalarias', bicis: 210 },
    { num: 12, name: 'Estación 12 - Calle 19 / Centro Histórico', loc: 'Santa Fe', cruce: 'Av. Caracas con Calle 19', conn: 'Eje Ambiental y Centro Internacional', bicis: 600 },
    { num: 13, name: 'Estación 13 - Calle 26 / Av. El Dorado', loc: 'Teusaquillo / Santa Fe', cruce: 'Av. Caracas con Calle 26', conn: 'Troncal Calle 26 directa al Aeropuerto El Dorado', bicis: 600 },
    { num: 14, name: 'Estación 14 - Calle 45 / Universidad Nacional', loc: 'Teusaquillo / Chapinero', cruce: 'Av. Caracas con Calle 45', conn: 'Distrito Universitario (UNAL, Javeriana, Distrital)', bicis: 450 },
    { num: 15, name: 'Estación 15 - Calle 63 / Chapinero Central', loc: 'Chapinero', cruce: 'Av. Caracas con Calle 63', conn: 'Troncal Caracas, Movistar Arena y El Campín', bicis: 320 },
    { num: 16, name: 'Estación 16 - Calle 72 / Intercambiador Modal', loc: 'Chapinero / Barrios Unidos', cruce: 'Av. Caracas con Calle 72', conn: 'Troncal Caracas, Intercambiador Subterráneo y Futura Línea 2', bicis: 500 }
  ];

  // Orden descendente para evaluar E16 a E10 antes de E1 a E9
  const sortedStations = [...ESTACIONES_INFO].sort((a, b) => b.num - a.num);
  for (const st of sortedStations) {
    const numStr = String(st.num);
    const stationRegex = new RegExp(`\\b(estaci[oó]n|e)\\s*${numStr}\\b`, 'i');
    const isExactMatch = 
      stationRegex.test(query) ||
      (st.num === 16 && (query.includes('calle 72') || query.includes('cll 72'))) ||
      (st.num === 13 && (query.includes('calle 26') || query.includes('cll 26'))) ||
      (st.num === 14 && (query.includes('calle 45') || query.includes('cll 45'))) ||
      (st.num === 15 && (query.includes('calle 63') || query.includes('cll 63'))) ||
      (st.num === 1 && query.includes('patio taller'));

    if (isExactMatch) {
      return ensureSuggestionsBlock(`🚇 **Ficha Técnica: ${st.name}:**
• **Localidad:** ${st.loc}.
• **Ubicación exacta:** ${st.cruce}.
• **Conexión Intermodal:** ${st.conn} con transbordo a $0 COP.
• **Cicloparqueadero:** ${st.bicis} cupos seguros vigilados.
• **Accesibilidad:** Ascensores calle-andén, puertas de andén automáticas PSD de 145 metros y pisos podotáctiles.

[ACTION: OPEN_MAP_MODULE]`, effectiveLang);
    }
  }

  // ==========================================================================
  // CASO 1: ENRUTADOR DINÁMICO ORIGEN ➔ DESTINO MULTIMODAL
  // ==========================================================================
  const dynamicRoute = resolveDynamicRoute(query, effectiveLang);
  if (dynamicRoute) {
    return ensureSuggestionsBlock(dynamicRoute, effectiveLang);
  }

  // ==========================================================================
  // COMPRENSIÓN DE INTENCIONES DE BÚSQUEDA DE CENTROS COMERCIALES Y POIs:
  // - "¿Qué estación queda cerca de [Lugar]?"
  // - "¿El Metro pasa por [Lugar]?"
  // - "¿En qué estación me bajo para ir a [Lugar]?"
  // - "Voy para [Lugar], ¿cómo llego en Metro?"
  // - "[Lugar] estación de Metro"
  // ==========================================================================

  // 1. MULTIPLAZA / PLAZA CENTRAL (Av. Boyacá / Calle 13)
  if (query.includes('multiplaza') || query.includes('plaza central')) {
    return ensureSuggestionsBlock(`🏬 **Conexión Metro: Multiplaza & Plaza Central (Av. Boyacá con Calle 13):**

• **Estación de Metro clave más cercana:**
  - **Estación 5 (Av. Primero de Mayo con Av. Boyacá)** y **Estación 6 (Av. Primero de Mayo con Cra 50 / Av. 68)**.

• **Conexión Intermodal (SITP / TransMilenio):**
  - Desciende en Estación 5 o 6 y toma bus SITP Zonal o alimentador sobre el corredor de la Av. Boyacá hacia el norte hasta la Calle 13 (**1 transbordo a $0 COP** con tu tarjeta TuLlave dentro de la ventana de 110 minutos).

💡 **Tip de Cultura Metro / Tarjeta TuLlave:**
  - Con tu tarjeta TuLlave personalizada tienes 110 minutos para transbordar a $0 COP. Permite salir antes de ingresar en puertas PSD para agilizar el flujo.

[ACTION: OPEN_MAP_MODULE]`, effectiveLang);
  }

  // 2. CENTRO MAYOR (Autopista Sur con Cll 38A Sur)
  if (query.includes('centro mayor') || query.includes('centromayor')) {
    return ensureSuggestionsBlock(`🏬 **Conexión Metro: C.C. Centro Mayor (Autopista Sur con Calle 38A Sur):**

• **Estación de Metro clave más cercana:**
  - **Estación 8 (NQS con Calle 8 Sur)** o **Estación 3 (Av. Boyacá)** (también acceso por Estación 9 General Santander).

• **Conexión Intermodal (SITP / TransMilenio):**
  - Conexión directa con la Troncal NQS Sur o bus zonal por la Autopista Sur (**1 transbordo a $0 COP**). Cuentas además con pasarela peatonal techada directa hacia el centro comercial desde la estación General Santander.

💡 **Tip de Cultura Metro / Tarjeta TuLlave:**
  - Cede el asiento a personas de la tercera edad, mujeres embarazadas o con movilidad reducida; en #BogotáModoMetro viajamos con civismo y empatía.

[ACTION: OPEN_MAP_MODULE]`, effectiveLang);
  }

  // 3. UNICENTRO / TITÁN PLAZA / PARQUE LA COLINA / SANTAFÉ
  if (
    query.includes('unicentro') || 
    query.includes('titan plaza') || 
    query.includes('titán plaza') || 
    query.includes('titan') || 
    query.includes('titán') || 
    query.includes('colina') || 
    query.includes('santafe') || 
    query.includes('santafé')
  ) {
    let poiTitle = 'Centros Comerciales del Norte / Noroccidente';
    let connDetail = 'Troncal Norte, Carrera 15, Av. Suba o Av. Boyacá en SITP/TransMilenio (1 transbordo a $0 COP en 110 minutos).';

    if (query.includes('unicentro')) {
      poiTitle = 'C.C. Unicentro (Carrera 15 con Calle 127)';
      connDetail = 'Desde Estación 16 toma bus Zonal/SITP por la Carrera 15 norte o Troncal Norte hasta Calle 127 (1 transbordo a $0 COP).';
    } else if (query.includes('titan') || query.includes('titán')) {
      poiTitle = 'C.C. Titán Plaza (Av. Boyacá con Calle 80)';
      connDetail = 'Desde Estación 16 conecta con Troncal Calle 80 hacia el occidente o bus zonal por la Av. Boyacá norte (1 transbordo a $0 COP).';
    } else if (query.includes('colina')) {
      poiTitle = 'C.C. Parque La Colina (Av. Boyacá con Calle 146B)';
      connDetail = 'Desde Estación 16 toma Troncal Norte hacia Portal Norte o bus zonal por Av. Suba / Av. Boyacá (1 transbordo a $0 COP).';
    } else if (query.includes('santafe') || query.includes('santafé')) {
      poiTitle = 'C.C. Santafé (Autopista Norte con Calle 185)';
      connDetail = 'Desde Estación 16 conecta con Troncal Norte en servicio expreso hacia Portal Norte (1 transbordo a $0 COP).';
    }

    return ensureSuggestionsBlock(`🏬 **Conexión Metro: ${poiTitle}:**

• **Estación de Metro clave más cercana:**
  - **Estación 16 (Calle 72 con Av. Caracas / Intercambiador Modal del Norte)**.

• **Conexión Intermodal (SITP / TransMilenio):**
  - ${connDetail}

💡 **Tip de Cultura Metro / Tarjeta TuLlave:**
  - Mantén tu tarjeta TuLlave recargada con antelación y haz la fila con orden en andenes y puertas PSD para un viaje seguro.

[ACTION: OPEN_MAP_MODULE]`, effectiveLang);
  }

  // 4. MOVISTAR ARENA / ESTADIO EL CAMPÍN
  if (query.includes('movistar') || query.includes('campin') || query.includes('campín')) {
    return ensureSuggestionsBlock(`🏟️ **Conexión Metro: Movistar Arena & Estadio El Campín:**

• **Estación de Metro clave más cercana:**
  - **Estación 15 (Av. Caracas con Calle 63)** o **Estación 16 (Calle 72)**.

• **Conexión Intermodal (SITP / TransMilenio):**
  - Intercambio directo a Troncal NQS (Estación Campín - U. Antonio Nariño / Movistar Arena) o enlace en bus zonal por las Calles 53/63 (**1 transbordo a $0 COP**).

💡 **Tip de Cultura Metro / Tarjeta TuLlave:**
  - En eventos culturales y deportivos masivos, haz la fila con calma, no consumas alimentos en los vagones y valida tu pasaje con orgullo ciudadano.

[ACTION: OPEN_MAP_MODULE]`, effectiveLang);
  }

  // 5. UNIVERSIDAD NACIONAL / JAVERIANA / DISTRITAL / CATÓLICA
  if (
    query.includes('universidad') || 
    query.includes('unal') || 
    query.includes('javeriana') || 
    query.includes('distrital') || 
    query.includes('catolica') || 
    query.includes('católica') || 
    query.includes('andes')
  ) {
    let uniDetail = 'Caminata peatonal directa o enlace por Carrera 7 / Calle 45 con transbordo a $0 COP.';
    if (query.includes('unal') || query.includes('nacional')) {
      uniDetail = 'Pasarela peatonal directa desde Estación 14 o Estación 13 hacia el campus de la Universidad Nacional (caminata de 5 minutos).';
    } else if (query.includes('javeriana') || query.includes('distrital') || query.includes('catolica') || query.includes('católica')) {
      uniDetail = 'Caminata de 5 minutos al oriente por la Calle 45 o enlace con buses zonales de la Carrera 7ma (transbordo a $0 COP).';
    }

    return ensureSuggestionsBlock(`🎓 **Conexión Metro: Eje Universitario (UNAL / Javeriana / Distrital / Católica):**

• **Estación de Metro clave más cercana:**
  - **Estación 14 (Av. Caracas con Calle 45)** y **Estación 15 (Calle 63)** (para la UNAL también **Estación 13 Calle 26**).

• **Conexión Intermodal (SITP / TransMilenio):**
  - ${uniDetail}

💡 **Tip de Cultura Metro / Tarjeta TuLlave:**
  - Respeta los andenes de abordaje y cede el paso a personas con movilidad reducida; el civismo estudiantil es motor de #BogotáModoMetro.

[ACTION: OPEN_MAP_MODULE]`, effectiveLang);
  }

  // 6. AEROPUERTO EL DORADO / CORFERIAS / PARQUE SIMÓN BOLÍVAR
  if (
    query.includes('aeropuerto') || 
    query.includes('el dorado') || 
    query.includes('eldorado') || 
    query.includes('corferias') || 
    query.includes('agora') || 
    query.includes('ágora') || 
    query.includes('simon bolivar') || 
    query.includes('simón bolívar') || 
    query.includes('jardin botanico') || 
    query.includes('jardín botánico') || 
    query.includes('can')
  ) {
    let placeTitle = 'Aeropuerto El Dorado / Corferias / Simón Bolívar';
    let placeConn = 'Transbordo directo a Troncal Calle 26 (Ruta K16/K60 en bus dual o articulado) o Av. La Esperanza (1 transbordo a $0 COP).';

    if (query.includes('aeropuerto') || query.includes('el dorado') || query.includes('eldorado')) {
      placeTitle = 'Aeropuerto Internacional El Dorado';
      placeConn = 'Transbordo directo en Estación 13 a Troncal Calle 26 abordando la ruta K60 o alimentador K16 en bus dual/articulado directo al Terminal Aéreo (1 transbordo a $0 COP).';
    } else if (query.includes('corferias') || query.includes('agora') || query.includes('ágora') || query.includes('can')) {
      placeTitle = 'Corferias / Ágora Bogotá / CAN';
      placeConn = 'Conexión sobre Troncal Calle 26 hacia CAD/Corferias o bus zonal por Av. La Esperanza (1 transbordo a $0 COP).';
    } else if (query.includes('simon bolivar') || query.includes('simón bolívar') || query.includes('jardin botanico') || query.includes('jardín botánico')) {
      placeTitle = 'Parque Metropolitano Simón Bolívar & Jardín Botánico';
      placeConn = 'Toma bus zonal SITP por Calle 53 o Calle 63 al occidente hacia Carrera 68 (1 transbordo a $0 COP).';
    }

    return ensureSuggestionsBlock(`✈️ **Conexión Metro: ${placeTitle}:**

• **Estación de Metro clave más cercana:**
  - **Estación 13 (Av. Caracas con Calle 26 / Av. El Dorado)**.

• **Conexión Intermodal (SITP / TransMilenio):**
  - ${placeConn}

💡 **Tip de Cultura Metro / Tarjeta TuLlave:**
  - Con tu tarjeta TuLlave dispones de 110 minutos para transbordar a $0 COP. Planifica tus viajes hacia terminales aéreas o eventos con tiempo.

[ACTION: OPEN_MAP_MODULE]`, effectiveLang);
  }

  // 20 Localidades de Bogotá
  if (
    query.includes('20 localidades') || 
    (query.includes('localidades') && (query.includes('cuales') || query.includes('cuáles') || query.includes('todas') || query.includes('lista') || query.includes('cuantas') || query.includes('cuántas')))
  ) {
    return ensureSuggestionsBlock(`🧭 **Conectividad Integral: Las 20 Localidades de Bogotá:**
• **9 Localidades con trazado directo Línea 1:** Bosa, Kennedy, Puente Aranda, Antonio Nariño, Los Mártires, Santa Fe, Teusaquillo, Barrios Unidos y Chapinero (23,9 km de viaducto).
• **4 Localidades con Línea 2 Subterránea:** Chapinero, Barrios Unidos, Engativá y Suba (11 estaciones).
• **7 Localidades con integración multimodal TuLlave a $0 COP:** Fontibón, Usaquén, Tunjuelito, Ciudad Bolívar, San Cristóbal, Rafael Uribe Uribe y Sumapaz.

💡 **Tip #BogotáModoMetro:** En #BogotáModoMetro las 20 localidades se conectan con civismo y equidad de tiempo.

[ACTION: OPEN_MAP_MODULE]`, effectiveLang);
  }

  // Consulta por Localidad Individual
  const locEntry = Object.entries(BOGOTA_LOCALIDADES_KB).find(([name]) => 
    query.includes(name.toLowerCase())
  );
  if (locEntry) {
    const [locName, loc] = locEntry;
    return ensureSuggestionsBlock(`🧭 **Ruta y Conexión Intermodal: Localidad de ${locName}:**
• **Estación Metro Clave:** **${loc.conexionMetro}**.
• **Corredores Principales:** ${loc.corredoresPrincipales}.
• **Conexión TransMilenio / SITP:** ${loc.transmilenio}.
• **Ventana TuLlave:** 110 minutos para transbordar a $0 COP entre buses zonales y el viaducto del Metro.

💡 **Tip #BogotáModoMetro:** Respeta la fila en andenes y no obstaculices las puertas automáticas PSD.

[ACTION: OPEN_MAP_MODULE]`, effectiveLang);
  }

  // ==========================================================================
  // FORO CIUDADANO Y PARTICIPACIÓN VECINAL
  // ==========================================================================
  if (
    query.includes('foro') || 
    query.includes('debate') || 
    query.includes('opinar') || 
    query.includes('opinion') || 
    query.includes('opinión') || 
    query.includes('participacion') || 
    query.includes('participación') || 
    query.includes('propuesta') || 
    query.includes('comunidad')
  ) {
    return ensureSuggestionsBlock(`💬 **Foro Ciudadano y Participación Vecinal en UrbanGo:**
El Foro Ciudadano es el espacio digital abierto para que los usuarios y vecinos de las 20 localidades debatan sobre movilidad, propongan mejoras para las estaciones de la Línea 1 y reporten incidencias urbanas en tiempo real.

• **Canales activos:** Espacios de discusión por localidades, propuestas ciudadanas de intermodalidad y veeduría.
• **Participación:** Comparte tus sugerencias con respeto cívico y sentido de pertenencia.

[ACTION: OPEN_FORUM_MODULE]`, effectiveLang);
  }

  // ==========================================================================
  // FALLBACK INTELIGENTE (RESPUESTA INSTITUCIONAL Y ORIENTACIÓN CLARA)
  // ==========================================================================
  return ensureSuggestionsBlock(getLocalizedTopicResponse('fallback', effectiveLang), effectiveLang);
}

