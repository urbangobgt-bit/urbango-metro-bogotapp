import { METRO_SYSTEM_KNOWLEDGE, NOTICIAS_KB, EMPLEOS_KB } from '../data/metroKnowledge.js';

/**
 * ============================================================================
 * METROBOT IA - SYSTEM INSTRUCTION & PROMPT ENGINEERING OFICIAL (EMB)
 * ============================================================================
 * Asistente Virtual Oficial e Inteligente de la Empresa Metro de Bogotá (EMB)
 * y de la plataforma ciudadana UrbanGo para la Primera Línea del Metro (PLMB)
 * y proyectos de la Red Metro (Línea 2).
 *
 * Misión: Responder consultas ciudadanas, técnicas e institucionales con total
 * exactitud geográfica, datos verificados de la EMB (Vigencia 2026), enlaces
 * de acción interactiva y soporte multilingüe en 5 idiomas (ES, EN, PT, ZH, JA).
 */
export const METROBOT_SYSTEM_INSTRUCTION = `
Eres MetroBot IA, el Asistente Virtual Oficial e Inteligente de la Empresa Metro de Bogotá (EMB) y de la plataforma ciudadana UrbanGo para la Primera Línea del Metro de Bogotá (PLMB).

### 1. ROL INSTITUCIONAL Y TONO
- Actúas como un vocero técnico, empático, ultrapreciso e institucional de la Empresa Metro de Bogotá (EMB).
- Respondes siempre con total rigor geográfico, técnico y oficial, citando datos y cifras concretas de la EMB (Vigencia 2026).
- Tu tono es cercano, educado, informativo y estructurado para la ciudadanía, inversionistas, veedurías y entes de control.

### 2. AFORO, CAPACIDAD Y DEMANDA OFICIAL (DATOS EMB)
- Aforo y Capacidad por Tren: Cada tren de 6 vagones (145 metros de longitud y 2.90 m de ancho) tiene una capacidad nominal de 1.800 pasajeros (300 personas por vagón, calculadas a 4-6 personas/m²). En hora pico con máxima densidad, su capacidad extraordinaria llega hasta 2.000 pasajeros por tren. Dispone de 24 puertas dobles por tren (4 por vagón por costado) para embarque y desembarque rápido en 20-30 segundos.
- Capacidad por Hora y Sentido: Hasta 72.000 pasajeros por hora y sentido (p/h/s) en su fase de máxima demanda. En la fase inicial moverá entre 36.000 y 43.000 p/h/s con intervalos de 2 a 3 minutos.
- Aforo Diario del Sistema: Diseñado para movilizar más de 1.000.000 de pasajeros al día (más de 1 millón de viajes diarios en operación plena; iniciando con ~720.000 a 800.000 viajes/día).
- Flota Total: 30 trenes 100% eléctricos, climatizados, con tracción y frenado regenerativo y conducción automática sin conductor (GoA4).
- Aforo y Seguridad en Estaciones: 16 estaciones elevadas bioclimáticas con andenes de 145 metros equipados con Puertas de Pantalla de Andén (PSD) sincronizadas. Vestíbulos dimensionados para evacuar más de 40.000 a 50.000 usuarios por hora en estaciones de gran transferencia (Portal Américas, Calle 26, Calle 72).

### 3. BASE DE DATOS GEOGRÁFICA OFICIAL DE ESTACIONES POR LOCALIDAD (PLMB)
1. Localidad de Bosa:
   * Estación 1: Patio Taller / El Porvenir (Carrera 96 con Calle 49 Sur). Centro neurálgico de operaciones, mantenimiento y cocheras con 32 hectáreas, capacidad para 60 trenes y subestación eléctrica SET-1.
   * Estación 2: Bosa / Gibraltar (Av. Villavicencio con Av. Tintal).
2. Localidad de Kennedy (4 estaciones clave):
   * Estación 3: Portal Américas / Chicalá (Av. Villavicencio con Av. Cali). Integración modal con TransMilenio Portal Américas y alimentadores.
   * Estación 4: Carrera 80 / Ciudad Kennedy (Av. Villavicencio con Carrera 80). Acceso central a Ciudad Kennedy.
   * Estación 5: Timiza / Hospital de Kennedy (Av. Villavicencio con Carrera 78H / Calle 40 Sur). Referencias: Hospital de Kennedy y Parque Timiza.
   * Estación 6: Avenida Primero de Mayo (Av. Primero de Mayo con Av. Boyacá). Intersección comercial estratégica.
3. Localidad de Puente Aranda:
   * Estación 7: Plaza de Las Américas (Av. Primero de Mayo con Carrera 68). Conexión comercial y futura Troncal Av. 68.
   * Estación 8: SENA / Carrera 50 (Av. Primero de Mayo con Carrera 50). Acceso a complejo industrial y SENA.
   * Estación 9: NQS / General Santander (Av. Primero de Mayo con Av. NQS). Nodo intermodal con Troncal NQS (Carrera 30).
4. Localidad de Antonio Nariño y Los Mártires:
   * Estación 10: Calle 1 Sur / Hortúa (Av. Caracas con Calle 1 Sur). Conexión con Hospital La Hortúa y Caracas Sur.
   * Estación 11: Restrepo / Calle 10 Sur (Av. Caracas con Calle 10 Sur). Eje comercial del Restrepo.
   * Estación 12: Calle 26 / Centro Internacional (Av. Caracas con Calle 26). Integración masiva con Troncal Calle 26 hacia el Aeropuerto El Dorado.
5. Localidad de Teusaquillo, Chapinero y Barrios Unidos:
   * Estación 13: Calle 45 / Universidad Nacional (Av. Caracas con Calle 45). Corredor universitario y cultural.
   * Estación 14: Calle 63 (Av. Caracas con Calle 63). Sector financiero y comercial de Chapinero Central.
   * Estación 15: Calle 72 (Av. Caracas con Calle 72 - Intercambiador modal). Paso a desnivel deprimido vehicular en operación y conexión futura con Línea 2.

### 4. PREGUNTAS FRECUENTES Y DATOS TÉCNICOS
- Patio Taller: Sector de El Porvenir, localidad de Bosa (Carrera 96 con Calle 49 Sur, 32 hectáreas, cocheras para 60 trenes, avance del 91%).
- Trasbordos TransMilenio: 10 estaciones de integración modal con tarifa integrada en tarjeta TuLlave durante 110 minutos.
- Velocidad: Velocidad comercial promedio de 42.5 km/h (máxima de diseño de 80 km/h).
- Tiempo de Viaje Bosa/Kennedy - Calle 72: Aprox. 27 minutos (frente a los 80-100 minutos habituales en tráfico mixto).
- Tarifa y Medio de Pago: Tarifa unificada con el SITP ($2.950 - $3.150 COP), tarjeta TuLlave, pagos contactless débito/crédito, código QR y recargas PSE/Nequi/Daviplata.
- Avance de Obra: 82.33% de avance físico consolidado oficial (corte Vigencia 2026 EMB). Pruebas dinámicas en 2026 y operación comercial en 2028.
- Línea 2 del Metro: 15.5 km en su mayoría subterránea, 11 estaciones, conecta Calle 72 con Suba y Engativá hasta Fontanar del Río. Presupuesto ~$35 billones COP.
- Financiación: Inversión de obra $16.27 billones COP (más de $22.3 billones total), 70% Nación, 30% Distrito, créditos Banco Mundial, BID, BEI, CAF.
- Concesionario y Fabricante: Consorcio Metro Línea 1 S.A.S. (China Harbour Engineering Company CHEC y Xi'an Rail Transit Group); trenes fabricados por CRRC Changchun.
- Tecnología y Automatización: GoA4 sin conductor, señalización CBTC por radio continua, frenado regenerativo.
- Seguridad y Accesibilidad: Puertas de pantalla de andén (PSD), más de 1.200 cámaras con IA, 100% accesibilidad PMR (ascensores, pisos podotáctiles, braille).
- Sostenibilidad: 100% trenes eléctricos cero emisiones, ahorro de 171.000 toneladas de CO2/año, 95.000 m² de espacio público nuevo y ciclorrutas.

### 5. ENLACES DE ACCIÓN INTERACTIVA (DEEP LINKS)
- [🗺️ Ver estas estaciones en el Mapa Interactivo](#action_map)
- [💳 Recargar TuTarjetaMetro](#action_recharge)
- [🚨 Reportar Incidencia Vial](#action_report)
- [📰 Ver Novedades](#open_content)
- [💼 Ver Bolsa de Empleo](#open_portal_empleo)
- [🚧 Ver Estado de Obra en Vivo](#open_project_status)

### 6. FORMATO OBLIGATORIO FINAL
Al final de cada respuesta se debe incluir siempre:
[SUGERENCIAS]
- ¿Pregunta sugerida 1?
- ¿Pregunta sugerida 2?
- ¿Pregunta sugerida 3?
`;

export const METROBOT_SYSTEM_PROMPT = METROBOT_SYSTEM_INSTRUCTION;

export function detectLanguage(query, currentLang) {
  if (currentLang && typeof currentLang === 'string') {
    const cl = currentLang.trim().toUpperCase();
    if (['ES', 'EN', 'PT', 'ZH', 'JA'].includes(cl)) {
      return cl;
    }
  }
  const jaRegex = /[\u3040-\u309F\u30A0-\u30FF]/;
  if (jaRegex.test(query)) return 'JA';

  const zhRegex = /[\u4e00-\u9fa5]/;
  if (zhRegex.test(query)) return 'ZH';

  const ptRegex = /\b(olá|ola|bom dia|boa tarde|estação|estações|trem|trens|vagas|emprego|saldo|obra|quanto|onde|cartão|passagem|recarregar|velocidade|baldeação|capacidade|lotação|passageiros)\b/i;
  if (ptRegex.test(query)) return 'PT';

  const enKeywords = [
    'hello', 'hi', 'hey', 'news', 'job', 'jobs', 'station', 'stations', 'progress',
    'card', 'balance', 'recharge', 'metro', 'schedule', 'route', 'routes', 'work',
    'apply', 'closure', 'closures', 'train', 'trains', 'capacity', 'speed', 'profile',
    'incident', 'report', 'hours', 'opening', 'frequency', 'peak', 'transfer', 'transfers',
    'where', 'kennedy', 'bosa', 'passenger', 'passengers', 'cost', 'line 2', 'builder'
  ];
  const words = query.toLowerCase().split(/\s+/);
  const matchEn = words.filter(w => enKeywords.includes(w)).length;
  if (matchEn >= 2 || (words.length <= 3 && matchEn >= 1)) return 'EN';

  return 'ES';
}

export function isOutOfDomain(query) {
  const q = query.toLowerCase();

  const inDomainKeywords = [
    'metro', 'plmb', 'urbango', 'bogota', 'bogotá', 'tullave', 'tarjeta', 'saldo',
    'recarga', 'nequi', 'daviplata', 'pse', 'estacion', 'estaciones', 'caracas',
    'calle 72', 'bosa', 'kennedy', 'viaducto', 'patio taller', 'tren', 'trenes',
    'vagon', 'vagones', 'co2', 'obra', 'avance', 'noticia', 'noticias', 'empleo',
    'empleos', 'trabajo', 'trabajar', 'vacante', 'vacantes', 'postular', 'postulacion',
    'postulación', 'cierre', 'cierres', 'desvio', 'desvío', 'incidencia', 'reporte',
    'horario', 'horarios', 'mapa', 'perfil', 'avatar', 'tiempo', 'velocidad', 'goa4',
    'cbtc', 'flota', 'transmilenio', 'transmicable', 'pasaje', 'tarifa', 'trasbordo',
    'transbordo', 'puente aranda', 'antonio nariño', 'los martires', 'los mártires',
    'teusaquillo', 'chapinero', 'barrios unidos', 'hortua', 'hortúa', 'restrepo',
    'centro internacional', 'universidad nacional', 'calle 45', 'calle 63', 'chicala',
    'chicalá', 'portal americas', 'portal américas', 'boyaca', 'boyacá', 'timiza',
    'hospital', 'porvenir', 'gibraltar', 'tintal', 'carrera 80', 'primero de mayo',
    'sena', 'carrera 50', 'nqs', 'general santander', 'calle 1', 'calle 26',
    'aforo', 'aforos', 'capacidad', 'capacidades', 'persona', 'personas', 'pasajero',
    'pasajeros', 'gente', 'caben', 'cuantos caben', 'cuántos caben', 'usuarios', 'demanda',
    'linea 2', 'línea 2', 'suba', 'engativa', 'engativá', 'inversion', 'inversión',
    'costo', 'costos', 'presupuesto', 'banco mundial', 'bid', 'bei', 'caf', 'concesionario',
    'chec', 'crrc', 'xi\'an', 'xian', 'financiamiento', 'financiacion', 'financiación',
    'seguridad', 'camaras', 'cámaras', 'cctv', 'sostenibilidad', 'arboles', 'árboles',
    'ciclorruta', 'longitud', 'kilometros', 'kilómetros', 'vigas lanzadoras', 'vigas u',
    'pilotes', 'catenaria', 'tercer riel', 'psd', 'puertas de anden', 'pantalla de anden',
    'pmr', 'accesibilidad', 'ascensor', 'ascensores', 'podotactil', 'braille',
    'hola', 'saludos', 'gracias', 'adios', 'adiós', 'ayuda', 'info', 'informacion',
    'información', 'news', 'job', 'jobs', 'recharge', 'train', 'station', 'route',
    'hours', 'frecuencia', 'cuanto pasa', 'cuánto pasa', 'velocidad maxima',
    'velocidad máxima', '新闻', '工作', '招聘', '地铁', '车站', '充值', '进度', '速度',
    '车厢', '地下鉄', '電車', '駅', '進捗', '残高', 'チャージ', '求人', 'ニュース', '運行',
    '定員', '载客量', '客运量', 'capacidade', 'lotação'
  ];

  const hasInDomain = inDomainKeywords.some(k => q.includes(k));
  if (hasInDomain) return false;

  const outOfDomainIndicators = [
    'capital de', 'presidente de', 'receta', 'cocinar', 'chiste', 'cuentame un chiste',
    'poema', 'cancion', 'canción', 'futbol', 'fútbol', 'mundial', 'pelicula', 'película',
    'bitcoin', 'cripto', 'dolar hoy', 'clima en paris', 'quien descubrio', 'quién descubrió',
    'francia', 'estados unidos', 'europa', 'matematicas', 'resolver ecuacion'
  ];

  return outOfDomainIndicators.some(o => q.includes(o)) || (q.length > 70 && !hasInDomain);
}

export function ensureSuggestionsBlock(response, lang) {
  if (response.includes('[SUGERENCIAS]')) return response.trim();

  if (lang === 'JA') {
    return `${response.trim()}

[SUGERENCIAS]
- 👥 列車の定員と輸送能力はどのくらい？
- 📍 ケネディ区の駅はどこ？
- 📍 車両基地 (Patio Taller) はどこにある？`;
  }

  if (lang === 'ZH') {
    return `${response.trim()}

[SUGERENCIAS]
- 👥 地铁列车与车站的额定载客量是多少？
- 📍 肯尼迪区 (Kennedy) 有哪些车站？
- 📍 车场 (Patio Taller) 建在哪里？`;
  }

  if (lang === 'EN') {
    return `${response.trim()}

[SUGERENCIAS]
- 👥 What is the passenger capacity and volume?
- 📍 Which stations are located in Kennedy?
- 📍 Where is the Patio Taller located?`;
  }

  if (lang === 'PT') {
    return `${response.trim()}

[SUGERENCIAS]
- 👥 Qual é a capacidade e lotação de passageiros?
- 📍 Quais estações ficam em Kennedy?
- 📍 Onde fica o Pátio Taller?`;
  }

  return `${response.trim()}

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- 📍 ¿Dónde queda el Patio Taller?`;
}

/**
 * Motor central de respuestas de MetroBot IA.
 */
export async function getMetroBotResponse(userInput, lang = 'ES', t = (k) => k) {
  if (!userInput || !userInput.trim()) {
    const eff = detectLanguage('', lang);
    if (eff === 'JA') {
      return `こんにちは！私は **MetroBot IA** 🤖、ボゴタ地下鉄1号線（PLMB）の公式AIアシスタントです。

駅の場所（ケネディ区、ボサ区など）、定員・輸送能力（1編成1,800名）、工事進捗（82.33%）、トランスミレニオ乗換、運賃について何でもお尋ねください。

[SUGERENCIAS]
- 👥 列車の定員と輸送能力はどのくらい？
- 📍 ケネディ区の駅はどこ？
- 📍 車両基地 (Patio Taller) はどこにある？
- 🔄 トランスミレニオとの乗換駅は？`;
    }
    if (eff === 'ZH') {
      return `您好！我是 **MetroBot IA** 🤖，波哥大地铁一号线（PLMB）官方智能助手。

您可以向我咨询各行政区车站分布（如肯尼迪区、博萨区）、列车载客量与系统运能、综合工程进度（82.33%）、公交换乘、票价与充值。

[SUGERENCIAS]
- 👥 地铁列车与车站的额定载客量是多少？
- 📍 肯尼迪区 (Kennedy) 有哪些车站？
- 📍 车场 (Patio Taller) 建在哪里？
- 🔄 哪里可以换乘快速公交 TransMilenio？`;
    }
    if (eff === 'PT') {
      return `Olá! Sou o **MetroBot IA** 🤖, o assistente inteligente oficial da Primeira Linha do Metrô de Bogotá (PLMB).

Você pode me perguntar sobre capacidade e lotação (1.800 passageiros/trem), estações por localidade (Kennedy, Bosa, etc.), avanço da obra (82.33%), baldeações com TransMilenio e tarifas.

[SUGERENCIAS]
- 👥 Qual é a capacidade e lotação de passageiros?
- 📍 Quais estações ficam em Kennedy?
- 📍 Onde fica o Pátio Taller?
- 🔄 Onde posso fazer baldeação com TransMilenio?`;
    }
    if (eff === 'EN') {
      return `Hello! I am **MetroBot AI** 🤖, the official intelligent assistant for Bogotá Metro Line 1 (PLMB).

You can ask me about passenger capacity (1,800 passengers/train), stations by locality (Kennedy, Bosa, etc.), construction progress (82.33%), TransMilenio transfers, and fares.

[SUGERENCIAS]
- 👥 What is the passenger capacity and volume?
- 📍 Which stations are located in Kennedy?
- 📍 Where is the Patio Taller located?
- 🔄 Where can I transfer to TransMilenio?`;
    }
    return `¡Hola! Soy **MetroBot IA** 🤖, el asistente inteligente oficial de la Empresa Metro de Bogotá (EMB) y UrbanGo.

Puedes consultarme sobre aforo y capacidad de personas (1.800 pax/tren), estaciones por localidad (Kennedy, Bosa, etc.), avance de obra (82.33%), trasbordos con TransMilenio, tarifas y tiempos de viaje.

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- 📍 ¿Dónde queda el Patio Taller?
- 🔄 ¿Dónde puedo hacer trasbordo con TransMilenio?`;
  }

  const query = userInput.trim().toLowerCase();
  const effectiveLang = detectLanguage(query, lang);

  // 1. FILTRO DE FUERA DE CONTEXTO
  if (isOutOfDomain(query)) {
    if (effectiveLang === 'JA') {
      return ensureSuggestionsBlock(`こんにちは！私は **MetroBot IA** 🤖、ボゴタ地下鉄1号線（PLMB）および **UrbanGo** の公式AIアシスタントです。😊

公式アシスタントとして、地下鉄の輸送定員・アフォーロ、工事進捗（82.33%）、各駅の場所（ケネディ区、ボサ区など）、乗換、運賃、採用情報についてのみ正確にお答えいたします。`, effectiveLang);
    }
    if (effectiveLang === 'ZH') {
      return ensureSuggestionsBlock(`您好！我是 **MetroBot IA**，专注于**波哥大地铁一号线（PLMB）**和 **UrbanGo** 平台的官方智能虚拟助手。😊

作为官方助手，我严格解答关于波哥大地铁工程进展（82.33%）、载客容量与运量、各区车站分布（如肯尼迪区）、无人驾驶列车、换乘网络、票价与招聘的问题，无法提供与本工程无关的内容。`, effectiveLang);
    }
    if (effectiveLang === 'EN') {
      return ensureSuggestionsBlock(`Hello! I am **MetroBot AI** 🤖, the official intelligent assistant for Bogotá Metro Line 1 (PLMB) and **UrbanGo**. 😊

As the official assistant, I exclusively answer inquiries regarding Bogotá Metro passenger capacity, construction progress (82.33%), station locations by locality (Kennedy, Bosa, etc.), TransMilenio transfers, fares, and recruitment.`, effectiveLang);
    }
    if (effectiveLang === 'PT') {
      return ensureSuggestionsBlock(`Olá! Sou o **MetroBot IA** 🤖, o assistente virtual oficial da Primeira Linha do Metrô de Bogotá (PLMB) e da plataforma **UrbanGo**. 😊

Como assistente oficial, respondo exclusivamente sobre capacidade de passageiros, avanço da obra (82.33%), estações por localidade (Kennedy, Bosa, etc.), baldeações com TransMilenio, tarifas e empregos.`, effectiveLang);
    }
    return ensureSuggestionsBlock(`¡Hola! Soy **MetroBot IA** 🤖, el asistente virtual inteligente oficial de la Empresa Metro de Bogotá (EMB) y la plataforma **UrbanGo**. 😊

Como vocero oficial, respondo exclusivamente consultas sobre el aforo y capacidad de personas, trazado y estaciones por localidad (Kennedy, Bosa, etc.), avance de obra (82.33%), trasbordos con TransMilenio, tarifas y operación del Metro de Bogotá.`, effectiveLang);
  }

  // 2. PREGUNTA ESPECÍFICA: AFORO Y CAPACIDAD DE PERSONAS (REQUERIMIENTO CLAVE)
  const isAforoQuery = 
    query.includes('aforo') ||
    query.includes('capacidad') ||
    query.includes('cuantas personas') ||
    query.includes('cuántas personas') ||
    query.includes('cuanta gente') ||
    query.includes('cuánta gente') ||
    query.includes('personas caben') ||
    query.includes('gente cabe') ||
    query.includes('cuantos pasajeros') ||
    query.includes('cuántos pasajeros') ||
    query.includes('pasajeros por tren') ||
    query.includes('pasajeros por hora') ||
    query.includes('pasajeros diarios') ||
    query.includes('pasajeros al dia') ||
    query.includes('pasajeros al día') ||
    query.includes('demanda de pasajeros') ||
    query.includes('aforo de personas') ||
    query.includes('aforo de pasajeros') ||
    query.includes('aforo maximo') ||
    query.includes('aforo máximo') ||
    query.includes('aforo de las estaciones') ||
    query.includes('aforo tren') ||
    query.includes('capacity') ||
    query.includes('passenger capacity') ||
    query.includes('passengers') ||
    query.includes('how many people') ||
    query.includes('how many passengers') ||
    query.includes('capacidade') ||
    query.includes('quantas pessoas') ||
    query.includes('lotação') ||
    query.includes('lotacao') ||
    query.includes('定員') ||
    query.includes('収容人数') ||
    query.includes('乗車定員') ||
    query.includes('载客量') ||
    query.includes('客运量') ||
    query.includes('定员') ||
    query.includes('能容纳') ||
    query.includes('能坐多少人');

  if (isAforoQuery) {
    if (effectiveLang === 'JA') {
      return ensureSuggestionsBlock(`👥 **ボゴタ地下鉄1号線（PLMB）公式輸送能力・定員データ:**

世界最高水準の大量高速輸送規格（Heavy Rail）に基づいて設計されています：

- 🚆 **1編成あたりの定員・収容人数:**
  * 各列車は **6両編成**（全長 **145メートル**、車幅 2.90m）で構成され、公称定員は **1,800名**（**1両あたり300名**、1m²あたり4〜6名の国際快適密度基準）。
  * 朝夕ラッシュ時の最高混雑率（クラッシュロード）では、最大 **2,000名/編成** まで安全に輸送可能です。
  * 各車両の両側に **4つの両開きドア**（1編成あたり計24ドア）を備え、わずか20〜30秒でのスムーズな乗降を実現します。

- ⏱️ **時間帯・方向別の最大輸送能力:**
  * **最大需要期:** **1時間1方向あたり 72,000名（p/h/s）** を輸送可能で、世界の主要メトロに匹敵する圧倒的な輸送力を誇ります。
  * **初期運行時:** **1時間1方向あたり 36,000〜43,000名** を輸送し、ラッシュ時は **2〜3分間隔** で運行されます（CBTC GoA4とホームドアにより最短 **90秒間隔** まで短縮可能）。

- 📊 **1日推定利用者数と車両数:**
  * 1日あたり **1,000,000人以上**（全線開業時は1日100万人以上の乗車、開業初期は72万〜80万人/日）を輸送予定です。
  * 全 **30編成（180両）** の100%電気駆動・自動無人運転（GoA4）電車が投入されます。

- 🏛️ **全16駅のホームと安全設計:**
  * 各駅は全長 **145メートルのホームドア（PSD）** を完備し、線路転落事故を100%防止し乗車流動を安全に制御します。
  * コンコースは主要乗換駅（ポルタル・アメリカス、Calle 26、Calle 72）において **1時間あたり40,000〜50,000名** を迅速に誘導・避難できる大容量設計です。

👉 [🗺️ インタラクティブ路線図を開く](#action_map)

[SUGERENCIAS]
- ⏱️ ケネディから中心街までの所要時間は？
- 📍 ケネディ区の駅はどこ？
- 🔄 トランスミレニオとの乗換駅は？`, effectiveLang);
    }

    if (effectiveLang === 'ZH') {
      return ensureSuggestionsBlock(`👥 **波哥大地铁一号线（PLMB）官方额定载客容量与系统客运运能（EMB 2026）：**

根据波哥大地铁公司（EMB）官方技术标准，该系统采用国际一流的重轨大运量标准设计：

- 🚆 **单列列车载客定员与容纳量：**
  * 每列列车采用 **6节编组**（总长 **145米**，车宽 2.90米），额定载客量为 **1,800人**（**每节车厢300人**，按每平方米4-6人的国际舒适标准计算）。
  * 在高峰极端满载（超员承载）条件下，每列列车最大承载量可达 **2,000人**。
  * 每节车厢每侧设 **4对大型双开外塞拉门**（全列共24对门），实现20至30秒内乘客快速上下车。

- ⏱️ **单向高峰小时断面输送能力：**
  * **远期最高运能：** 单向每小时最高可输送 **72,000人次（p/h/s）**，跻身全球运量最高的高运能地铁线路之列。
  * **初期运营运能：** 单向每小时输送 **36,000至43,000人次**，高峰期发车间隔为 **2至3分钟**（依托 CBTC GoA4 全自动信号与屏蔽门系统，极限折返间隔可压缩至 **90秒**）。

- 📊 **日均客运量与车队规模：**
  * 运营成熟期预计全线日均客运量超过 **1,000,000人次/天**（逾100万乘次/日；初期投入运营预计在72万至80万人次/天）。
  * 全线配备 **30列100%纯电力驱动** 的6编组全自动无人驾驶列车（**GoA4**），具备高效的再生电能制动回馈技术。

- 🏛️ **全线16座高架车站承载与安全客流控制：**
  * 车站站台全长 **145米**，全封闭配备与列车联动的 **全高站台屏蔽门（PSD）**，彻底隔绝轨道侵入风险。
  * 换乘大站（美洲门户站 Portal Américas、第26街站、第72街站）站厅与连廊设计峰值疏散通过能力超过 **40,000至50,000人次/小时**，配备双向高速闸机、垂直电梯与无障碍设施。

👉 [🗺️ 访问交互式全景车站地图](#action_map)

[SUGERENCIAS]
- ⏱️ 从肯尼迪到市中心需要多久？
- 📍 肯尼迪区 (Kennedy) 有哪些车站？
- 🔄 哪里可以换乘快速公交 TransMilenio？`, effectiveLang);
    }

    if (effectiveLang === 'EN') {
      return ensureSuggestionsBlock(`👥 **Official Passenger Capacity and Volume — Bogotá Metro Line 1 (PLMB):**

Bogotá Metro Line 1 is engineered to meet top global mass-transit standards for heavy-rail systems:

- 🚆 **Train Capacity & Passenger Load:**
  * Each **6-car train** (**145 meters long**, 2.90 m wide) features a nominal capacity of **1,800 passengers** (**300 passengers per car**, calculated at an international comfort density of 4–6 passengers/m²).
  * Under extraordinary peak-hour rush conditions (crush load), capacity reaches up to **2,000 passengers per train**.
  * Equipped with **4 double doors per side on each car** (24 double doors per train) enabling rapid passenger boarding/alighting in under 20–30 seconds.

- ⏱️ **System Capacity per Direction per Hour:**
  * **Full Capacity Demand:** Up to **72,000 passengers per hour per direction (pphpd)**, ranking among the highest-capacity metro lines in the world.
  * **Initial Commercial Operation:** **36,000 to 43,000 passengers per hour per direction**, with **2 to 3-minute train headways** in peak hours (reducible down to **90 seconds** thanks to CBTC GoA4 signalling).

- 📊 **Daily Passenger Demand & Fleet:**
  * Projected to carry over **1,000,000 passengers per day** (over 1 million daily boardings at full maturity, starting at ~720,000 to 800,000 trips/day).
  * Dedicated fleet of **30 100% electric trains**, air-conditioned, with regenerative braking and unattended driverless operation (**GoA4**).

- 🏛️ **Station Capacity & Safety:**
  * 16 bioclimatic elevated stations with **145-meter-long platforms** featuring synchronized **Platform Screen Doors (PSD)** to ensure orderly crowd flow and zero track falls.
  * Concourses designed to safely process and evacuate over **40,000 to 50,000 passengers per hour** at major multimodal transfer hubs (Portal Américas, Calle 26, Calle 72), equipped with bi-directional fare gates, escalators, and full universal PRM accessibility.

👉 [🗺️ Open Interactive Route Map](#action_map)

[SUGERENCIAS]
- ⏱️ Travel time from Kennedy to Downtown?
- 📍 Which stations are located in Kennedy?
- 🔄 Where can I transfer to TransMilenio?`, effectiveLang);
    }

    if (effectiveLang === 'PT') {
      return ensureSuggestionsBlock(`👥 **Capacidade e Lotação Oficial — Primeira Linha do Metrô de Bogotá (PLMB):**

O sistema de metrô foi projetado com os mais altos padrões internacionais de transporte de massa de alta capacidade:

- 🚆 **Capacidade e Lotação por Trem:**
  * Cada trem de **6 vagões** (**145 metros de comprimento** e 2.90 m de largura) possui capacidade nominal para **1.800 passageiros** (**300 passageiros por vagão**, calculados no padrão de conforto de 4 a 6 pessoas/m²).
  * Em condições de pico máximo (alta densidade), a capacidade de cada trem alcança até **2.000 passageiros**.
  * Cada vagão conta com **4 portas duplas por lateral** (24 portas duplas por composição) permitindo embarque e desembarque rápido em 20 a 30 segundos.

- ⏱️ **Capacidade do Sistema por Sentido por Hora:**
  * **Fase de Demanda Máxima:** Até **72.000 passageiros por hora e sentido (p/h/s)**, posicionando o Metrô de Bogotá entre os de maior capacidade do planeta.
  * **Fase Inicial de Operação:** Entre **36.000 e 43.000 passageiros por hora e sentido**, com intervalos de **2 a 3 minutos** no pico (redutíveis a **90 segundos** com CBTC GoA4).

- 📊 **Demanda Diária e Frota:**
  * Projetado para transportar mais de **1.000.000 de passageiros por dia** (mais de 1 milhão de viagens diárias em operação plena; iniciando com ~720.000 a 800.000 viagens/dia).
  * Frota de **30 trens 100% elétricos**, climatizados, com frenagem regenerativa e condução 100% automática sem condutor (**GoA4**).

- 🏛️ **Capacidade e Segurança nas 16 Estações:**
  * Estações elevadas bioclimáticas com plataformas de **145 metros** equipadas com **Portas de Plataforma (PSD)** sincronizadas que eliminam quedas nos trilhos e organizam o fluxo.
  * Mezaninos dimensionados para escoar mais de **40.000 a 50.000 usuários por hora** em estações multimodais (Portal Américas, Calle 26, Calle 72).

👉 [🗺️ Ver estações no Mapa Interativo](#action_map)

[SUGERENCIAS]
- ⏱️ Quanto tempo leva de Kennedy ao Centro?
- 📍 Quais estações ficam em Kennedy?
- 🔄 Onde posso fazer baldeação com TransMilenio?`, effectiveLang);
    }

    return ensureSuggestionsBlock(`👥 **Aforo y Capacidad Oficial de la Primera Línea del Metro de Bogotá (PLMB):**

El sistema metro de Bogotá está diseñado con los más altos estándares mundiales de transporte ferroviario de alta capacidad:

- 🚆 **Aforo y Capacidad por Tren:**
  * Cada tren de **6 vagones** (longitud total de **145 metros** y 2.90 m de ancho) tiene una capacidad nominal de **1.800 pasajeros** (**300 personas por vagón**, calculadas a un estándar de confort de 4 a 6 personas por m²).
  * En horas pico de máxima densidad (capacidad extraordinaria de diseño), puede transportar hasta **2.000 pasajeros por tren**.
  * Cada vagón cuenta con **4 puertas dobles por costado** (24 puertas dobles por tren) permitiendo un intercambio ágil de pasajeros (embarque y desembarque en menos de 20 a 30 segundos).

- ⏱️ **Capacidad del Sistema por Hora y Sentido:**
  * **Fase de Máxima Demanda:** Hasta **72.000 pasajeros por hora y sentido (p/h/s)**, convirtiéndose en una de las líneas metro de mayor capacidad del mundo.
  * **Fase Inicial de Operación:** Entre **36.000 y 43.000 pasajeros por hora y sentido**, con intervalos de paso de **2 a 3 minutos** en hora pico (reducibles a **90 segundos** gracias a la tecnología de señalización CBTC GoA4).

- 📊 **Aforo Diario y Flota Total:**
  * Se proyecta movilizar más de **1.000.000 de pasajeros al día** (más de 1 millón de viajes diarios en régimen pleno, arrancando con ~720.000 a 800.000 personas/día).
  * Flota inicial de **30 trenes 100% eléctricos**, climatizados, con tracción y frenado regenerativo y conducción automática sin conductor (**GoA4**).

- 🏛️ **Aforo y Seguridad en las 16 Estaciones:**
  * Estaciones elevadas bioclimáticas con andenes de **145 metros de largo**, protegidos con **Puertas de Pantalla de Andén (PSD - Platform Screen Doors)** sincronizadas para regular el flujo de personas y evitar caídas accidentales a las vías.
  * Pasarelas y vestíbulos dimensionados para procesar y evacuar más de **40.000 a 50.000 usuarios por hora** en estaciones de intercambio masivo (como Portal Américas, Calle 26 y Calle 72), con torniquetes bidireccionales de alta velocidad, escaleras mecánicas y ascensores para accesibilidad universal (PMR).

👉 [🗺️ Ver estas estaciones en el Mapa Interactivo](#action_map)

[SUGERENCIAS]
- ⏱️ ¿Cuánto tiempo tomará ir desde Bosa/Kennedy al Centro?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- 🔄 ¿Dónde puedo hacer trasbordo con TransMilenio?`, effectiveLang);
  }

  // 3. PREGUNTA ESPECÍFICA: ¿DÓNDE QUEDA EL PATIO TALLER?
  const isPatioTallerQuery = 
    query.includes('patio taller') || 
    query.includes('donde queda el patio') || 
    query.includes('dónde queda el patio') || 
    query.includes('ubicacion del patio') || 
    query.includes('ubicación del patio') || 
    query.includes('taller de bosa') || 
    query.includes('patio de bosa') || 
    query.includes('yard') || 
    query.includes('depot') || 
    query.includes('pátio taller') || 
    query.includes('patio de trenes') || 
    query.includes('车场') || 
    query.includes('车辆段') || 
    query.includes('車両基地') || 
    query.includes('車庫');

  if (isPatioTallerQuery) {
    if (effectiveLang === 'JA') {
      return ensureSuggestionsBlock(`📍 **車両基地 (Patio Taller) の所在地と主要仕様:**

ボゴタ地下鉄1号線（PLMB）の総合車両基地は、**ボサ区（Localidad de Bosa）のエル・ポルベニール地区（Sector El Porvenir）**、**Carrera 96 con Calle 49 Sur** に位置しています。

- 🏗️ **敷地面積:** **32ヘクタール**（サッカー場約50面分）。
- 📊 **工事進捗率:** **91%以上** 完成（敷地造成完了、分岐器・試験線敷設済み）。
- 🚆 **収容・保守能力:** **最大60編成** を同時収容・点検可能な大規模検修庫、自動洗浄機、車輪転削旋盤を完備。
- ⚡ **自営受変電所:** 鉄道専用の超高圧変電所（SET-1）により全線へ安定給電。

👉 [🗺️ 車両基地の正確な位置をマップで確認](#action_map)

[SUGERENCIAS]
- 📍 ケネディ区の駅はどこ？
- 🔄 トランスミレニオとの乗換駅は？
- ⏱️ ケネディから中心街までの所要時間は？`, effectiveLang);
    }
    if (effectiveLang === 'ZH') {
      return ensureSuggestionsBlock(`📍 **波哥大地铁车辆段 (Patio Taller) 精确地理位置与建设规格：**

波哥大地铁一号线（PLMB）的核心总车辆段位于 **博萨区（Localidad de Bosa）的埃尔波尔韦尼尔社区（Sector El Porvenir）**，具体路口为 **Carrera 96 与 Calle 49 Sur**。

- 🏗️ **占地规模：** **32公顷**（相当于50个标准足球场大小）。
- 📊 **工程进度：** 综合建设进度已超 **91%**，地基加固、轨道铺设、联锁道岔及试车线全面落成。
- 🚆 **停放与检修能力：** 具备同时停放和日常/大修维护 **超60列列车** 的现代化大修库、自动化列车清洗线与动车轮对镟修车间。
- ⚡ **主变电所：** 设有专用牵引变电枢纽（SET-1），保障23.9公里全线独立可靠供电。

👉 [🗺️ 在交互式地图中查看车场具体坐标](#action_map)

[SUGERENCIAS]
- 📍 肯尼迪区 (Kennedy) 有哪些车站？
- 🔄 哪里可以换乘快速公交 TransMilenio？
- ⏱️ 从肯尼迪到市中心需要多久？`, effectiveLang);
    }
    if (effectiveLang === 'EN') {
      return ensureSuggestionsBlock(`📍 **Patio Taller (Train Yard & Maintenance Depot) Location & Specifications:**

The central operations and maintenance depot for Bogotá Metro Line 1 is located in the **locality of Bosa, El Porvenir sector**, specifically at **Carrera 96 and Calle 49 Sur**.

- 🏗️ **Surface Area:** **32 hectares** (equivalent to 50 soccer fields).
- 📊 **Construction Progress:** Over **91% completed**, with ground improvements, interlocking switches, and dynamic test tracks active.
- 🚆 **Operating Capacity:** Equipped to stable and maintain over **60 six-car trains**, featuring a heavy maintenance workshop, automated wash bay, and wheel lathe.
- ⚡ **Dedicated Substation:** Powered by its own traction electric substation (SET-1) feeding the entire 23.9 km viaduct.

👉 [🗺️ View Patio Taller on the Interactive Map](#action_map)

[SUGERENCIAS]
- 📍 Which stations are located in Kennedy?
- 🔄 Where can I transfer to TransMilenio?
- ⏱️ Travel time from Kennedy to Downtown?`, effectiveLang);
    }
    if (effectiveLang === 'PT') {
      return ensureSuggestionsBlock(`📍 **Localização e Especificações do Pátio Taller (Cocheras e Oficinas):**

O centro nevrálgico de operações e manutenção da Linha 1 do Metrô de Bogotá está situado na **localidade de Bosa, no setor El Porvenir**, na **Carrera 96 com a Calle 49 Sur**.

- 🏗️ **Área Total:** **32 hectares** (equivalente a 50 campos de futebol).
- 📊 **Avanço Físico:** Mais de **91% concluído**, com vias de teste dinâmico e oficinas finalizadas.
- 🚆 **Capacidade Operacional:** Oficinas e pátio para abrigar e realizar manutenção em até **60 trens**, vias de lavagem automatizada e torno de rodas.
- ⚡ **Subestação Própria:** Conta com subestação elétrica de tração (SET-1) dedicada para alimentar os 23.9 km.

👉 [🗺️ Ver localização do Pátio Taller no Mapa Interativo](#action_map)

[SUGERENCIAS]
- 📍 Quais estações ficam em Kennedy?
- 🔄 Onde posso fazer baldeação com TransMilenio?
- ⏱️ Quanto tempo leva de Kennedy ao Centro?`, effectiveLang);
    }
    return ensureSuggestionsBlock(`📍 **Ubicación Oficial del Patio Taller (Empresa Metro de Bogotá - PLMB):**

El Patio Taller de la Primera Línea del Metro de Bogotá se encuentra ubicado en el **sector de El Porvenir, en la localidad de Bosa**, exactamente en la intersección de la **Carrera 96 con Calle 49 Sur**.

- 🏗️ **Extensión:** **32 hectáreas** de terreno industrial (equivalente a 50 canchas de fútbol reglamentarias).
- 📊 **Avance de Obra:** **91% de ejecución física consolidada** (plataforma terminada, edificios administrativos, vías de prueba y cocheras electrificadas).
- 🚆 **Capacidad Operativa:** Cocheras y talleres para albergar y realizar mantenimiento a más de **60 trenes**, vías de lavado automatizado y torno de ruedas.
- ⚡ **Infraestructura Eléctrica:** Alberga la Subestación Eléctrica de Tracción (SET-1), que suministra energía ininterrumpida a todo el viaducto de 23.9 km.

👉 [🗺️ Ver ubicación del Patio Taller en el Mapa Interactivo](#action_map)

[SUGERENCIAS]
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- 🔄 ¿Dónde puedo hacer trasbordo con TransMilenio?
- ⏱️ ¿Cuánto tiempo tomará ir desde Bosa/Kennedy al Centro?`, effectiveLang);
  }

  // 4. PREGUNTA ESPECÍFICA: TIEMPO DE VIAJE BOSA/KENNEDY AL CENTRO
  const isTravelTimeQuery = 
    (query.includes('tiempo') && (query.includes('viaje') || query.includes('recorrido') || query.includes('tomar') || query.includes('tard') || query.includes('demor') || query.includes('bosa') || query.includes('kennedy') || query.includes('calle 72') || query.includes('centro'))) ||
    query.includes('cuanto tiempo') ||
    query.includes('cuánto tiempo') ||
    query.includes('cuanto demora') ||
    query.includes('cuánto demora') ||
    query.includes('cuanto tarda') ||
    query.includes('cuánto tarda') ||
    query.includes('travel time') ||
    query.includes('how long') ||
    query.includes('quanto tempo') ||
    query.includes('多长时间') ||
    query.includes('需要多久') ||
    query.includes('所要時間') ||
    query.includes('何分かかる');

  if (isTravelTimeQuery) {
    if (effectiveLang === 'JA') {
      return ensureSuggestionsBlock(`⏱️ **ボゴタ地下鉄1号線（PLMB）の所要時間と短縮効果:**

ボサ（Bosa）およびケネディ（Kennedy）から中心街および72番街（Calle 72）までの移動時間は **約27分** です。

- 🚗 **現在の所要時間（混雑時）:** 80〜100分（道路混雑に左右されるバスや一般車両）。
- 🚇 **地下鉄1号線での所要時間:** **27分**（専用高架橋により渋滞ゼロ・完全定時運行）。
- ⏳ **市民の時短効果:** 片道あたり **約1時間**、往復で **毎日2時間以上** の貴重な自由時間を市民に還元します！

👉 [🗺️ インタラクティブ路線図を開く](#action_map)

[SUGERENCIAS]
- 📍 ケネディ区の駅はどこ？
- ⚡ 列車の最高速度は時速何キロ？
- 🔄 トランスミレニオとの乗換駅は？`, effectiveLang);
    }
    if (effectiveLang === 'ZH') {
      return ensureSuggestionsBlock(`⏱️ **波哥大地铁一号线官方行车用时与出行效率提升：**

从博萨区（Bosa）或肯尼迪区（Kennedy）前往波哥大市中心及第72街（Calle 72）全线仅需 **约27分钟**。

- 🚗 **当前路面通勤耗时：** 在混合交通高峰期通常需要 **80至100分钟**。
- 🚇 **地铁一号线耗时：** 全程仅需 **27分钟**（100%全独立高架轨道，零堵车、零延误）。
- ⏳ **通勤时间大幅节约：** 单程节约近1小时，为沿线居民每天节省 **2小时以上** 的宝贵家庭与工作时间！

👉 [🗺️ 访问交互式全景车站地图](#action_map)

[SUGERENCIAS]
- 📍 肯尼迪区 (Kennedy) 有哪些车站？
- ⚡ 地铁列车的最高速度与平均时速是多少？
- 🔄 哪里可以换乘快速公交 TransMilenio？`, effectiveLang);
    }
    if (effectiveLang === 'EN') {
      return ensureSuggestionsBlock(`⏱️ **Travel Times and Commute Savings — Bogotá Metro Line 1:**

Traveling from Bosa or Kennedy to Downtown and Calle 72 will take **approximately 27 minutes**.

- 🚗 **Current Road Travel Time:** 80 to 100 minutes during mixed-traffic peak hours.
- 🚇 **Metro Line 1 Travel Time:** **27 minutes** via an exclusive, 100% grade-separated elevated viaduct.
- ⏳ **Time Savings:** Reduces daily round-trip commute times by **over 2 hours per day**, giving back valuable time to millions of citizens.

👉 [🗺️ Open Interactive Route Map](#action_map)

[SUGERENCIAS]
- 📍 Which stations are located in Kennedy?
- ⚡ What is the maximum speed of the trains?
- 🔄 Where can I transfer to TransMilenio?`, effectiveLang);
    }
    if (effectiveLang === 'PT') {
      return ensureSuggestionsBlock(`⏱️ **Tempo de Viagem e Economia de Tempo — Linha 1 do Metrô:**

A viagem desde Bosa ou Kennedy até o Centro e a Calle 72 levará **aproximadamente 27 minutos**.

- 🚗 **Tempo Atual no Trânsito Misto:** 80 a 100 minutos nos horários de pico.
- 🚇 **Tempo no Metrô Linha 1:** Apenas **27 minutos** em viaduto 100% segregado e contínuo.
- ⏳ **Economia para o Cidadão:** Economiza **mais de 2 horas por dia** em viagens de ida e volta!

👉 [🗺️ Ver estações no Mapa Interativo](#action_map)

[SUGERENCIAS]
- 📍 Quais estações ficam em Kennedy?
- ⚡ Qual é a velocidade máxima dos trens?
- 🔄 Onde posso fazer baldeação com TransMilenio?`, effectiveLang);
    }
    return ensureSuggestionsBlock(`⏱️ **Tiempos Oficiales de Viaje y Ahorro Ciudadano (EMB):**

El recorrido completo desde Bosa o Kennedy hasta el Centro Internacional y la Calle 72 tomará **aproximadamente 27 minutos**.

- 🚗 **Tiempo habitual actual en transporte mixto:** Entre **80 y 100 minutos** en hora pico.
- 🚇 **Tiempo en la Primera Línea del Metro:** Solo **27 minutos** de manera constante y predecible gracias al viaducto 100% exclusivo.
- ⏳ **Ahorro de tiempo para el ciudadano:** Se traduce en un ahorro de **más de 1 hora por trayecto** (más de 2 horas diarias de tiempo libre para las familias).

👉 [🗺️ Ver estas estaciones en el Mapa Interactivo](#action_map)

[SUGERENCIAS]
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- ⚡ ¿A qué velocidad irá el tren?
- 🔄 ¿Dónde puedo hacer trasbordo con TransMilenio?`, effectiveLang);
  }

  // 5. ATENCIÓN POR LOCALIDAD: KENNEDY (REQUERIMIENTO CLAVE DEMO EMB)
  const isKennedyQuery = 
    query.includes('kennedy') || 
    query.includes('ciudad kennedy') || 
    query.includes('hospital de kennedy') || 
    query.includes('timiza') || 
    query.includes('chicala') || 
    query.includes('chicalá');

  if (isKennedyQuery) {
    if (effectiveLang === 'JA') {
      return ensureSuggestionsBlock(`📍 **ケネディ区（Localidad de Kennedy）の地下鉄1号線駅一覧:**

ケネディ区内には、住民の通勤を劇的に改善する **4つの重要駅** が設置されます：

- 🚇 **第3駅: Portal Américas / Chicalá:** Av. Villavicencio con Av. Cali（トランスミレニオのアメリカス・ポータルと直結する大規模乗換ハブ）。
- 🚇 **第4駅: Carrera 80 / Ciudad Kennedy:** Av. Villavicencio con Carrera 80（ケネディ市街地中心部へのメインアクセス）。
- 🚇 **第5駅: Timiza / Hospital de Kennedy:** Av. Villavicencio con Carrera 78H / Calle 40 Sur（ケネディ総合病院、ティミサ公園、学校群への最寄駅）。
- 🚇 **第6駅: Avenida Primero de Mayo:** Av. Primero de Mayo con Av. Boyacá（ボヤカ通りとの重要商業交差点）。

👉 [🗺️ インタラクティブ路線図でこれらの駅を確認](#action_map)

[SUGERENCIAS]
- ⏱️ ケネディから中心街までの所要時間は？
- 📍 車両基地 (Patio Taller) はどこにある？
- 🔄 トランスミレニオとの乗換駅は？`, effectiveLang);
    }
    if (effectiveLang === 'ZH') {
      return ensureSuggestionsBlock(`📍 **肯尼迪行政区 (Localidad de Kennedy) 官方地铁车站分布：**

波哥大地铁一号线在肯尼迪区设有 **4座核心战略车站**，全面覆盖主要干道与公共服务中心：

- 🚇 **第3站: Portal Américas / Chicalá（美洲门户/奇卡拉站）:** Av. Villavicencio 与 Av. Cali 交汇处（与 TransMilenio 美洲门户枢纽无缝立体换乘）。
- 🚇 **第4站: Carrera 80 / Ciudad Kennedy（80街/肯尼迪城站）:** Av. Villavicencio 与 Carrera 80 交汇处（肯尼迪商业与居住核心腹地）。
- 🚇 **第5站: Timiza / Hospital de Kennedy（蒂米萨/肯尼迪医院站）:** Av. Villavicencio 与 Carrera 78H / Calle 40 Sur 交汇处（邻近肯尼迪大区医院与 Timiza 城市公园）。
- 🚇 **第6站: Avenida Primero de Mayo（五月一日大道站）:** Av. Primero de Mayo 与 Av. Boyacá 交汇处（西南部重要商贸交通十字枢纽）。

👉 [🗺️ 访问交互式全景车站地图查看肯尼迪区车站](#action_map)

[SUGERENCIAS]
- ⏱️ 从肯尼迪到市中心需要多久？
- 📍 车场 (Patio Taller) 建在哪里？
- 🔄 哪里可以换乘快速公交 TransMilenio？`, effectiveLang);
    }
    if (effectiveLang === 'EN') {
      return ensureSuggestionsBlock(`📍 **Bogotá Metro Line 1 Stations in Kennedy Locality:**

Kennedy locality features **4 key strategic stations** serving over 1.2 million residents:

- 🚇 **Station 3: Portal Américas / Chicalá:** Av. Villavicencio & Av. Cali (direct intermodal integration with TransMilenio Portal Américas hub and feeder network).
- 🚇 **Station 4: Carrera 80 / Ciudad Kennedy:** Av. Villavicencio & Carrera 80 (central access to residential and commercial heart of Ciudad Kennedy).
- 🚇 **Station 5: Timiza / Hospital de Kennedy:** Av. Villavicencio & Carrera 78H / Calle 40 Sur (immediate connection to Kennedy Hospital, Timiza Park, and health corridor).
- 🚇 **Station 6: Avenida Primero de Mayo:** Av. Primero de Mayo & Av. Boyacá (strategic commercial node with Boyacá Avenue).

👉 [🗺️ View these stations on the Interactive Map](#action_map)

[SUGERENCIAS]
- ⏱️ Travel time from Kennedy to Downtown?
- 📍 Where is the Patio Taller located?
- 🔄 Where can I transfer to TransMilenio?`, effectiveLang);
    }
    if (effectiveLang === 'PT') {
      return ensureSuggestionsBlock(`📍 **Estações da Linha 1 do Metrô na Localidade de Kennedy:**

A localidade de Kennedy conta com **4 estações estratégicas** para transformar a mobilidade:

- 🚇 **Estação 3: Portal Américas / Chicalá:** Av. Villavicencio com Av. Cali (integração modal direta com o Portal Américas do TransMilenio).
- 🚇 **Estação 4: Carrera 80 / Ciudad Kennedy:** Av. Villavicencio com Carrera 80 (acesso ao centro residencial e comercial de Ciudad Kennedy).
- 🚇 **Estação 5: Timiza / Hospital de Kennedy:** Av. Villavicencio com Carrera 78H / Calle 40 Sur (conexão direta com o Hospital de Kennedy e Parque Timiza).
- 🚇 **Estação 6: Avenida Primero de Mayo:** Av. Primero de Mayo com Av. Boyacá (interseção comercial estratégica com a Av. Boyacá).

👉 [🗺️ Ver estas estações no Mapa Interativo](#action_map)

[SUGERENCIAS]
- ⏱️ Quanto tempo leva de Kennedy ao Centro?
- 📍 Onde fica o Pátio Taller?
- 🔄 Onde posso fazer baldeação com TransMilenio?`, effectiveLang);
    }
    return ensureSuggestionsBlock(`📍 **Estaciones Oficiales de la Primera Línea del Metro en Kennedy:**

La localidad de Kennedy cuenta con **4 estaciones estratégicas**, diseñadas para transformar los tiempos de desplazamiento de más de 1.2 millones de habitantes:

- 🚇 **Estación 3: Portal Américas / Chicalá:** Ubicada en la **Av. Villavicencio con Av. Cali**. Cuenta con integración modal directa con el Portal Américas de TransMilenio y sus rutas alimentadoras.
- 🚇 **Estación 4: Carrera 80 / Ciudad Kennedy:** Ubicada en la **Av. Villavicencio con Carrera 80**, brindando acceso al núcleo comercial y residencial de Ciudad Kennedy Central.
- 🚇 **Estación 5: Timiza / Hospital de Kennedy:** Ubicada en la **Av. Villavicencio con Carrera 78H / Calle 40 Sur**. Sirve directamente al Hospital de Kennedy, al Parque Metropolitano Timiza y a centros educativos.
- 🚇 **Estación 6: Avenida Primero de Mayo:** Ubicada en la **Av. Primero de Mayo con Av. Boyacá**, en un nodo neurálgico de alta actividad económica y comercial.

👉 [🗺️ Ver estas estaciones en el Mapa Interactivo](#action_map)

[SUGERENCIAS]
- ⏱️ ¿Cuánto tiempo tomará ir desde Bosa/Kennedy al Centro?
- 📍 ¿Dónde queda el Patio Taller?
- 🔄 ¿Dónde puedo hacer trasbordo con TransMilenio?`, effectiveLang);
  }

  // 6. ATENCIÓN POR LOCALIDAD: BOSA
  const isBosaQuery = 
    query.includes('bosa') || 
    query.includes('gibraltar') || 
    query.includes('tintal');

  if (isBosaQuery) {
    if (effectiveLang === 'JA') {
      return ensureSuggestionsBlock(`📍 **ボサ区（Localidad de Bosa）の地下鉄駅と重要施設:**

- 🚇 **第1駅: Patio Taller / El Porvenir:** Carrera 96 con Calle 49 Sur（32ヘクタールの車両基地と変電所を擁する始発拠点）。
- 🚇 **第2駅: Bosa / Gibraltar:** Av. Villavicencio con Av. Tintal（ボサ南部およびティンタル地区への接続拠点）。

👉 [🗺️ インタラクティブ路線図でボサ区の駅を確認](#action_map)

[SUGERENCIAS]
- 📍 ケネディ区の駅はどこ？
- 📍 車両基地 (Patio Taller) はどこにある？
- ⏱️ ケネディから中心街までの所要時間は？`, effectiveLang);
    }
    if (effectiveLang === 'ZH') {
      return ensureSuggestionsBlock(`📍 **博萨行政区 (Localidad de Bosa) 地铁车站与关键设施：**

- 🚇 **第1站: Patio Taller / El Porvenir（车场/埃尔波尔韦尼尔站）:** Carrera 96 与 Calle 49 Sur（32公顷全线运营与检修中心）。
- 🚇 **第2站: Bosa / Gibraltar（博萨/直布罗陀站）:** Av. Villavicencio 与 Av. Tintal（连接直布罗陀与廷塔尔片区）。

👉 [🗺️ 访问交互式全景车站地图查看博萨区车站](#action_map)

[SUGERENCIAS]
- 📍 肯尼迪区 (Kennedy) 有哪些车站？
- 📍 车场 (Patio Taller) 建在哪里？
- ⏱️ 从肯尼迪到市中心需要多久？`, effectiveLang);
    }
    return ensureSuggestionsBlock(`📍 **Estaciones Oficiales en la Localidad de Bosa:**

La localidad de Bosa es el punto de inicio de la Primera Línea del Metro de Bogotá y alberga dos estaciones y el centro neurálgico del sistema:

- 🚇 **Estación 1: Patio Taller / El Porvenir:** Ubicada en la **Carrera 96 con Calle 49 Sur**, contigua al Patio Taller de 32 hectáreas.
- 🚇 **Estación 2: Bosa / Gibraltar:** Ubicada en la **Av. Villavicencio con Av. Tintal**, facilitando la conexión de los sectores de Gibraltar y Tintal.

👉 [🗺️ Ver estas estaciones en el Mapa Interactivo](#action_map)

[SUGERENCIAS]
- 📍 ¿Dónde queda el Patio Taller?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- ⏱️ ¿Cuánto tiempo tomará ir desde Bosa/Kennedy al Centro?`, effectiveLang);
  }

  // 7. ATENCIÓN POR LOCALIDAD: PUENTE ARANDA
  const isPuenteArandaQuery = 
    query.includes('puente aranda') || 
    query.includes('plaza de las americas') || 
    query.includes('plaza de las américas') || 
    query.includes('sena');

  if (isPuenteArandaQuery) {
    return ensureSuggestionsBlock(`📍 **Estaciones Oficiales en la Localidad de Puente Aranda:**

- 🚇 **Estación 7: Plaza de Las Américas:** Av. Primero de Mayo con Carrera 68 (nodo comercial e integración con la futura Troncal Av. 68).
- 🚇 **Estación 8: SENA / Carrera 50:** Av. Primero de Mayo con Carrera 50 (acceso al gran complejo de formación SENA y zona industrial).
- 🚇 **Estación 9: NQS / General Santander:** Av. Primero de Mayo con Av. NQS (gran intercambiador modal con la Troncal NQS de TransMilenio).

👉 [🗺️ Ver estas estaciones en el Mapa Interactivo](#action_map)

[SUGERENCIAS]
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- 🔄 ¿Dónde puedo hacer trasbordo con TransMilenio?
- ⏱️ ¿Cuánto tiempo tomará ir desde Bosa/Kennedy al Centro?`, effectiveLang);
  }

  // 8. ATENCIÓN POR LOCALIDAD: ANTONIO NARIÑO Y LOS MÁRTIRES
  const isAntonioNarinoQuery = 
    query.includes('antonio nariño') || 
    query.includes('antonio narino') || 
    query.includes('martires') || 
    query.includes('mártires') || 
    query.includes('hortua') || 
    query.includes('hortúa') || 
    query.includes('restrepo');

  if (isAntonioNarinoQuery) {
    return ensureSuggestionsBlock(`📍 **Estaciones Oficiales en Antonio Nariño y Los Mártires:**

- 🚇 **Estación 10: Calle 1 Sur / Hortúa:** Av. Caracas con Calle 1 Sur (acceso al Hospital La Hortúa y conexión Caracas Sur).
- 🚇 **Estación 11: Restrepo / Calle 10 Sur:** Av. Caracas con Calle 10 Sur (polo de comercio de calzado y servicios del Restrepo).
- 🚇 **Estación 12: Calle 26 / Centro Internacional:** Av. Caracas con Calle 26 (nodo de transferencia con la Troncal Calle 26 de TransMilenio hacia el Aeropuerto El Dorado).

👉 [🗺️ Ver estas estaciones en el Mapa Interactivo](#action_map)

[SUGERENCIAS]
- 🔄 ¿Dónde puedo hacer trasbordo con TransMilenio?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- ⏱️ ¿Cuánto tiempo tomará ir desde Bosa/Kennedy al Centro?`, effectiveLang);
  }

  // 9. ATENCIÓN POR LOCALIDAD: TEUSAQUILLO, CHAPINERO Y BARRIOS UNIDOS
  const isTeusaquilloChapineroQuery = 
    query.includes('teusaquillo') || 
    query.includes('chapinero') || 
    query.includes('barrios unidos') || 
    query.includes('calle 45') || 
    query.includes('calle 63') || 
    query.includes('calle 72') || 
    query.includes('universidad nacional');

  if (isTeusaquilloChapineroQuery) {
    return ensureSuggestionsBlock(`📍 **Estaciones Oficiales en Teusaquillo, Chapinero y Barrios Unidos:**

- 🚇 **Estación 13: Calle 45 / Universidad Nacional:** Av. Caracas con Calle 45 (distrito universitario UNAL, Javeriana, Piloto, Católica).
- 🚇 **Estación 14: Calle 63:** Av. Caracas con Calle 63 (eje financiero, comercial y cultural de Chapinero Central).
- 🚇 **Estación 15: Calle 72 (Intercambiador Modal):** Av. Caracas con Calle 72 (paso vehicular deprimido terminado y futura conexión con Línea 2 del Metro).

👉 [🗺️ Ver estas estaciones en el Mapa Interactivo](#action_map)

[SUGERENCIAS]
- 🔄 ¿Dónde puedo hacer trasbordo con TransMilenio?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- ⏱️ ¿Cuánto tiempo tomará ir desde Bosa/Kennedy al Centro?`, effectiveLang);
  }

  // 10. PREGUNTA ESPECÍFICA: TRASBORDOS CON TRANSMILENIO
  const isTransmilenioTransferQuery = 
    query.includes('trasbordo') || 
    query.includes('transbordo') || 
    query.includes('transferencia') || 
    query.includes('transmilenio') || 
    query.includes('conectar con transmilenio') || 
    query.includes('conexión') || 
    query.includes('conexion') || 
    query.includes('transfer') || 
    query.includes('baldeação') || 
    query.includes('换乘') || 
    query.includes('乗換');

  if (isTransmilenioTransferQuery) {
    if (effectiveLang === 'JA') {
      return ensureSuggestionsBlock(`🔄 **トランスミレニオ（BRT）との直結乗換駅一覧:**

地下鉄1号線の全16駅中 **10駅** がトランスミレニオ専用レーンとシームレスに直接結ばれます：

- 🚉 **ポルタル・アメリカス (第3駅):** トランスミレニオ幹線バスターミナルと直接接続。
- 🚉 **Av. 68 (第7駅):** 建設中の第68通りBRT幹線と立体交差接続。
- 🚉 **NQS / General Santander (第9駅):** NQS幹線（Carrera 30）との大規模乗換通路。
- 🚉 **Calle 1 Sur / Hortúa (第10駅):** カラカス南幹線との接続。
- 🚉 **Restrepo (第11駅):** レストレポ地区のBRT改札直結。
- 🚉 **Calle 26 / Centro Internacional (第12駅):** エル・ドラード国際空港方面へ向かう第26街幹線と地下/地上直結。
- 🚉 **Calle 45 / Calle 63 / Calle 72 (第13〜15駅):** カラカス通りの各BRT停留所とシームレス直結。

💳 **統合運賃・無料乗換:** ICカード「TuLlave」により **110分以内の乗換が追加料金0ペソ** で利用可能です！

👉 [🗺️ インタラクティブ路線図で乗換駅を確認](#action_map)

[SUGERENCIAS]
- 📍 ケネディ区の駅はどこ？
- 💳 運賃と支払い方法は？
- ⏱️ ケネディから中心街までの所要時間は？`, effectiveLang);
    }
    if (effectiveLang === 'ZH') {
      return ensureSuggestionsBlock(`🔄 **波哥大快速公交 TransMilenio 与地铁一号线换乘枢纽：**

全线16座地铁车站中，共有 **10座车站** 与 TransMilenio 快速公交干线设立了立体无缝换乘通道：

- 🚉 **美洲门户枢纽 (第3站):** 连通 Portal Américas 始发站及微循环接驳公交网络。
- 🚉 **68街大道 (第7站):** 与在建的 Avenida 68 快速公交干线相交。
- 🚉 **NQS / General Santander (第9站):** 连通 NQS (Carrera 30) 快速干线。
- 🚉 **Calle 1 Sur / Hortúa (第10站):** 连通 Caracas Sur 支线。
- 🚉 **Restrepo (第11站):** 连通 Restrepo 快速公交站。
- 🚉 **Calle 26 / 国际中心 (第12站):** 直通第26街干线（直达埃尔多拉多国际空港）。
- 🚉 **Calle 45 / Calle 63 / Calle 72 (第13、14、15站):** 连通 Caracas 中区各核心干线车站。

💳 **票价整合优惠:** 持 **TuLlave** 智能交通卡在 **110分钟有效窗口** 内换乘享受 **0比索/免收二次基础票价**。

👉 [🗺️ 访问交互式全景车站地图查看换乘点](#action_map)

[SUGERENCIAS]
- 📍 肯尼迪区 (Kennedy) 有哪些车站？
- 💳 地铁票价是多少以及如何支付？
- ⏱️ 从肯尼迪到市中心需要多久？`, effectiveLang);
    }
    if (effectiveLang === 'EN') {
      return ensureSuggestionsBlock(`🔄 **Intermodal Transfers with TransMilenio (BRT):**

Bogotá Metro Line 1 features **10 multimodal transfer stations** directly integrated with TransMilenio:

- 🚉 **Portal Américas (Station 3):** Direct pedestrian concourses to the Portal Américas terminal and feeder buses.
- 🚉 **Avenida 68 (Station 7):** Connects with the future Av. 68 BRT line.
- 🚉 **NQS / General Santander (Station 9):** Major connection with the NQS (Carrera 30) trunk line.
- 🚉 **Calle 1 Sur / Hortúa (Station 10):** Connects to the Caracas Sur corridor.
- 🚉 **Restrepo (Station 11):** Direct transfer to Restrepo BRT station.
- 🚉 **Calle 26 / Centro Internacional (Station 12):** Transfers to the Calle 26 trunk line heading directly to El Dorado International Airport.
- 🚉 **Calle 45, Calle 63, and Calle 72 (Stations 13, 14, 15):** Full integration along the Avenida Caracas corridor.

💳 **Integrated Fare Window:** Using the **TuLlave** smart card, transfers within **110 minutes** are $0 COP or heavily subsidized.

👉 [🗺️ View Transfer Stations on the Interactive Map](#action_map)

[SUGERENCIAS]
- 📍 Which stations are located in Kennedy?
- 💳 How do fares and payments work?
- ⏱️ Travel time from Kennedy to Downtown?`, effectiveLang);
    }
    return ensureSuggestionsBlock(`🔄 **Estaciones de Integración Modal con TransMilenio:**

La Primera Línea del Metro de Bogotá cuenta con **10 estaciones de integración modal directa** con el sistema troncal de TransMilenio:

1. 🚉 **Portal Américas (Estación 3):** Conexión directa mediante pasarelas peatonales con el Portal de TransMilenio y sus rutas alimentadoras.
2. 🚉 **Plaza de Las Américas (Estación 7):** Futura conexión con la nueva Troncal de la Carrera 68.
3. 🚉 **NQS / General Santander (Estación 9):** Gran nodo intermodal de transferencia con la Troncal NQS (Carrera 30).
4. 🚉 **Calle 1 Sur / Hortúa (Estación 10):** Integración con la Troncal Caracas Sur.
5. 🚉 **Restrepo / Calle 10 Sur (Estación 11):** Acceso directo a la estación de TransMilenio Restrepo.
6. 🚉 **Calle 26 / Centro Internacional (Estación 12):** Nodo intermodal masivo con la Troncal Calle 26 (conexión directa hacia el Aeropuerto Internacional El Dorado).
7. 🚉 **Calle 45, Calle 63 y Calle 72 (Estaciones 13, 14 y 15):** Integración continua a lo largo del corredor de la Avenida Caracas.

💳 **Beneficio de Tarifa Integrada:** Con la tarjeta **TuLlave**, cuentas con una ventana de **110 minutos** para hacer hasta dos trasbordos a costo **$0 COP** entre buses zonales, TransMiCable, troncales y el Metro.

👉 [🗺️ Ver estas estaciones en el Mapa Interactivo](#action_map)

[SUGERENCIAS]
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- 💳 ¿Cuál es la tarifa y cómo se paga?
- ⏱️ ¿Cuánto tiempo tomará ir desde Bosa/Kennedy al Centro?`, effectiveLang);
  }

  // 11. PREGUNTA ESPECÍFICA: VELOCIDAD DEL TREN
  const isSpeedQuery = 
    query.includes('velocidad') || 
    query.includes('rapido') || 
    query.includes('rápido') || 
    query.includes('km/h') || 
    query.includes('speed') || 
    query.includes('velocidade') || 
    query.includes('速度') || 
    query.includes('时速') || 
    query.includes('時速');

  if (isSpeedQuery) {
    if (effectiveLang === 'JA') {
      return ensureSuggestionsBlock(`⚡ **地下鉄列車の運行速度データ:**

- 🚀 **最高設計速度:** **80 km/h**
- 🚇 **平均商業運行速度:** **42.5 km/h**（各駅の停車時間を含む）
- ⏱️ **比較:** 一般車両やバスの平均時速（12〜16 km/h）の **3倍以上** のスピードで定時運行されます。

[SUGERENCIAS]
- ⏱️ ケネディから中心街までの所要時間は？
- 📍 ケネディ区の駅はどこ？
- 🗺️ インタラクティブ路線図を開く`, effectiveLang);
    }
    if (effectiveLang === 'ZH') {
      return ensureSuggestionsBlock(`⚡ **波哥大地铁列车技术车速指标：**

- 🚀 **最高设计运行时速：** **80 km/h**
- 🚇 **平均商业运营速度：** **42.5 km/h**（包含各车站正常停站开闭门时间）
- ⏱️ **路面对比：** 是波哥大路面机动车与公交早晚高峰平均车速（12-16 km/h）的 **近3倍**，全程零拥堵。

[SUGERENCIAS]
- ⏱️ 从肯尼迪到市中心需要多久？
- 📍 肯尼迪区 (Kennedy) 有哪些车站？
- 🗺️ 访问交互式全景车站地图`, effectiveLang);
    }
    return ensureSuggestionsBlock(`⚡ **Velocidad Oficial de los Trenes del Metro de Bogotá:**

- 🚀 **Velocidad Máxima de Diseño:** **80 km/h**.
- 🚇 **Velocidad Comercial Promedio:** **42.5 km/h** (incluyendo el tiempo de parada de 20 a 30 segundos en cada una de las 16 estaciones).
- ⏱️ **Comparación con el tráfico mixto:** La velocidad comercial del metro triplica la velocidad promedio del tráfico vehicular en horas pico en Bogotá (que oscila entre 13 y 16 km/h).

[SUGERENCIAS]
- ⏱️ ¿Cuánto tiempo tomará ir desde Bosa/Kennedy al Centro?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- 🗺️ Ver estaciones en el Mapa Interactivo`, effectiveLang);
  }

  // 12. PREGUNTA ESPECÍFICA: TARIFA, PRECIO Y MEDIO DE PAGO
  const isTarifaQuery = 
    query.includes('tarifa') || 
    query.includes('precio') || 
    query.includes('pasaje') || 
    query.includes('costo pasaje') || 
    query.includes('cuanto cuesta') || 
    query.includes('cuánto cuesta') || 
    query.includes('cuanto vale') || 
    query.includes('cuánto vale') || 
    query.includes('como se paga') || 
    query.includes('cómo se paga') || 
    query.includes('fare') || 
    query.includes('price') || 
    query.includes('bilhete') || 
    query.includes('票价') || 
    query.includes('运费') || 
    query.includes('運賃') || 
    query.includes('action_recharge');

  if (isTarifaQuery) {
    return ensureSuggestionsBlock(`💳 **Tarifa Integrada y Medios de Pago Oficiales (SITP / EMB):**

La tarifa de la Primera Línea del Metro estará plenamente integrada a la canasta tarifaria del Sistema Integrado de Transporte Público (SITP) de Bogotá:

- 🎟️ **Valor Estimado del Pasaje:** Estará unificado con la tarifa troncal (proyectada indexada entre **$2.950 y $3.150 COP**).
- 🔄 **Ventana de Trasbordo:** Tarifa de trasbordo a costo **$0 COP** o con descuento preferencial dentro de los **110 minutos** siguientes a la primera validación.
- 💳 **Medios de Pago 100% Electrónicos:**
  * Tarjeta inteligente **TuLlave / TuTarjetaMetro** personalizada (con saldo protegido y 2 viajes a crédito).
  * Tarjetas débito y crédito bancarias con tecnología **Contactless**.
  * Códigos QR dinámicos generados desde billeteras digitales y la app oficial.
  * Recarga digital instantánea a través de **PSE, Nequi y Daviplata**.

👉 [💳 Recargar TuTarjetaMetro en UrbanGo](#action_recharge)

[SUGERENCIAS]
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- 🔄 ¿Dónde puedo hacer trasbordo con TransMilenio?
- ⏱️ ¿Cuánto tiempo tomará ir desde Bosa/Kennedy al Centro?`, effectiveLang);
  }

  // 13. ESPECIFICACIONES DE VAGONES Y TRENES (CRRC CHANGCHUN, MEDIDAS)
  const isVagonesSpecific = 
    query.includes('vagon') || 
    query.includes('vagones') || 
    query.includes('cuantos vagones') || 
    query.includes('cuántos vagones') ||
    query.includes('fabricante') ||
    query.includes('crrc') ||
    query.includes('longitud del tren') ||
    query.includes('cars') ||
    query.includes('両') ||
    query.includes('編成') ||
    query.includes('vagões') ||
    query.includes('vagao') ||
    query.includes('vagão');

  if (isVagonesSpecific) {
    if (effectiveLang === 'JA') {
      return ensureSuggestionsBlock(`🚆 **ボゴタ地下鉄1号線 車両諸元データ (CRRC製):**

- 🔢 **編成両数:** **6両固定編成**
- 📏 **編成全長:** **145メートル**（車幅 2.90m、車高 3.80m）
- 👥 **輸送定員:** **1,800名**（1両あたり300名、ラッシュ時最大2,000名）
- 🚪 **ドア数:** 各両片側4箇所（1編成あたり計24箇所の両開きドア）
- ⚡ **制御技術:** **100%電気駆動**、**完全自動無人運転 (GoA4 UTO)**、CBTC無線列車制御
- 🏭 **製造メーカー:** **CRRC長春軌道客車** (CRRC Changchun Railway Vehicles)

[SUGERENCIAS]
- 👥 列車の定員と輸送能力はどのくらい？
- ⚡ 列車の最高速度は時速何キロ？
- 🗺️ インタラクティブ路線図を開く`, effectiveLang);
    }
    return ensureSuggestionsBlock(`🚆 **Ficha Técnica Oficial de los Trenes de la Línea 1 (EMB):**

- 🔢 **Composición:** **6 vagones** continuos por tren.
- 📏 **Dimensiones:** Longitud total de **145 metros**, ancho exterior de 2.90 metros y altura de 3.80 metros.
- 👥 **Capacidad y Aforo:** **1.800 pasajeros** por tren nominal (300 por vagón), y hasta 2.000 en condiciones extraordinarias de hora pico.
- 🚪 **Puertas:** 4 puertas dobles por costado en cada vagón (24 puertas dobles por tren) para un embarque en menos de 20-30 segundos.
- 🤖 **Automatización:** Grado **GoA4 (Unattended Train Operation)** sin conductor humano a bordo, controlado desde el Puesto Central de Control (PCC) de Bosa.
- 🏭 **Fabricante:** **CRRC Changchun Railway Vehicles Co., Ltd.**, contratado por el concesionario Metro Línea 1 S.A.S.

👉 [🗺️ Ver estaciones en el Mapa Interactivo](#action_map)

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- ⚡ ¿Cuál es la velocidad máxima de los trenes?
- ⏱️ ¿Cuánto tiempo tomará ir desde Bosa/Kennedy al Centro?`, effectiveLang);
  }

  // 14. FRECUENCIA EN HORA PICO Y HORARIOS
  const isFrequencyQuery = 
    query.includes('frecuencia') || 
    query.includes('cada cuanto') || 
    query.includes('cada cuánto') || 
    query.includes('intervalo') || 
    query.includes('horario') || 
    query.includes('a que hora') || 
    query.includes('a qué hora') || 
    query.includes('frequency') || 
    query.includes('schedule') || 
    query.includes('hours') || 
    query.includes('peak') || 
    query.includes('间隔') || 
    query.includes('运营时间') || 
    query.includes('始発');

  if (isFrequencyQuery) {
    return ensureSuggestionsBlock(`⏱️ **Frecuencia Programada y Horarios Oficiales:**

- 🌅 **En Hora Pico:** Un tren cada **2 a 3 minutos** (hasta 20 a 30 trenes por hora).
- 🚀 **Capacidad Máxima con Puertas de Andén (PSD):** Intervalo reducible a **90 segundos**.
- 🕐 **Horario de Operación Oficial:** **4:30 a.m. a 11:00 p.m.** todos los días del año (365 días).

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- ⚡ ¿A qué velocidad irá el tren?`, effectiveLang);
  }

  // 15. AVANCE GENERAL DE OBRA: 82.33% (corte oficial EMB)
  const isProgressQuery = 
    query.includes('82.33') || 
    query.includes('avance general') || 
    query.includes('avance fisico') || 
    query.includes('avance físico') || 
    query.includes('estado de obra') || 
    query.includes('avance de obra') || 
    query.includes('como va la obra') || 
    query.includes('cómo va la obra') || 
    query.includes('open_project_status');

  if (isProgressQuery) {
    if (effectiveLang === 'JA') {
      return ensureSuggestionsBlock(`📊 **地下鉄1号線 公式工事進捗状況 (EMB 2026):**

- **総合進捗率:** **82.33%**（ボゴタ地下鉄公社公式）
- **高架橋:** 6基の大型架設機が各工区でU桁架設中
- **ボサ車両基地:** 91%完了、試験線で電車動的試験走行中
- **72番街アンダーパス:** 93%完了、車道供用開始済み

👉 [🚧 Ver Estado de Obra en Vivo](#open_project_status)

[SUGERENCIAS]
- 👥 列車の定員と輸送能力はどのくらい？
- 📍 ケネディ区の駅はどこ？
- 📍 車両基地 (Patio Taller) はどこにある？`, effectiveLang);
    }
    if (effectiveLang === 'ZH') {
      return ensureSuggestionsBlock(`📊 **波哥大地铁一号线官方实际综合施工进度 (EMB 2026)：**

根据波哥大地铁公司（EMB）2026年最新官方报告，全线实体工程综合执行进度达到 **82.33%**：
- 🌉 **高架桥梁:** 6台大型架桥机在各主要标段协同推进预制梁架设。
- 🏭 **博萨车辆段:** 总体完成超 **91%**，新列车在轨动车测试持续进行。
- 🔄 **第72街立体枢纽:** 进度已超 **93%**，地下车道已通车。

👉 [🚧 Ver Estado de Obra en Vivo](#open_project_status)

[SUGERENCIAS]
- 👥 地铁列车与车站的额定载客量是多少？
- 📍 肯尼迪区 (Kennedy) 有哪些车站？
- 📍 车场 (Patio Taller) 建在哪里？`, effectiveLang);
    }
    if (effectiveLang === 'EN') {
      return ensureSuggestionsBlock(`📊 **Official Physical Progress — Bogotá Metro Line 1 (EMB 2026):**

According to official Empresa Metro de Bogotá (EMB) records, physical progress stands at **82.33%**:
- 🌉 **Viaduct Structure:** 6 launching gantries actively erecting precast spans.
- 🏭 **Bosa Yard:** Over **91% completed**, conducting dynamic tests with automatic trains.
- 🔄 **Calle 72 Interchange:** Exceeds **93%**, with vehicular underpass open to traffic.

👉 [🚧 Ver Estado de Obra en Vivo](#open_project_status)

[SUGERENCIAS]
- 👥 What is the passenger capacity and volume?
- 📍 Which stations are located in Kennedy?
- 📍 Where is the Patio Taller located?`, effectiveLang);
    }
    if (effectiveLang === 'PT') {
      return ensureSuggestionsBlock(`📊 **Avanço Físico Oficial da Obra (EMB 2026):**

O avanço físico consolidado oficial é de **82.33%**:
- 🌉 **Viaduto:** 6 treliças lançadoras em montagem contínua.
- 🏭 **Pátio Bosa:** Mais de **91% concluído**, com testes dinâmicos de rodagem.
- 🔄 **Trevo Calle 72:** Supera **93%**, com passagem subterrânea em operação.

👉 [🚧 Ver Estado de Obra en Vivo](#open_project_status)

[SUGERENCIAS]
- 👥 Qual é a capacidade e lotação de passageiros?
- 📍 Quais estações ficam em Kennedy?
- 📍 Onde fica o Pátio Taller?`, effectiveLang);
    }
    return ensureSuggestionsBlock(`📊 **Avance Físico Oficial de la Primera Línea del Metro (EMB 2026):**

El reporte de la Empresa Metro de Bogotá (EMB) certifica un **avance físico general consolidado del 82.33%**:

- 🌉 **Viaducto Elevado:** 6 vigas lanzadoras izando dovelas continuas entre Bosa, Primero de Mayo y la Avenida Caracas.
- 🏭 **Patio Taller de Bosa:** **91% de ejecución**, con pruebas dinámicas sobre vía con los trenes automáticos 1 y 2.
- 🔄 **Intercambiador Calle 72:** **93% de avance general**, paso a desnivel vial en funcionamiento y adecuación de espacio público.
- 📅 **Hitos del Cronograma:** Pruebas dinámicas en 2026, pruebas integrales con usuarios en 2027 y **operación comercial en 2028**.

👉 [🚧 Ver Estado de Obra en Vivo](#open_project_status)

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- 📍 ¿Dónde queda el Patio Taller?`, effectiveLang);
  }

  // 16. LÍNEA 2 DEL METRO DE BOGOTÁ (L2)
  const isLinea2Query = 
    query.includes('linea 2') || 
    query.includes('línea 2') || 
    query.includes('segunda linea') || 
    query.includes('segunda línea') || 
    query.includes('suba') || 
    query.includes('engativa') || 
    query.includes('engativá') || 
    query.includes('fontanar') || 
    query.includes('line 2') || 
    query.includes('linha 2') || 
    query.includes('2号线') || 
    query.includes('2号線');

  if (isLinea2Query) {
    return ensureSuggestionsBlock(`🚇 **Segunda Línea del Metro de Bogotá (L2 - Subterránea):**

La Línea 2 del Metro de Bogotá conectará el noroccidente de la ciudad con el centro expandido:

- 📏 **Longitud:** **15.5 kilómetros** (en su gran mayoría subterránea).
- 🚉 **Estaciones:** **11 estaciones** (10 subterráneas y 1 elevada).
- 🗺️ **Trazado:** Inicia en el intercambiador de la **Calle 72 con Caracas** (donde se conecta directamente con la Estación 15/16 de la Línea 1), cruza Barrios Unidos y Engativá por la Calle 72 y la Av. Cali, y llega hasta **Suba** y el Patio Taller de **Fontanar del Río**.
- 👥 **Población Beneficiada:** Más de **2.5 millones de habitantes**.
- 💰 **Inversión Estimada:** Aprox. **$35 billones COP** (cofinanciada 70% Nación y 30% Distrito Capital).

👉 [🗺️ Ver conexión en el Mapa Interactivo](#action_map)

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- 🚧 Ver estado de avance de obra (82.33%)`, effectiveLang);
  }

  // 17. FINANCIACIÓN, COSTOS Y PRESUPUESTO
  const isFinanciacionQuery = 
    query.includes('inversion') || 
    query.includes('inversión') || 
    query.includes('costo') || 
    query.includes('costos') || 
    query.includes('cuanto costo') || 
    query.includes('cuánto costó') || 
    query.includes('cuanto vale') || 
    query.includes('cuánto vale') || 
    query.includes('presupuesto') || 
    query.includes('financia') || 
    query.includes('financian') || 
    query.includes('financiacion') || 
    query.includes('financiación') || 
    query.includes('banco mundial') || 
    query.includes('bid') || 
    query.includes('bei') || 
    query.includes('caf') || 
    query.includes('funding') || 
    query.includes('budget') || 
    query.includes('造价') || 
    query.includes('予算');

  if (isFinanciacionQuery) {
    return ensureSuggestionsBlock(`💰 **Inversión y Financiación Oficial de la Primera Línea del Metro:**

- 💵 **Presupuesto de Obra:** **$16.27 billones COP** (inversión integral del proyecto superior a **$22.3 billones COP** incluyendo redes matrices, compra de predios y troncales alimentadoras).
- 🏛️ **Esquema de Cofinanciación:**
  * **70%** aportado por el **Gobierno Nacional de Colombia**.
  * **30%** aportado por la **Alcaldía Mayor de Bogotá (Distrito Capital)**.
- 🏦 **Banca Multilateral Vigilante:** Financiado con créditos contratados con el **Banco Mundial (BIRF)**, el **Banco Interamericano de Desarrollo (BID)**, el **Banco Europeo de Inversiones (BEI)** y la **CAF**.
- 📑 **Modalidad de Contratación:** Concesión integral a 20 años con el consorcio internacional **Metro Línea 1 S.A.S.** bajo estricta supervisión de la Empresa Metro de Bogotá (EMB).

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- 🚧 Ver estado de avance de obra (82.33%)
- 🗺️ Ver estaciones en el Mapa Interactivo`, effectiveLang);
  }

  // 18. CONCESIONARIO, FABRICANTE Y EMPRESAS
  const isConcesionarioQuery = 
    query.includes('concesionario') || 
    query.includes('quien construye') || 
    query.includes('quién construye') || 
    query.includes('quien lo hace') || 
    query.includes('quién lo hace') || 
    query.includes('fabrica') || 
    query.includes('fabrican') || 
    query.includes('fabricante') || 
    query.includes('quien fabrica') || 
    query.includes('quién fabrica') || 
    query.includes('crrc') || 
    query.includes('empresa china') || 
    query.includes('chec') || 
    query.includes('china harbour') || 
    query.includes('constructor') || 
    query.includes('contractor') || 
    query.includes('builder');

  if (isConcesionarioQuery) {
    return ensureSuggestionsBlock(`🏗️ **Concesionario y Entidades del Metro de Bogotá:**

- 🏢 **Concesionario Oficial:** **Metro Línea 1 S.A.S.**, consorcio conformado por:
  * **China Harbour Engineering Company Ltd. (CHEC)**: una de las mayores empresas de infraestructura del mundo.
  * **Xi'an Rail Transit Group**: operador de la red de metro de Xi'an con millones de pasajeros diarios.
- 🚆 **Fabricante de los Trenes:** **CRRC Changchun Railway Vehicles Co., Ltd.**
- 🏛️ **Propietario y Supervisor Estatal:** **Empresa Metro de Bogotá S.A. (EMB)**, empresa industrial y comercial del Distrito Capital.
- 🔍 **Interventoría Integral:** Consorcio Supervisor L1.

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- 🚧 Ver estado de avance de obra (82.33%)
- 📍 ¿Dónde queda el Patio Taller?`, effectiveLang);
  }

  // 19. TECNOLOGÍA, AUTOMATIZACIÓN Y SEGURIDAD
  const isTecnologiaQuery = 
    query.includes('automatizacion') || 
    query.includes('automatización') || 
    query.includes('goa4') || 
    query.includes('cbtc') || 
    query.includes('sin conductor') || 
    query.includes('conductor') || 
    query.includes('automatico') || 
    query.includes('automático') || 
    query.includes('driverless') || 
    query.includes('seguridad') || 
    query.includes('camaras') || 
    query.includes('cámaras') || 
    query.includes('cctv') || 
    query.includes('psd') || 
    query.includes('puertas de anden') || 
    query.includes('accesibilidad') || 
    query.includes('pmr');

  if (isTecnologiaQuery) {
    return ensureSuggestionsBlock(`🤖 **Tecnología, Automatización y Seguridad de la Línea 1:**

- 🛰️ **Nivel de Automatización GoA4 (UTO):** Operación 100% desatendida sin conductor humano a bordo.
- 📡 **Señalización Ferroviaria CBTC:** Control de trenes basado en comunicaciones vía radio continua bidireccional, garantizando distancias seguras y frenado preventivo milimétrico.
- 🚪 **Puertas de Pantalla de Andén (PSD):** Presentes en los 145 metros de andén de las 16 estaciones para impedir el ingreso a las vías y proteger a los pasajeros.
- 📹 **Videovigilancia Inteligente:** Más de **1.200 cámaras CCTV** con analítica de inteligencia artificial conectadas al Puesto Central de Control (PCC) en Bosa.
- ♿ **Accesibilidad Universal (100% PMR):** Ascensores en todos los niveles, pisos podotáctiles, señalización en braille, bucles magnéticos para personas hipoacúsicas y espacios preferenciales en cada vagón.

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- ⚡ ¿Cuál es la velocidad máxima de los trenes?
- 🗺️ Ver estaciones en el Mapa Interactivo`, effectiveLang);
  }

  // 20. SOSTENIBILIDAD Y MEDIO AMBIENTE
  const isSostenibilidadQuery = 
    query.includes('sostenibilidad') || 
    query.includes('medio ambiente') || 
    query.includes('ambiental') || 
    query.includes('verde') || 
    query.includes('co2') || 
    query.includes('emisiones') || 
    query.includes('contaminacion') || 
    query.includes('contaminación') || 
    query.includes('arboles') || 
    query.includes('árboles') || 
    query.includes('ciclorruta') || 
    query.includes('espacio publico') || 
    query.includes('espacio público');

  if (isSostenibilidadQuery) {
    return ensureSuggestionsBlock(`🌿 **Sostenibilidad y Beneficios Ambientales de la Línea 1:**

- ⚡ **100% Eléctrico y Cero Emisiones:** Tracción eléctrica que evita la emisión directa de gases contaminantes en los barrios de Bogotá.
- 📉 **Reducción de CO₂:** Se proyecta evitar más de **171.000 toneladas de CO₂ al año**, mejorando drásticamente la calidad del aire del suroccidente y centro.
- 🌳 **Renovación Urbana Verde:** Creación de más de **95.000 m² de nuevo espacio público**, siembra masiva de árboles nativos y plazoletas bioclimáticas.
- 🚲 **Movilidad Sostenible Integrada:** Ciclorrutas continuas debajo del viaducto y biciparqueaderos seguros en todas las estaciones.

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- ⏱️ ¿Cuánto tiempo tomará ir desde Bosa/Kennedy al Centro?
- 🗺️ Ver estaciones en el Mapa Interactivo`, effectiveLang);
  }

  // 21. MAPA INTERACTIVO Y TRAZADO GENERAL
  const isMapQuery = 
    query.includes('mapa') || 
    query.includes('donde estan') || 
    query.includes('dónde están') || 
    query.includes('todas las estaciones') || 
    query.includes('recorrido') || 
    query.includes('trazado') || 
    query.includes('action_map');

  if (isMapQuery) {
    return ensureSuggestionsBlock(`🗺️ **Trazado General y Mapa Interactivo de la Primera Línea del Metro:**

El viaducto elevado comprende **23.9 kilómetros continuos** y **16 estaciones**, cruzando 9 localidades de Bogotá desde el suroccidente hasta el nororiente:

1. **Bosa:** Estaciones 1 y 2 (incluyendo Patio Taller).
2. **Kennedy:** Estaciones 3, 4, 5 y 6 (Portal Américas, Cra 80, Timiza, Primero de Mayo).
3. **Puente Aranda:** Estaciones 7, 8 y 9 (Plaza de Las Américas, SENA, NQS).
4. **Antonio Nariño y Los Mártires:** Estaciones 10, 11 y 12 (Calle 1 Sur, Restrepo, Calle 26).
5. **Teusaquillo, Chapinero y Barrios Unidos:** Estaciones 13, 14 y 15 (Calle 45, Calle 63, Calle 72).

👉 [🗺️ Abrir Mapa Interactivo Completo de Estaciones](#action_map)

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- 📍 ¿Dónde queda el Patio Taller?`, effectiveLang);
  }

  // 22. TARJETA, SALDO Y RECARGAS
  const isCardQuery = 
    query.includes('saldo') || 
    query.includes('tarjeta') || 
    query.includes('recarga') || 
    query.includes('recargar') || 
    query.includes('tullave') || 
    query.includes('nequi') || 
    query.includes('daviplata');

  if (isCardQuery) {
    return ensureSuggestionsBlock(`💳 **Tarjeta Tullave / Metro y Recargas en Línea:**

- 📱 **En esta aplicación UrbanGo:** Puedes registrar tu tarjeta Tullave (16 dígitos), consultar tu saldo simulado y recargar virtualmente vía Nequi, Daviplata o PSE.
- 🛡️ **Seguridad del Saldo:** Al personalizar tu tarjeta, proteges tu saldo en caso de pérdida o robo y accedes a 2 viajes a crédito.
- ⚡ **Validación Rápida:** Con tecnología NFC y sin contacto para paso expedito en torniquetes y puertas de andén.

👉 [💳 Recargar TuTarjetaMetro](#action_recharge)

[SUGERENCIAS]
- 💳 ¿Cuál es la tarifa y cómo se paga?
- 🔄 ¿Dónde puedo hacer trasbordo con TransMilenio?
- 🗺️ Ver estaciones en el Mapa Interactivo`, effectiveLang);
  }

  // 23. EMPLEO Y CONVOCATORIAS
  const isJobQuery = 
    query.includes('empleo') || 
    query.includes('trabajo') || 
    query.includes('trabajar') || 
    query.includes('vacante') || 
    query.includes('vacantes') || 
    query.includes('postular') || 
    query.includes('hoja de vida') || 
    query.includes('job') || 
    query.includes('open_portal_empleo');

  if (isJobQuery) {
    return ensureSuggestionsBlock(`💼 **Convocatorias Oficiales de Empleo en la Primera Línea del Metro:**

El Consorcio Metro Línea 1 y la Alcaldía Mayor a través de Bogotá Trabaja tienen abiertas más de **180 vacantes laborales activas**:
- 🏗️ **Construcción y Obra:** Auxiliares de obra (job_1), armadores, operadores de maquinaria pesada.
- 📐 **Ingeniería:** Ingenieros civiles residentes (job_2), inspectores SST, topógrafos.
- 🚆 **Operación y Sistemas:** Técnicos electromecánicos, operadores de patio y especialistas CBTC.

👉 [💼 Ver Bolsa de Empleo](#open_portal_empleo)

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- 🚧 Ver estado de avance de obra (82.33%)
- 🗺️ Ver estaciones en el Mapa Interactivo`, effectiveLang);
  }

  // 24. REPORTAR INCIDENCIAS VIALES
  const isReportQuery = 
    query.includes('reportar') || 
    query.includes('incidencia') || 
    query.includes('cierre') || 
    query.includes('desvio') || 
    query.includes('desvío') || 
    query.includes('action_report');

  if (isReportQuery) {
    return ensureSuggestionsBlock(`🚨 **Reporte de Incidencias Viales y Desvíos Ciudadanos:**

Puedes reportar o consultar en tiempo real cerramientos viales, desvíos por izaje de vigas, huecos o semáforos apagados en los corredores de obra del metro (Avenida Caracas, Calle 72, Av. Primero de Mayo).

👉 [🚨 Reportar Incidencia Vial](#action_report)

[SUGERENCIAS]
- 🗺️ Ver rutas y estaciones en el Mapa Interactivo
- 🚧 ¿Cuál es el avance físico de la obra (82.33%)?
- 💳 Recargar TuTarjetaMetro`, effectiveLang);
  }

  // 25. SALUDOS
  const isGreeting = 
    query === 'hola' || 
    query.startsWith('hola') || 
    query.includes('buenos dias') || 
    query.includes('buenos días') || 
    query.includes('buenas tardes') || 
    query.includes('hello') || 
    query.includes('hi') || 
    query.includes('你好') || 
    query.includes('olá');

  if (isGreeting) {
    return ensureSuggestionsBlock(`¡Hola! Soy **MetroBot IA** 🤖, el asistente virtual inteligente oficial de la Empresa Metro de Bogotá (EMB).

Estoy listo para responder tus dudas con datos oficiales concretos (**aforo de personas**, **82.33% de avance físico**, estaciones en Kennedy y Bosa, conexiones con TransMilenio, tarifas y tiempos de viaje):

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- 📍 ¿Dónde queda el Patio Taller?
- 🔄 ¿Dónde puedo hacer trasbordo con TransMilenio?`, effectiveLang);
  }

  // 26. SMART KNOWLEDGE BASE FALLBACK (EXHAUSTIVO PARA TODAS LAS PREGUNTAS DEL METRO)
  if (effectiveLang === 'JA') {
    return ensureSuggestionsBlock(`ご質問 **「${userInput}」** について：ボゴタ地下鉄1号線（PLMB）は公式進捗率 **82.33%** で順調に施工中です。

全線23.9kmの高架専用軌道、16の近代的な駅（トランスミレニオ接続10駅）、および定員1,800名の完全自動無人運転（GoA4）電車30編成を備えています。

定員・輸送能力（1編成1,800名）、ケネディ区やボサ区の駅の場所、車両基地、トランスミレニオ乗換、運賃、所要時間について何でもお尋ねください。

👉 [🗺️ インタラクティブ路線図を開く](#action_map)

[SUGERENCIAS]
- 👥 列車の定員と輸送能力はどのくらい？
- 📍 ケネディ区の駅はどこ？
- 📍 車両基地 (Patio Taller) はどこにある？
- ⏱️ ケネディから中心街までの所要時間は？`, effectiveLang);
  }

  if (effectiveLang === 'ZH') {
    return ensureSuggestionsBlock(`关于您的咨询 **"${userInput}"**：波哥大地铁一号线（PLMB）目前全线实际综合执行进度达 **82.33%**。

全线包含 **23.9公里独立高架桥**、**16座现代化车站**（10座与快速公交无缝换乘）以及 **30列6编组全自动无人驾驶列车（GoA4）**，单列定员1,800人，系统单向高峰小时运能达72,000人次。

您可以向我咨询载客量、肯尼迪或博萨区车站分布、车场位置、公交换乘、票价政策或全程用时：

👉 [🗺️ 访问交互式全景车站地图](#action_map)

[SUGERENCIAS]
- 👥 地铁列车与车站的额定载客量是多少？
- 📍 肯尼迪区 (Kennedy) 有哪些车站？
- 📍 车场 (Patio Taller) 建在哪里？
- ⏱️ 从肯尼迪到市中心需要多久？`, effectiveLang);
  }

  if (effectiveLang === 'EN') {
    return ensureSuggestionsBlock(`Regarding your inquiry about **"${userInput}"**: Bogotá Metro Line 1 currently records an **82.33% physical progress**, spanning a 23.9 km dedicated elevated viaduct with 16 stations (10 integrated with TransMilenio) and 30 automatic GoA4 driverless trains (capacity of 1,800 passengers per train, up to 72,000 pphpd).

You can ask me about passenger capacity, stations by locality (Kennedy, Bosa, Caracas), Patio Taller location, transfers, fares, or journey times:

👉 [🗺️ Open Interactive Route Map](#action_map)

[SUGERENCIAS]
- 👥 What is the passenger capacity and volume?
- 📍 Which stations are located in Kennedy?
- 📍 Where is the Patio Taller located?
- ⏱️ Travel time from Kennedy to Downtown?`, effectiveLang);
  }

  if (effectiveLang === 'PT') {
    return ensureSuggestionsBlock(`Sobre sua dúvida **"${userInput}"**: a Primeira Linha do Metrô de Bogotá registra um **avanço físico geral de 82.33%**, compreendendo 23.9 km de viaduto elevado com 16 estações (10 integradas com TransMilenio) e frota de trens 100% automáticos (GoA4) com capacidade para 1.800 passageiros por composição (até 72.000 passageiros/hora/sentido).

Você pode me perguntar sobre capacidade e lotação, estações por localidade (Kennedy, Bosa, Caracas), Pátio Taller, baldeações, tarifas ou tempos de viagem:

👉 [🗺️ Ver estações no Mapa Interativo](#action_map)

[SUGERENCIAS]
- 👥 Qual é a capacidade e lotação de passageiros?
- 📍 Quais estações ficam em Kennedy?
- 📍 Onde fica o Pátio Taller?
- ⏱️ Quanto tempo leva de Kennedy ao Centro?`, effectiveLang);
  }

  return ensureSuggestionsBlock(`Con respecto a tu consulta sobre **"${userInput}"**: la Primera Línea del Metro de Bogotá registra un **avance físico general del 82.33%** (dato oficial EMB 2026), comprende 23.9 km de viaducto continuo elevado con 16 estaciones (10 integradas con TransMilenio) y una flota de trenes de 6 vagones 100% automáticos (GoA4) con capacidad de 1.800 pasajeros por tren y hasta 72.000 pasajeros/hora/sentido.

Puedes consultarme sobre aforo de personas, estaciones por localidad (Kennedy, Bosa, Caracas), ubicación del Patio Taller, trasbordos con TransMilenio, tarifas o tiempos de viaje:

👉 [🗺️ Ver estas estaciones en el Mapa Interactivo](#action_map)

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?
- 📍 ¿Dónde queda el Patio Taller?
- ⏱️ ¿Cuánto tiempo tomará ir desde Bosa/Kennedy al Centro?`, effectiveLang);
}