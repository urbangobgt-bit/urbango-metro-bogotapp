import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import { METROBOT_SYSTEM_INSTRUCTION } from './src/utils/metroBotPrompt.js';
import { KNOWLEDGE_BASE } from './src/data/metroKnowledge.js';

function metroBotApiPlugin(): Plugin {
  return {
    name: 'metrobot-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/chat' && req.method === 'POST') {
          let body = '';
          let bodyExceeded = false;
          req.on('data', chunk => {
            body += chunk;
            if (body.length > 50000) { // 50KB limit to protect from buffer flooding
              bodyExceeded = true;
            }
          });

          req.on('end', async () => {
            if (bodyExceeded) {
              res.statusCode = 413;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Payload Too Large' }));
              return;
            }

            try {
              const data = JSON.parse(body || '{}');
              let { message, history = [], knowledgeBase = KNOWLEDGE_BASE, lang = 'ES' } = data;
              const targetLang = String(lang || data.language || 'ES').trim().toUpperCase();

              if (!message || typeof message !== 'string') {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Missing message parameter' }));
                return;
              }

              // Seguridad: Sanitizar entrada contra SQL Injection y Code Injection
              message = message.slice(0, 2000).trim();
              message = message.replace(/(?:'|\"|`)\s*(?:or|and)\s*(?:'|\"|`|\d+)\s*=\s*(?:'|\"|`|\d+)/gi, '');
              message = message.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
              message = message.replace(/javascript\s*:/gi, '');

              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.statusCode = 503;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }));
                return;
              }

              const { GoogleGenAI } = await import('@google/genai');
              const ai = new GoogleGenAI();

              // 1. Amplitud de memoria contextual: mantener los últimos 10 turnos de conversación activos (hasta 20 mensajes)
              const rawHistory = Array.isArray(history) ? history.slice(-20) : [];
              const normalizedItems: Array<{ role: 'user' | 'model'; text: string }> = [];

              for (const h of rawHistory) {
                if (!h || !h.text) continue;
                const role = (h.role === 'model' || h.role === 'bot') ? 'model' : 'user';
                normalizedItems.push({ role, text: String(h.text) });
              }

              normalizedItems.push({ role: 'user', text: message });

              // Gemini API exige que contents empiece por 'user' y alterne roles
              const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
              for (const item of normalizedItems) {
                if (contents.length === 0 && item.role === 'model') {
                  continue; // Ignorar saludo inicial si es del modelo
                }

                if (contents.length > 0 && contents[contents.length - 1].role === item.role) {
                  // Fusionar mensajes consecutivos del mismo rol
                  contents[contents.length - 1].parts[0].text += `\n${item.text}`;
                } else {
                  contents.push({
                    role: item.role,
                    parts: [{ text: item.text }]
                  });
                }
              }

              // 2. Inyección de diccionario de conocimiento persistente (JSON local KNOWLEDGE_BASE)
              const activeKB = knowledgeBase || KNOWLEDGE_BASE;
              
              const languageDirectives: Record<string, string> = {
                EN: `
### MANDATORY LANGUAGE INSTRUCTION:
Respond strictly in fluent, natural ENGLISH.
- Translate explanations, instructions, tips, and headings (e.g., "🧭 **Suggested Route:**", "🔄 **Total Connections:** 2 boardings (1 transfer at $0 COP)", "1. **Boarding 1 (Origin):**", "2. **Interchange / Transfer Point:**", "3. **Boarding 2 (Destination / Final Leg):**", "⏱️ **Estimated Time:**", "💡 **#BogotáModoMetro Tip:**").
- Preserve Bogotá official proper nouns: "Empresa Metro de Bogotá", "TransMilenio", "SITP", "TuLlave", "Bosa", "Fontibón", "Kennedy", "Calle 72", "Av. Caracas", "Portal Américas", "SENA", "Metro Línea 1 S.A.S."
- ALL action tags MUST remain in verbatim English ASCII format without translation (e.g. [ACTION: OPEN_MAP_MODULE], [ACTION: OPEN_EMPLOYMENT_MODULE], [ACTION: OPEN_NEWS_MODULE], [ACTION: OPEN_BALANCE_MODULE], [ACTION: OPEN_CULTURE_MODULE], [ACTION: OPEN_FORUM_MODULE]).
- Maintain all technical facts and exact metrics (82.33% viaduct progress, 6 launching girders, 1,800 passenger capacity per train, 72,000 PHSM, 42.5 km/h commercial speed, GoA4 CBTC automation, Calle 72 interchange 98%, 110-minute TuLlave window at $0 COP).
- Always conclude with the [SUGERENCIAS] block containing 3 relevant questions in English.`,
                PT: `
### INSTRUÇÃO OBRIGATÓRIA DE IDIOMA:
Responda estritamente em PORTUGUÊS fluente e natural.
- Traduza explicações, orientações e títulos de itinerários (ex: "🧭 **Rota Sugerida:**", "🔄 **Conexões Totais:** 2 embarques (1 baldeação a $0 COP)", "1. **Embarque 1 (Origem):**", "2. **Ponto de Conexão / Baldeação:**", "3. **Embarque 2 (Destino / Trecho Final):**", "⏱️ **Tempo estimado:**", "💡 **Dica #BogotáModoMetro:**").
- Mantenha os nomes próprios de Bogotá: "Empresa Metro de Bogotá", "TransMilenio", "SITP", "TuLlave", "Bosa", "Fontibón", "Kennedy", "Calle 72", "Av. Caracas", "SENA", "Metro Línea 1 S.A.S."
- As tags interativas [ACTION: ...] DEVEM ser mantidas exatamente em inglês (ex: [ACTION: OPEN_MAP_MODULE], [ACTION: OPEN_EMPLOYMENT_MODULE]). NÃO traduza as tags.
- Mantenha com total precisão todos os dados técnicos (avanço de 82,33% no viaduto, 6 vigas lançadoras, capacidade de 1.800 passageiros por trem, 72.000 PHSM, 42.5 km/h, GoA4 CBTC, 110 minutos com baldeação a $0 COP).
- Conclua sempre com o bloco [SUGERENCIAS] contendo 3 perguntas em português.`,
                ZH: `
### 强制语言指令：
请严格使用流畅自然的中文（简体）作答。
- 翻译说明、路线分步指引与标题（例如："🧭 **建议路线:**", "🔄 **换乘总计:** 2次乘车（1次 $0 COP 免费换乘）", "1. **第1程乘车（起点）:**", "2. **换乘中枢 / 换乘点:**", "3. **第2程乘车（目的地 / 最终路段）:**", "⏱️ **预计耗时:**", "💡 **#BogotáModoMetro 文明贴士:**"）。
- 保持波哥大地理专有名词与机构原名：Empresa Metro de Bogotá, TransMilenio, SITP, TuLlave, Bosa, Fontibón, Kennedy, Calle 72, Av. Caracas, SENA, Metro Línea 1 S.A.S.
- 交互指令标签必须完全保留为英文原样（例如：[ACTION: OPEN_MAP_MODULE]、[ACTION: OPEN_EMPLOYMENT_MODULE]、[ACTION: OPEN_NEWS_MODULE]、[ACTION: OPEN_BALANCE_MODULE]、[ACTION: OPEN_CULTURE_MODULE]、[ACTION: OPEN_FORUM_MODULE]），绝不能翻译标签。
- 严格保持技术指标与官方数据：高架桥进度82.33%，6台架桥机，单列车载客量1,800人，单向高峰72,000人次/小时（PHSM），商业时速42.5 km/h，GoA4级CBTC全自动无人驾驶，72街立体互通98%，TuLlave 110分钟内 $0 COP 免费换乘。
- 结尾必须保留 [SUGERENCIAS] 模块并提供3个简短切题的中文建议问题。`,
                ES: `
### INSTRUCCIÓN DE IDIOMA:
Responde estrictamente en ESPAÑOL oficial, aplicando toda la estructura requerida, datos técnicos exactos y etiquetas [ACTION: ...].`
              };

              const selectedLangDirective = languageDirectives[targetLang] || languageDirectives.ES;

              const systemInstructionWithKnowledge = `${METROBOT_SYSTEM_INSTRUCTION}

${selectedLangDirective}

---
### DICCIONARIO DE CONOCIMIENTO PERSISTENTE DE LA EMPRESA METRO DE BOGOTÁ (KNOWLEDGE_BASE):
Utiliza este diccionario de datos verificados como fuente de verdad estricta:
- Proyecto: ${JSON.stringify(activeKB.proyecto || {})}
- Aforo y Capacidad: ${JSON.stringify(activeKB.aforoYCapacidad || {})}
- Línea 2 Subterránea: ${JSON.stringify(activeKB.linea2 || {})}
- Financiación y Contrato: ${JSON.stringify(activeKB.financiacion || {})}
- Concesionario y Fabricante: ${JSON.stringify(activeKB.concesionarioYFabricante || {})}
- Convocatorias de Empleo: ${JSON.stringify(activeKB.empleos?.vacantesPrincipales || activeKB.empleos || {})}
- Canales de Postulación Gratuitos: ${JSON.stringify(activeKB.empleos?.canalesPostulacion || {})}
`;

              // 3. Parámetros de precisión estricta (temperature: 0.2)
              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents,
                config: {
                  systemInstruction: systemInstructionWithKnowledge,
                  temperature: 0.2
                }
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ text: response.text }));
            } catch (err: any) {
              // Respuesta limpia de fallback en caso de indisponibilidad o cuota de API
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ text: null, fallback: true, error: err?.message || 'Gemini unavailable' }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), metroBotApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: true,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
