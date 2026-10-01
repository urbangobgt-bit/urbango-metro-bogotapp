import { 
  METRO_SYSTEM_KNOWLEDGE, 
  NOTICIAS_KB, 
  EMPLEOS_KB,
  BOGOTA_LOCALIDADES_KB,
  BOGOTA_CENTROS_COMERCIALES_KB,
  BOGOTA_PARQUES_RECREACION_KB,
  BOGOTA_UNIVERSIDADES_EMPRESAS_KB
} from '../data/metroKnowledge.js';

/**
 * ============================================================================
 * METROBOT IA - ASISTENTE INTEGRAL DE MOVILIDAD Y GEOGRAFÍA URBANA DE BOGOTÁ
 * ============================================================================
 * Asistente oficial inteligente de movilidad de Bogotá en UrbanGo y la Empresa
 * Metro de Bogotá (EMB).
 *
 * Misión: Responder ABSOLUTAMENTE CUALQUIER PREGUNTA sobre la ciudad de Bogotá,
 * sus 20 localidades, centros comerciales, parques, universidades, empresas,
 * barrios, rutas origen-destino (SITP / TransMilenio / Metro), noticias,
 * estado de avance de obra (82.33%) y convocatorias de empleo.
 *
 * NUNCA se niega a responder sobre la ciudad, sus lugares, noticias u obras.
 */

export const METROBOT_SYSTEM_INSTRUCTION = `
Eres "MetroBot IA", el asistente inteligente oficial de movilidad y geografía urbana de Bogotá en la plataforma UrbanGo y la Empresa Metro de Bogotá (EMB).

### 1. ROL Y TONO:
- Eres amable, cercano, altamente servicial, pedagógico y experto absoluto en la geografía, historia, noticias y transporte de Bogotá.
- NUNCA te niegues a responder una pregunta sobre la ciudad, sus lugares, noticias, rutas u obras.
- Si el usuario pregunta algo general sobre Bogotá o el transporte, responde con datos útiles y precisos sin poner restricciones ni dar mensajes de error como "solo puedo responder sobre X tema".

### 2. COBERTURA TOTAL DE LUGARES Y PUNTOS DE INTERÉS (POIs DE BOGOTÁ):
- TODAS LAS 20 LOCALIDADES: Fontibón, Suba, Kennedy, Engativá, Chapinero, Bosa, Usaquén, Teusaquillo, San Cristóbal, Ciudad Bolívar, Tunjuelito, Los Mártires, Santa Fe, Antonio Nariño, Puente Aranda, La Candelaria, Rafael Uribe Uribe, Usme, Barrios Unidos y Sumapaz.
- CENTROS COMERCIALES: Multiplaza (Av. Boyacá con Cll 13), Centro Mayor (Autopista Sur con NQS), Unicentro (Cra 15 con Cll 127), Plaza Central (Cll 13 con Cra 65), Gran Estación (Cll 26 con Cra 60), Titán Plaza (Boyacá con Cll 80), Santafé (AutoNorte Cll 185), Calima / Mallplaza (NQS con Cll 19), Hayuelos (Cll 20 con Av. Cali), Parque La Colina (Boyacá Cll 146), Andino, El Retiro, Atlantis (Zona T), Centro Suba, Salitre Plaza, Galerías, Portal 80, Diverplaza, Paseo Villa del Río, Metrópolis, etc.
- PARQUES Y RECREACIÓN: Parque Metropolitano Simón Bolívar, Parque El Tunal, Parque Timiza, Parque de los Novios (El Lago), Parque Nacional Olaya Herrera, Parque La Florida, Jardín Botánico, Cerro de Monserrate, Cerro de Guadalupe, Parque El Renacimiento, Parque de la 93, Virrey, etc.
- EMPRESAS, ENTIDADES Y UNIVERSIDADES: Corferias, Movistar Arena, Estadio Nemesio Camacho El Campín, Zona Franca de Bogotá, Centro Internacional, Universidad Nacional de Colombia (UNAL), Pontificia Universidad Javeriana, Universidad de los Andes, Universidad del Rosario, Universidad Distrital, Fundación Universitaria San Martín, Complejo Empresarial Connecta (Calle 26), Terminal Salitre, Aeropuerto El Dorado, etc.
- BARRIOS Y SECTORES POPULARES: Modelia, Cedritos, Restrepo, Salitre, Quirigua, Bosa Centro, Tintal, Patio Bonito, La Candelaria, 7 de Agosto, Chapinero Alto, 20 de Julio, Castilla, Venecia, Normandía, etc.

### 3. LÓGICA DE RESPUESTA A CONSULTAS DE ORIENTACIÓN Y RUTAS:
- Explica la ruta paso a paso combinando el transporte actual (TransMilenio troncal, alimentadores, SITP zonal y ciclorrutas) e integrándolo con el trazado de la Primera Línea del Metro (PLMB) de Bosa a Calle 72 y la Segunda Línea (L2MB subterránea).
- Ejemplo 1 (Multiplaza): Explica que está en Av. Boyacá con Cll 13 (Fontibón/Kennedy). Conexiones actuales (SITP por Boyacá y Calle 13; TransMilenio Américas/Calle 13) y estaciones del Metro más cercanas (Estaciones 7 y 8 sobre Av. Primero de Mayo / Cra 68 / Cra 50).
- Ejemplo 2 (Fontibón a Centro Mayor): Explica ruta paso a paso en SITP por Calle 13 / Boyacá o TransMilenio hasta estaciones Sevillana o NQS Calle 38 A Sur frente a Centro Mayor. Señala cómo la Estación 9 del Metro (NQS / General Santander) ofrecerá conexión expedita de $0 COP.

### 4. SECCIÓN DE NOTICIAS Y ESTADO DE LA OBRA:
- Responde activamente a consultas sobre noticias, avance de las obras del viaducto (82.33% consolidado oficial), llegada de trenes desde China (CRRC Alstom, 100% eléctricos, GoA4), frentes de obra (Calle 72 intercambiador subterráneo, Av. Primero de Mayo, Patio Taller de Bosa) y convocatorias de empleo.
- Proporciona las noticias más recientes e incluye deep links a las secciones de la app.

### 5. FORMATO OBLIGATORIO:
- Incluye siempre al final el bloque [SUGERENCIAS] con preguntas rápidas útiles.
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

  const ptRegex = /\b(olá|ola|bom dia|boa tarde|estação|estações|trem|trens|vagas|emprego|saldo|obra|quanto|onde|cartão|passagem|recarregar|velocidade|baldeação|capacidade|lotação|passageiros|rota|como chegar|bairro|parque)\b/i;
  if (ptRegex.test(query)) return 'PT';

  const enKeywords = [
    'hello', 'hi', 'hey', 'news', 'job', 'jobs', 'station', 'stations', 'progress',
    'card', 'balance', 'recharge', 'metro', 'schedule', 'route', 'routes', 'work',
    'apply', 'closure', 'closures', 'train', 'trains', 'capacity', 'speed', 'profile',
    'incident', 'report', 'hours', 'opening', 'frequency', 'peak', 'transfer', 'transfers',
    'where', 'kennedy', 'bosa', 'passenger', 'passengers', 'cost', 'line 2', 'builder',
    'how to get', 'direction', 'directions', 'mall', 'park', 'university'
  ];
  const words = query.toLowerCase().split(/\s+/);
  const matchEn = words.filter(w => enKeywords.includes(w)).length;
  if (matchEn >= 2 || (words.length <= 3 && matchEn >= 1)) return 'EN';

  return 'ES';
}

/**
 * Función que asegura que NUNCA se rechace una pregunta sobre Bogotá o transporte.
 * Como asistente integral, el bot responde sobre cualquier tema urbano.
 */
export function isOutOfDomain(query) {
  const q = query.toLowerCase();

  // Preguntas abiertamente destructivas o completamente ajenas a la ciudad (ej. recetas de cocina, física cuántica)
  const strictlyAlienIndicators = [
    'receta de cocina', 'como cocinar arroz', 'cuentame un chiste de pepito',
    'letra de cancion de shakira', 'quien gano el mundial 1970',
    'formula de la relatividad', 'resolver integral indefinida'
  ];

  if (strictlyAlienIndicators.some(o => q.includes(o))) {
    return true;
  }

  // TODO lo demás sobre Bogotá, movilidad, transporte, clima, lugares, es VÁLIDO.
  return false;
}

export function ensureSuggestionsBlock(response, lang) {
  if (response.includes('[SUGERENCIAS]')) return response.trim();

  if (lang === 'JA') {
    return `${response.trim()}

[SUGERENCIAS]
- 📍 ケネディ区の駅はどこ？
- 🗺️ マルティプラザ（Multiplaza）への行き方は？
- 👥 列車の定員と輸送能力はどのくらい？`;
  }

  if (lang === 'ZH') {
    return `${response.trim()}

[SUGERENCIAS]
- 📍 肯尼迪区 (Kennedy) 有哪些车站？
- 🗺️ 如何前往 Multiplaza 购物中心？
- 👥 地铁列车与车站的额定载客量是多少？`;
  }

  if (lang === 'EN') {
    return `${response.trim()}

[SUGERENCIAS]
- 📍 Which stations are located in Kennedy?
- 🗺️ How to get to Multiplaza or Centro Mayor?
- 👥 What is the passenger capacity and volume?`;
  }

  if (lang === 'PT') {
    return `${response.trim()}

[SUGERENCIAS]
- 📍 Quais estações ficam em Kennedy?
- 🗺️ Como chegar a Multiplaza ou Centro Mayor?
- 👥 Qual é a capacidade e lotação de passageiros?`;
  }

  return `${response.trim()}

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- 📍 ¿Qué estaciones quedan cerca de Multiplaza?
- 🗺️ ¿Cómo llego desde Fontibón a Centro Mayor?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?`;
}

/**
 * Motor central de respuestas de MetroBot IA.
 */
export async function getMetroBotResponse(userInput, lang = 'ES', t = (k) => k) {
  if (!userInput || !userInput.trim()) {
    const eff = detectLanguage('', lang);
    if (eff === 'JA') {
      return `こんにちは！私は **MetroBot IA** 🤖、ボゴタ地下鉄1号線（PLMB）および **UrbanGo** の公式都市モビリティ・AIアシスタントです。

ボゴタ市内20区のすべての移動ルート、ショッピングモール（Multiplaza、Centro Mayorなど）、公園、大学、最新ニュース、工事進捗（82.33%）、定員・輸送能力について何でもお尋ねください。

[SUGERENCIAS]
- 👥 列車の定員と輸送能力はどのくらい？
- 📍 ケネディ区の駅はどこ？
- 🗺️ マルティプラザへの行き方は？
- 📍 車両基地 (Patio Taller) はどこにある？`;
    }
    if (eff === 'ZH') {
      return `您好！我是 **MetroBot IA** 🤖，波哥大地铁一号线（PLMB）及 **UrbanGo** 官方全域交通与城市出行AI智能助手。

您可以向我咨询波哥安全市20个行政区的所有换乘出行方案、各大商场（Multiplaza、Centro Mayor等）、公园、大学高校、最新工程进展（82.33%）、列车载客量与招聘机会。

[SUGERENCIAS]
- 👥 地铁列车与车站的额定载客量是多少？
- 📍 肯尼迪区 (Kennedy) 有哪些车站？
- 🗺️ 如何前往 Multiplaza 购物中心？
- 📍 车场 (Patio Taller) 建在哪里？`;
    }
    if (eff === 'PT') {
      return `Olá! Sou o **MetroBot IA** 🤖, o assistente inteligente oficial de mobilidade e geografia urbana de Bogotá no UrbanGo e Metro de Bogotá.

Você pode me perguntar sobre qualquer ponto da cidade, as 20 localidades, shoppings (Multiplaza, Centro Mayor, etc.), parques, universidades, rotas passo a passo, notícias, avanço de obra (82.33%) e capacidade.

[SUGERENCIAS]
- 👥 Qual é a capacidade e lotação de passageiros?
- 📍 Quais estações ficam em Kennedy?
- 🗺️ Como chegar de Fontibón a Centro Mayor?
- 📍 Onde fica o Pátio Taller?`;
    }
    if (eff === 'EN') {
      return `Hello! I am **MetroBot AI** 🤖, the official intelligent mobility and urban geography assistant for Bogotá at UrbanGo and Bogotá Metro.

You can ask me about any of Bogotá's 20 localities, shopping malls (Multiplaza, Centro Mayor, Unicentro), parks, universities, step-by-step transit routes, official news, construction progress (82.33%), and passenger capacity.

[SUGERENCIAS]
- 👥 What is the passenger capacity and volume?
- 📍 Which stations are located in Kennedy?
- 🗺️ How do I get from Fontibón to Centro Mayor?
- 📍 Where is the Patio Taller located?`;
    }
    return `¡Hola! Soy **MetroBot IA** 🤖, tu asistente inteligente oficial de movilidad y geografía urbana de Bogotá en UrbanGo y la Empresa Metro de Bogotá (EMB).

Conozco toda la ciudad: sus 20 localidades, centros comerciales (Multiplaza, Centro Mayor, Unicentro, Titán Plaza), parques, universidades, barrios, rutas paso a paso (SITP / TransMilenio / Metro), noticias, obras al 82.33% y aforo de personas. ¡Pregúntame lo que necesites!

[SUGERENCIAS]
- 👥 ¿Cuál es el aforo y capacidad de personas?
- 📍 ¿Qué estaciones quedan cerca de Multiplaza?
- 🗺️ ¿Cómo llego desde Fontibón a Centro Mayor?
- 📍 ¿Cuáles estaciones me quedan cerca de Kennedy?`;
  }

  const query = userInput.trim().toLowerCase();
  const effectiveLang = detectLanguage(query, lang);

  // 1. REQUERIMIENTO ESPECÍFICO: MULTIPLAZA / ESTACIONES CERCA DE MULTIPLAZA
  if (query.includes('multiplaza') || (query.includes('estacion') && query.includes('multiplaza')) || (query.includes('estaciones') && query.includes('multiplaza'))) {
    if (effectiveLang === 'EN') {
      return ensureSuggestionsBlock(`📍 **Multiplaza La Felicidad Shopping Mall & Bogotá Metro Connections**

* **Location:** Located on **Avenida Boyacá # 13-05** (interchange of Avenida Boyacá with Calle 13 / Av. Centenario), bordering the localities of **Fontibón** and **Kennedy**.
* **Current Transit Connections:**
  - **SITP:** Direct zonal bus routes along Avenida Boyacá and Calle 13 connecting north and south.
  - **TransMilenio:** Troncal Américas (Banderas and Mandalay stations ~8 min via feeder) and Troncal Calle 26 (Normandía and Modelia).
* **Bogotá Metro Line 1 Stations:**
  - **Station 7 (Plaza de Las Américas / Cra 68)** and **Station 8 (SENA / Carrera 50)** on Avenida Primero de Mayo are the closest operational access points, reachable in 8-10 minutes via SITP down Avenida Boyacá.
  - Furthermore, the future Avenida Boyacá feeder corridor and Metro Line 2 will directly connect this bustling commercial hub.

[🗺️ View Stations on Interactive Map](#action_map)`, effectiveLang);
    }
    return ensureSuggestionsBlock(`📍 **Centro Comercial Multiplaza La Felicidad y Conexiones con el Metro**

* **Ubicación Exacta:** El C.C. Multiplaza está ubicado en la **Avenida Boyacá # 13-05** (intersección estratégica de la Av. Boyacá con Calle 13 / Av. Centenario), en el límite entre las localidades de **Fontibón** y **Kennedy**.
* **Conexiones Actuales de Transporte:**
  - **SITP Zonal:** Múltiples rutas sobre la Av. Boyacá (conectando con Suba, Engativá, Kennedy y Tunjuelito) y sobre la Calle 13 hacia Puente Aranda y el Centro.
  - **TransMilenio:** Estaciones **Banderas** y **Mandalay** (Troncal Américas) a 7-8 minutos en bus alimentador, o Troncal Calle 26 (estaciones Normandía / Modelia).
* **Estaciones de la Primera Línea del Metro más Cercanas:**
  - **Estación 7 (Plaza de Las Américas / Av. 68)** y **Estación 8 (SENA / Carrera 50)** sobre la Av. Primero de Mayo. Llegar desde Multiplaza toma solo **8 a 10 minutos** tomando cualquier SITP zonal hacia el sur por la Boyacá.
  - Además, la **Estación 6 (Avenida Primero de Mayo con Boyacá)** conectará de manera directa a los usuarios que se desplazan sobre el corredor de la Boyacá.
  - En el mediano plazo, la futura Troncal de la Av. Boyacá y la Línea 2 del Metro brindarán interconexión masiva de $0 COP trasbordo.

[🗺️ Ver estas estaciones en el Mapa Interactivo](#action_map)`, effectiveLang);
  }

  // 2. REQUERIMIENTO ESPECÍFICO: RUTA FONTIBÓN A CENTRO MAYOR
  if ((query.includes('fontibon') || query.includes('fontibón')) && (query.includes('centro mayor') || query.includes('centromayor'))) {
    if (effectiveLang === 'EN') {
      return ensureSuggestionsBlock(`🗺️ **Step-by-Step Route: From Fontibón to Centro Mayor Shopping Mall**

1. **Option 1 (TransMilenio Express):**
   - From Fontibón, head to **Troncal Calle 26** (Portal El Dorado or Modelia station) or take a feeder to **Troncal Américas** (Portal Américas / Banderas).
   - Take a trunk bus towards NQS or Carrera 30, transferring to the southern NQS line (service G43 or similar).
   - Get off directly at **General Santander**, **NQS Calle 38 A Sur** or **Sevillana** stations, which have direct pedestrian access into Centro Mayor.
2. **Option 2 (SITP Zonal Direct):**
   - Board SITP along Calle 13 or Av. Boyacá heading south towards Autopista Sur / Cra 30.
3. **The Bogotá Metro Line 1 Advantage:**
   - The Metro viaduct will connect southwest Bogotá (Bosa/Kennedy/Puente Aranda) with **Station 9 (NQS / General Santander)**, located directly adjacent to Centro Mayor, allowing a seamless 27-minute trip across the city with a $0 COP transfer!

[🗺️ Open Route on Interactive Map](#action_map)`, effectiveLang);
    }
    return ensureSuggestionsBlock(`🗺️ **Ruta Paso a Paso: Desde Fontibón hasta el Centro Comercial Centro Mayor**

* **Destino:** Centro Comercial Centro Mayor (Autopista Sur con Carrera 30 / NQS, sector Villa Mayor).

**Paso a Paso en Transporte Actual (SITP / TransMilenio):**
1. **Opción Rápida TransMilenio (Recomendada):**
   - Desde Fontibón (Casco central o Modelia), toma un alimentador o bus dual hacia el **Portal El Dorado** o estación **Modelia** (Troncal Calle 26), o hacia la Troncal Américas (**Portal Américas / Banderas**).
   - Toma el servicio troncal hacia el oriente y realiza un trasbordo ágil en el intercambiador de la **NQS (Carrera 30)** hacia el sur (servicios ruta G).
   - Desciende en las estaciones **General Santander**, **NQS Calle 38 A Sur** o **Sevillana**, las cuales cuentan con pasarela peatonal de acceso directo a Centro Mayor.
2. **Opción Directa en SITP Zonal:**
   - Aborda las rutas zonales del SITP que toman la Calle 13 o la Av. Boyacá hacia el sur, empalmando con la Av. Primero de Mayo o Autopista Sur hasta el barrio Villa Mayor.

**¿Cómo facilitará este viaje la Primera Línea del Metro?**
- El viaducto de la Línea 1 atraviesa el suroccidente por la Av. Primero de Mayo hasta la **Estación 9 (NQS / General Santander)**, situada a escasos metros de Centro Mayor. Podrás abordar el Metro en Kennedy o Puente Aranda y llegar en menos de 10 minutos con trasbordo integrado de **$0 COP** con tu tarjeta TuLlave.

[🗺️ Ver Estación 9 General Santander en el Mapa](#action_map)`, effectiveLang);
  }

  // 3. CONSULTAS DE ORIENTACIÓN GENERALES ("CÓMO LLEGO", "CÓMO IR", "RUTA DE X A Y")
  const isRoutingQuery = 
    query.includes('como llego') || query.includes('cómo llego') || 
    query.includes('como ir') || query.includes('cómo ir') || 
    query.includes('como voy') || query.includes('cómo voy') ||
    query.includes('ruta') || query.includes('trayecto') || 
    query.includes('llegar a') || query.includes('como llegar') ||
    query.includes('cómo llegar');

  if (isRoutingQuery) {
    // Detectar destinos comunes
    if (query.includes('centro mayor')) {
      return ensureSuggestionsBlock(`🗺️ **Cómo llegar a Centro Comercial Centro Mayor**

* **Ubicación:** Autopista Sur con Av. NQS (Carrera 30) y Calle 38A Sur.
* **En TransMilenio:** Llega directamente a las estaciones **General Santander** o **NQS Calle 38 A Sur** (Troncal NQS Sur).
* **En SITP:** Rutas por la Autopista Sur, Av. General Santander o Av. Jorge Gaitán Cortés.
* **Con el Metro de Bogotá:** La **Estación 9 (NQS / General Santander)** de la Línea 1 te dejará a escasos pasos con integración peatonal y tarifaria de $0 COP.

[🗺️ Ver Estación 9 en el Mapa](#action_map)`, effectiveLang);
    }

    if (query.includes('unicentro')) {
      return ensureSuggestionsBlock(`🗺️ **Cómo llegar a Centro Comercial Unicentro**

* **Ubicación:** Avenida Carrera 15 # 124-30 (Usaquén).
* **En TransMilenio:** Toma la Troncal AutoNorte hasta la estación **Pepe Sierra** o **Calle 127** y camina 10 minutos por la Calle 127 o aborda SITP zonal.
* **En SITP:** Múltiples rutas por la Carrera 15, Carrera Séptima y Calle 127.
* **Con el Metro:** Desde el sur o suroccidente, toma la Línea 1 hasta la Estación 15 o 16 (Calle 72) y continúa al norte por la Troncal Norte o futura extensión Calle 100.

[🗺️ Ver Mapa Interactivo](#action_map)`, effectiveLang);
    }

    if (query.includes('simon bolivar') || query.includes('simón bolívar')) {
      return ensureSuggestionsBlock(`🗺️ **Cómo llegar al Parque Metropolitano Simón Bolívar**

* **Ubicación:** Entre la Calle 53 y Calle 63, con Carreras 60 (Av. Esmeralda) y 68 (Teusaquillo).
* **En TransMilenio:** Estación **Simón Bolívar** (Troncal NQS) o estación **Salitre - El Greco** (Troncal Calle 26).
* **En SITP:** Rutas por la Calle 53, Calle 63 y Av. Carrera 68.
* **Con el Metro:** Desciende en la **Estación 13 (Calle 45 / UNAL)** o **Estación 14 (Calle 63)** de la Línea 1 y toma SITP directo hacia el occidente por la Calle 53 o 63.

[🗺️ Ver Estación 13 y 14 en el Mapa](#action_map)`, effectiveLang);
    }

    if (query.includes('corferias')) {
      return ensureSuggestionsBlock(`🗺️ **Cómo llegar a Corferias**

* **Ubicación:** Carrera 37 # 24-67 (barrio Quinta Paredes, Teusaquillo).
* **En TransMilenio:** Estación **Corferias** (Troncal de Las Américas) o estación **Ciudad Universitaria / Recinto Ferial** (Calle 26).
* **Con el Metro:** Desde la **Estación 12 (Calle 26 / Centro Internacional)** de la Línea 1, tomas TransMilenio troncal directo hacia el occidente por la Calle 26 en solo 5 minutos.

[🗺️ Ver Estación 12 en el Mapa](#action_map)`, effectiveLang);
    }

    if (query.includes('campin') || query.includes('campín') || query.includes('movistar arena')) {
      return ensureSuggestionsBlock(`🗺️ **Cómo llegar al Movistar Arena y Estadio El Campín**

* **Ubicación:** Av. NQS (Carrera 30) con Calle 57 (Teusaquillo).
* **En TransMilenio:** Estaciones **Movistar Arena** y **Campín - UAN** (Troncal NQS).
* **Con el Metro:** Desciende en la **Estación 13 (Calle 45 / UNAL)** o **Estación 14 (Calle 63)** de la Línea 1 y conecta por la Calle 53 o 63 hacia la NQS en 6 minutos.

[🗺️ Ver Estaciones en el Mapa](#action_map)`, effectiveLang);
    }

    if (query.includes('monserrate')) {
      return ensureSuggestionsBlock(`🗺️ **Cómo llegar al Cerro de Monserrate**

* **Ubicación:** Cerros Orientales de Bogotá, estación del Funicular y Teleférico en el Paseo de Bolívar (Cra 2 Este).
* **En TransMilenio:** Llega a las estaciones **Las Aguas** o **Universidades** (Eje Ambiental) y camina 10 minutos por el sendero hacia la taquilla.
* **Con el Metro:** Desciende en la **Estación 12 (Calle 26 / Centro Internacional)** de la Línea 1 y conecta rápidamente hacia el oriente de la ciudad.

[🗺️ Ver Estación 12 en el Mapa](#action_map)`, effectiveLang);
    }

    // Ruta genérica inteligente guiada por origen y destino
    return ensureSuggestionsBlock(`🗺️ **Guía Integral de Rutas y Movilidad en Bogotá**

Para moverte desde cualquier punto de la ciudad hacia tu destino:
1. **Red Troncal TransMilenio:** Conecta las troncales Caracas, NQS, Américas, Calle 26, Calle 80, Suba y AutoNorte.
2. **Red de Alimentadores y SITP Zonal:** Permiten trasbordo integrado con la tarjeta TuLlave dentro de la ventana de **110 minutos** con costo de **$0 COP**.
3. **Primera Línea del Metro de Bogotá (L1MB):**
   - Recorre 23.9 km desde el **Patio Taller de Bosa** hasta la **Calle 72** en tan solo **27 minutos**.
   - Integra directamente con 10 estaciones troncales de TransMilenio (Portal Américas, Av. 68, NQS, Calle 1 Sur, Restrepo, Calle 26 y Calle 72).
4. **Futura Línea 2 del Metro:** Conectará subterráneamente desde la Calle 72 pasando por Engativá hasta Suba (Fontanar del Río).

Dime exactamente desde qué barrio o punto sales y a qué destino vas para darte la ruta más rápida y económica.

[🗺️ Explorar Mapa Interactivo de Estaciones](#action_map)`, effectiveLang);
  }

  // 4. CONSULTAS DE NOTICIAS, NOVEDADES Y ESTADO DE LA OBRA
  const isNoticiasQuery = 
    query.includes('noticia') || query.includes('noticias') || 
    query.includes('novedad') || query.includes('novedades') ||
    query.includes('que hay de nuevo') || query.includes('qué hay de nuevo') ||
    query.includes('avances') || query.includes('llegada de tren') ||
    query.includes('trenes de china') || query.includes('vigas lanzadoras') ||
    query.includes('estado de obra') || query.includes('como va la obra');

  if (isNoticiasQuery) {
    if (effectiveLang === 'EN') {
      return ensureSuggestionsBlock(`📰 **Official Bogotá Metro Line 1 News & Work Status (82.33%)**

* **General Physical Progress:** Certified at **82.33%** by Empresa Metro de Bogotá (EMB).
* **Active Work Fronts:**
  - **Bosa Yard & Workshop:** Over 91% completed, housing dynamic test tracks and Substation SET-1.
  - **Calle 72 Underpass:** Roadway underpass open to mixed traffic, structural progress exceeds 93%.
  - **Elevated Viaduct:** More than 14 km of viaduct structures erected using 6 motorized launching girders.
* **Rolling Stock:** CRRC Alstom 100% electric, 6-car GoA4 driverless trains undergoing rigorous dynamic factory testing in Changchun, China, ready for shipment and 2026 test-track runs in Bosa.
* **Employment:** Active recruitment for construction auxiliaries, inspectors, and entry-level positions.

[📰 View Full News & Press Releases](#open_content_news)
[🚧 Open Live Construction Tracker](#open_project_status)`, effectiveLang);
    }

    return ensureSuggestionsBlock(`📰 **Boletín de Noticias Oficiales y Estado de Avance del Metro (82.33%)**

* **Avance Físico Consolidado:** La Empresa Metro de Bogotá (EMB) y la Alcaldía Mayor certifican un avance físico general del **82.33%** en la Primera Línea del Metro (PLMB).
* **Hitos Recientes y Frentes Activos:**
  1. **Viaducto Industrializado:** Más de **14 kilómetros de viaducto** ya construidos e interconectados mediante el trabajo continuo de 6 vigas lanzadoras sobre Bosa, Av. Primero de Mayo y la Av. Caracas.
  2. **Intercambiador de la Calle 72:** El paso a desnivel vehicular subterráneo opera con normalidad y el avance supera el **93%**, preparando la estación terminal e integración con la futura Línea 2 a Suba.
  3. **Llegada y Ensamble de Trenes:** Los trenes automáticos de 6 vagones (fabricados por CRRC Changchun y Alstom) avanzan en pruebas dinámicas de rodaje. La flota completa de 30 trenes 100% eléctricos operará sin conductor (GoA4).
  4. **Patio Taller de Bosa:** Centro neurálgico de 32 hectáreas completado en más del **91%**, listo para las pruebas de vía con el Tren 2 en 2026.
* **Convocatorias de Empleo:** Hay vacantes vigentes con y sin experiencia para auxiliares de obra, soldadores, electromecánicos e ingenieros SST.

[📰 Ver Sección de Noticias Oficiales](#open_content_news)
[🚧 Ver Monitor de Obras en Tiempo Real](#open_project_status)`, effectiveLang);
  }

  // 5. CENTROS COMERCIALES Y ENTIDADES RECONOCIDAS
  for (const [key, mall] of Object.entries(BOGOTA_CENTROS_COMERCIALES_KB)) {
    if (query.includes(key) || query.includes(mall.nombre.toLowerCase())) {
      return ensureSuggestionsBlock(`🛍️ **${mall.nombre}**

* **Dirección y Localidad:** ${mall.direccion} (${mall.localidad}).
* **Conexiones de Transporte Actual:** ${mall.transporteActual}
* **Conexión con el Metro de Bogotá:** ${mall.conexionMetro}
* **Consejo de Movilidad:** ${mall.consejoRuta}

[🗺️ Ver Estaciones Cercanas en el Mapa](#action_map)`, effectiveLang);
    }
  }

  // 6. PARQUES Y RECREACIÓN
  for (const [key, park] of Object.entries(BOGOTA_PARQUES_RECREACION_KB)) {
    if (query.includes(key) || query.includes(park.nombre.toLowerCase())) {
      return ensureSuggestionsBlock(`🌳 **${park.nombre}**

* **Dirección:** ${park.direccion} (${park.localidad}).
* **Transporte Actual:** ${park.transporteActual}
* **Conexión con el Metro:** ${park.conexionMetro}
* **Ruta Sugerida:** ${park.consejoRuta}

[🗺️ Ver en el Mapa Interactivo](#action_map)`, effectiveLang);
    }
  }

  // 7. UNIVERSIDADES Y EMPRESAS
  for (const [key, entity] of Object.entries(BOGOTA_UNIVERSIDADES_EMPRESAS_KB)) {
    if (query.includes(key) || query.includes(entity.nombre.toLowerCase())) {
      return ensureSuggestionsBlock(`🎓 **${entity.nombre}**

* **Ubicación:** ${entity.direccion} (${entity.localidad}).
* **Transporte Actual:** ${entity.transporteActual}
* **Conexión con el Metro:** ${entity.conexionMetro}
* **Ruta de Acceso:** ${entity.consejoRuta}

[🗺️ Ver Estaciones Cercanas en el Mapa](#action_map)`, effectiveLang);
    }
  }

  // 8. LAS 20 LOCALIDADES DE BOGOTÁ
  for (const [key, loc] of Object.entries(BOGOTA_LOCALIDADES_KB)) {
    if (query.includes(key) || query.includes(loc.nombre.toLowerCase().split(' ')[0])) {
      return ensureSuggestionsBlock(`📍 **Información de Movilidad: ${loc.nombre}**

* **Ubicación en Bogotá:** ${loc.ubicacion}.
* **Corredores Viales Principales:** ${loc.corredoresPrincipales}.
* **Red TransMilenio Actual:** ${loc.transmilenio}.
* **Integración con la Red Metro:** ${loc.conexionMetro}.
* **Puntos de Interés Emblemáticos:** ${loc.hitos.join(', ')}.

[🗺️ Explorar Estaciones en el Mapa](#action_map)`, effectiveLang);
    }
  }

  // 9. BARRIOS Y SECTORES POPULARES DE BOGOTÁ
  const barriosBogota = [
    { name: 'Modelia', loc: 'Fontibón', transport: 'Av. Esperanza y Troncal Cll 26 (estación Modelia). Enlace con Estación 12 del Metro.' },
    { name: 'Cedritos', loc: 'Usaquén', transport: 'Calle 140, Carrera 19 y Carrera 9na. Troncal AutoNorte (estación Alcalá / Cll 142).' },
    { name: 'Restrepo', loc: 'Antonio Nariño', transport: 'Alberga la Estación 11 (Restrepo / Calle 10 Sur) de la Línea 1 del Metro sobre la Av. Caracas.' },
    { name: 'Salitre', loc: 'Teusaquillo / Fontibón', transport: 'Av. La Esperanza y Av. Calle 26. TransMilenio estación Salitre el Greco y Gran Estación.' },
    { name: 'Quirigua', loc: 'Engativá', transport: 'Calle 80 y Calle 72. Estación Quirigua de TransMilenio y futura Línea 2 del Metro.' },
    { name: 'Bosa Centro', loc: 'Bosa', transport: 'Av. San Bernardino y Av. Bosa. Conectado a la Estación 1 (Patio Taller) y Estación 2 (Gibraltar).' },
    { name: 'Tintal', loc: 'Kennedy', transport: 'Av. Ciudad de Cali con Av. Américas. Estación Biblioteca Tintal y conexión a Estación 2 y 3 del Metro.' },
    { name: 'Patio Bonito', loc: 'Kennedy', transport: 'Av. Ciudad de Cali. Conexión directa al Portal Américas y Estación 3 del Metro de Bogotá.' },
    { name: 'La Candelaria', loc: 'La Candelaria', transport: 'Eje Ambiental, Cra 7ma y Cra 10ma. A 5 min a pie de las Estaciones 11 y 12 del Metro.' },
    { name: '7 de Agosto', loc: 'Barrios Unidos', transport: 'Calle 68 y Calle 72 con Carrera 24. A pocos metros de la Estación 16 (Calle 72 Norte).' },
    { name: 'Chapinero Alto', loc: 'Chapinero', transport: 'Carrera 7ma y Circunvalar. Acceso rápido desde las Estaciones 13, 14 y 15 del Metro.' },
    { name: '20 de Julio', loc: 'San Cristóbal', transport: 'Portal 20 de Julio (Troncal Décima). Enlace con Estación 10 (Hortúa) de la Línea 1.' }
  ];

  for (const b of barriosBogota) {
    if (query.includes(b.name.toLowerCase())) {
      return ensureSuggestionsBlock(`🏘️ **Sector / Barrio: ${b.name} (${b.loc})**

* **Conectividad de Transporte:** ${b.transport}
* **Integración Metropolitana:** Los corredores troncales y zonales del SITP alimentan directamente las estaciones elevadas de la Primera Línea del Metro de Bogotá y la futura Línea 2 subterránea.

[🗺️ Ver Mapa Interactivo](#action_map)`, effectiveLang);
    }
  }

  // 10. PREGUNTA ESPECÍFICA: AFORO Y CAPACIDAD DE PERSONAS
  const isAforoQuery = 
    query.includes('aforo') || 
    query.includes('capacidad') || 
    query.includes('cuantas personas') || 
    query.includes('cuántas personas') || 
    query.includes('cuanta gente') || 
    query.includes('cuánta gente') || 
    query.includes('caben') || 
    query.includes('cuantos caben') || 
    query.includes('cuántos caben') || 
    query.includes('pasajeros por hora') || 
    query.includes('pasajeros por dia') || 
    query.includes('pasajeros por día') || 
    query.includes('demanda') || 
    query.includes('volumen de pasajeros') ||
    query.includes('capacity') ||
    query.includes('lotação') ||
    query.includes('定員') ||
    query.includes('载客量');

  if (isAforoQuery) {
    if (effectiveLang === 'EN') {
      return ensureSuggestionsBlock(`👥 **Official Bogotá Metro Line 1 Passenger Capacity & Volume**

* **Per Train Capacity:**
  - **1,800 passengers** nominal capacity per 6-car train (300 passengers per car).
  - Up to **2,000 passengers** per train during peak rush-hour crush load (6 passengers/m²).
* **System Capacity per Hour per Direction (pphpd):**
  - **72,000 passengers/hour/direction** at full planned capacity.
  - **36,000 to 43,000 passengers/hour/direction** in the initial commercial rollout.
* **Daily Ridership Projection:**
  - **Over 1,000,000 passengers per day** in full operation (~720,000/day during startup).
* **Station Safety & Evacuation:**
  - 145-meter platform screen doors (PSD) and lobbies capable of evacuating **40,000 to 50,000 passengers/hour** at major intermodal hubs.
* **Train Fleet:** 30 driverless GoA4 trains running every 2 to 3 minutes in peak hours.

[🗺️ View Stations on the Interactive Map](#action_map)`, effectiveLang);
    }

    return ensureSuggestionsBlock(`👥 **Aforo y Capacidad Oficial de Pasajeros de la Primera Línea del Metro (PLMB)**

* **Aforo por Tren:**
  - **1.800 pasajeros por tren** de 6 vagones en condiciones de confort nominal (300 pasajeros por vagón a 4 personas/m²).
  - Hasta **2.000 pasajeros por tren** en hora pico de máxima densidad (6 personas/m²).
  - Cada tren mide 145 metros de largo y 2.90 metros de ancho, con 24 puertas dobles para desembarque en 20-30 segundos.
* **Capacidad por Hora y Sentido:**
  - **72.000 pasajeros por hora y sentido (p/h/s)** en su etapa de máxima demanda.
  - En la fase inicial moverá entre **36.000 y 43.000 p/h/s** con intervalos de 2 a 3 minutos.
* **Aforo y Demanda Diaria:**
  - Diseñado para transportar **más de 1.000.000 de pasajeros al día** (iniciando con ~720.000 viajes/día).
* **Evacuación y Andenes:**
  - Andenes de 145 metros con Puertas de Pantalla de Andén (PSD) sincronizadas. Vestíbulos diseñados para evacuar más de **40.000 a 50.000 usuarios por hora** en estaciones de gran transferencia (Portal Américas, Calle 26, Calle 72).
* **Flota:** 30 trenes 100% eléctricos de conducción automática sin conductor (GoA4).

[🗺️ Ver estas estaciones en el Mapa Interactivo](#action_map)`, effectiveLang);
  }

  // 11. PATIO TALLER
  if (query.includes('patio taller') || query.includes('patiotaller') || query.includes('cochera')) {
    return ensureSuggestionsBlock(`📍 **Patio Taller de Bosa (El Porvenir)**

* **Ubicación:** Sector de El Porvenir, localidad de Bosa (Carrera 96 con Calle 49 Sur).
* **Superficie:** 32 hectáreas (equivalente a 50 canchas de fútbol profesional).
* **Capacidad:** Cocheras para albergar, lavar y mantener hasta **60 trenes** del Metro de Bogotá.
* **Avance Físico:** Supera el **91% de ejecución**. Cuenta con subestación eléctrica propia (SET-1) y vías de prueba dinámica.
* **Conexión:** Es el punto de inicio de la Línea 1 (Estación 1 - Patio Taller).

[🗺️ Ver Patio Taller en el Mapa Interactivo](#action_map)`, effectiveLang);
  }

  // 12. TIEMPO DE VIAJE
  if (query.includes('tiempo') || query.includes('cuanto demora') || query.includes('cuánto demora') || query.includes('duracion') || query.includes('duración')) {
    return ensureSuggestionsBlock(`⏱️ **Tiempos de Viaje y Ahorro en la Primera Línea del Metro**

* **Recorrido Completo (Bosa a Calle 72):** Solo **27 minutos** para recorrer los 23.9 kilómetros.
* **Ahorro Ciudadano:** Los usuarios que hoy tardan entre 1 hora y 45 minutos y 2 horas desde Bosa o Kennedy hasta Chapinero ahorrarán hasta **77 minutos por trayecto** (cerca de 3 horas diarias ida y vuelta).
* **Velocidad:** Velocidad comercial promedio de **43 km/h** (velocidad máxima de diseño 80 km/h).

[🗺️ Calcular tu ruta en el Mapa Interactivo](#action_map)`, effectiveLang);
  }

  // 13. TARIFAS Y MEDIOS DE PAGO
  if (query.includes('tarifa') || query.includes('precio') || query.includes('costo pasaje') || query.includes('cuanto vale') || query.includes('cuánto vale') || query.includes('pagar') || query.includes('tullave') || query.includes('tarjeta')) {
    return ensureSuggestionsBlock(`💳 **Tarifas y Medios de Pago del Metro de Bogotá**

* **Tarifa Unificada:** Totalmente integrada al Sistema Integrado de Transporte Público (SITP) de Bogotá ($2.950 - $3.150 COP proyectado).
* **Ventana de Trasbordo de $0 COP:** Tienes **110 minutos** para hacer trasbordo entre TransMilenio, buses zonales del SITP y el Metro sin costo adicional con tu tarjeta personalizada.
* **Medios de Pago Aceptados:**
  - Tarjeta física y digital **TuLlave / TuTarjetaMetro**.
  - Tarjetas de débito y crédito bancarias sin contacto (Contactless EMV).
  - Códigos QR desde billeteras digitales (**Nequi, Daviplata, Dale**).
  - Recargas automáticas por PSE directamente desde la app UrbanGo.

[💳 Gestionar saldo en TuTarjetaMetro](#action_recharge)`, effectiveLang);
  }

  // 14. LÍNEA 2 DEL METRO (SUBA Y ENGATIVÁ)
  if (query.includes('linea 2') || query.includes('línea 2') || query.includes('suba') || query.includes('segunda linea')) {
    return ensureSuggestionsBlock(`🚇 **Segunda Línea del Metro de Bogotá (L2MB - Suba y Engativá)**

* **Trazado y Longitud:** **15.5 kilómetros** (14.5 km subterráneos), conectando desde el intercambiador de la **Calle 72 con Caracas** hasta Fontanar del Río en Suba.
* **Estaciones:** 11 estaciones (10 subterráneas y 1 elevada).
* **Beneficiarios:** Más de **2.5 millones de personas** en Chapinero, Barrios Unidos, Engativá y Suba.
* **Integración Modal:** Conexión subterránea directa con la Estación 15 de la Línea 1 en Calle 72.
* **Inversión:** Aprox. **$35 billones COP**, cofinanciado 70% Nación y 30% Distrito.

[🗺️ Ver Trazado Línea 2 en el Mapa](#action_map)`, effectiveLang);
  }

  // 15. FINANCIACIÓN Y CONCESIÓN
  if (query.includes('financia') || query.includes('inversion') || query.includes('inversión') || query.includes('banco mundial') || query.includes('bid') || query.includes('concesionario') || query.includes('quien construye') || query.includes('quién construye') || query.includes('crrc')) {
    return ensureSuggestionsBlock(`💼 **Financiación, Concesionario y Fabricación del Metro**

* **Inversión Total:** **$16.27 billones COP** para obras de infraestructura (más de $22.3 billones para el contrato integral a 20 años).
* **Cofinanciación:** **70% Nación** (Gobierno de Colombia) y **30% Distrito Capital** (Alcaldía Mayor de Bogotá), con créditos de banca multilateral (Banco Mundial BIRF, BID, BEI y CAF).
* **Concesionario:** Consorcio **Metro Línea 1 S.A.S.**, conformado por **China Harbour Engineering Company (CHEC)** y **Xi'an Rail Transit Group**.
* **Fabricante de los Trenes:** **CRRC Changchun Railway Vehicles Co., Ltd.** junto con sistemas de tracción y señalización CBTC de **Alstom**.

[🚧 Ver Estado de la Obra (82.33%)](#open_project_status)`, effectiveLang);
  }

  // 16. EMPLEO Y VACANTES
  if (query.includes('empleo') || query.includes('trabajo') || query.includes('vacante') || query.includes('hoja de vida') || query.includes('postular')) {
    return ensureSuggestionsBlock(`💼 **Convocatorias Laborales y Bolsa de Empleo del Metro**

* **Vacantes Disponibles:** Oportunidades tanto para personal con experiencia como **vacantes sin experiencia** que reciben capacitación técnica en simuladores de obra.
* **Perfiles Requeridos:**
  - Auxiliares de construcción y obra civil ($2.500.000 - $3.200.000 COP).
  - Operadores de maquinaria pesada y vigas lanzadoras.
  - Ingenieros civiles, inspectores SST y coordinadores ambientales ($4.800.000 - $6.800.000 COP).
  - Personal para mantenimiento electromecánico y gestión social.

[💼 Ver Vacantes y Postularme Ahora](#open_portal_empleo)`, effectiveLang);
  }

  // 17. RESPUESTA UNIVERSAL EXPERTA DE GEOGRAFÍA Y MOVILIDAD EN BOGOTÁ
  return ensureSuggestionsBlock(`🏙️ **Movilidad Urbana y Red de Transporte en Bogotá**

Como tu asistente integral de movilidad de Bogotá en UrbanGo:
* **Toda Bogotá Conectada:** Conozco las 20 localidades, sus corredores troncales (Caracas, NQS, Calle 26, Calle 80, Américas, AutoNorte y AutoSur) y rutas zonales del SITP.
* **Primera Línea del Metro (82.33% de avance):** Viaducto continuo de 23.9 km y 16 estaciones que transformará los traslados desde Bosa y Kennedy hasta la Calle 72 en solo 27 minutos.
* **Intermodalidad:** Conexión con TransMilenio, TransMiCable, ciclorrutas y futura Línea 2 a Suba con tarifa unificada TuLlave.

Puedes consultarme cómo llegar a cualquier centro comercial, parque, hospital, universidad o barrio de la ciudad. ¡Dime qué destino tienes en mente!

[🗺️ Ver Mapa Interactivo de Bogotá y Metro](#action_map)
[📰 Ver Novedades y Noticias Oficiales](#open_content_news)`, effectiveLang);
}