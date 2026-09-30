import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

// Determinar si estamos usando mock basándonos en si hay llaves reales
export const isMocking = !import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- MOCK DATA PARA CUANDO NO HAY SUPABASE ---
export const mockData = {
  noticias: [
    {
      id: 0,
      type: 'noticia',
      title: '¡Ya rueda el tren sobre el viaducto! 🚇',
      desc: 'El alcalde Carlos Fernando Galán confirmó el inicio de las pruebas de rodaje técnico del tren número 2 movilizándose por el viaducto desde el patio taller de Bosa hasta inmediaciones de la Estación 2 (Av. Villavicencio con Ciudad de Cali). Hito histórico: 14 km de viaducto construido y avance general del 77.53%.',
      date: 'Mayo 2026',
      urgency: 'Alta',
      breaking: true,
      image: 'https://bogota.gov.co/sites/default/files/styles/1050x700/public/2023-10/vagon-metro-bogota-china.jpg'
    },
    {
      id: 1,
      type: 'noticia',
      title: 'El Metro entra en recta final',
      desc: 'Alcalde Carlos Fernando Galán confirma la llegada de los primeros trenes físicos desde China y el armado de 14 km de viaducto. El tren número 2 ya circula en pruebas técnicas.',
      date: 'Abr 2026',
      urgency: 'Alta',
      image: 'https://bogota.gov.co/sites/default/files/styles/1050x700/public/2024-02/obras-metro-bogota-viaducto.jpg'
    },
    {
      id: 2,
      type: 'cierre',
      title: 'Caos en la movilidad de la Caracas y Calle 72',
      desc: 'Reducción de carriles y desvíos generan trancones más largos y estrés vial. El PMT está activo en las intersecciones críticas.',
      date: 'Hoy',
      urgency: 'Alta',
      image: 'https://bogota.gov.co/sites/default/files/styles/1050x700/public/2023-11/intercambiador-calle-72.jpg'
    },
    {
      id: 3,
      type: 'noticia',
      title: 'Comerciantes en alerta económica',
      desc: 'Caída de ventas y flujo peatonal por polvo y ruido en Caracas Centro, Kennedy y Calle 72. La Alcaldía analiza medidas de compensación.',
      date: 'Ayer',
      urgency: 'Media',
      image: 'https://bogota.gov.co/sites/default/files/styles/1050x700/public/2024-01/patio-taller-metro.jpg'
    },
    {
      id: 4,
      type: 'noticia',
      title: 'Boom de empleo: 17.000 puestos generados',
      desc: 'Impacto positivo en contratación de perfiles de construcción e ingeniería en toda la zona de influencia del proyecto.',
      date: '10 May',
      urgency: 'Media',
      image: 'https://bogota.gov.co/sites/default/files/styles/1050x700/public/2023-08/trabajadores-metro-bogota.jpg'
    }
  ],
  historial_consultas: []
};

export const empleoData = {
  convocatoria: {
    titulo: '180 Vacantes para la Operación del Metro de Bogotá',
    subtitulo: 'Convocatoria Oficial 2026 — Empresa Metro de Bogotá S.A.S.',
    descripcion: 'La Empresa Metro de Bogotá S.A.S. abre convocatoria oficial para cubrir 180 vacantes laborales dirigidas a ciudadanos bogotanos y colombianos que deseen hacer parte del equipo humano que operará la Primera Línea del Metro.',
    fechaCierre: 'Convocatoria abierta hasta cubrir cupos',
    salarioRango: 'Entre $2.500.000 y $6.800.000 COP según perfil',
  },
  perfiles: [
    {
      area: 'Operación de Trenes',
      icono: '🚇',
      vacantes: 60,
      requisitos: ['Técnico o tecnólogo en transporte, mecánica o eléctrica', 'Experiencia mínima 1 año en operación de maquinaria o vehículos', 'Buena salud visual y auditiva certificada'],
      color: '#B30000'
    },
    {
      area: 'Mantenimiento e Infraestructura',
      icono: '🔧',
      vacantes: 45,
      requisitos: ['Técnico en electricidad, mecatrónica o mantenimiento industrial', 'Conocimiento en sistemas de rieles y electrificación', 'Disposición para turnos rotativos 24/7'],
      color: '#FF6B35'
    },
    {
      area: 'Ingeniería y Sistemas',
      icono: '⚙️',
      vacantes: 30,
      requisitos: ['Profesional en Ingeniería Eléctrica, Civil, Mecánica o de Sistemas', 'Experiencia en proyectos de infraestructura o transporte masivo', 'Inglés básico o intermedio deseable'],
      color: '#2D8B3C'
    },
    {
      area: 'Atención al Usuario y Estaciones',
      icono: '👷',
      vacantes: 30,
      requisitos: ['Bachiller o técnico en cualquier área', 'Excelente capacidad de comunicación y servicio al cliente', 'Manejo básico de herramientas digitales'],
      color: '#FFD600',
      textColor: '#1A1A1A'
    },
    {
      area: 'Seguridad y Control de Riesgos',
      icono: '🛡️',
      vacantes: 15,
      requisitos: ['Formación en seguridad industrial o afines', 'Certificación en primeros auxilios vigente', 'Experiencia en manejo de emergencias o seguridad privada'],
      color: '#6B21A8'
    }
  ],
  pasos: [
    { paso: 1, titulo: 'Regístrate en el Portal de Oportunidades (Bogotá Trabaja)', desc: 'Ingresa a bogotatrabaja.gov.co y crea tu perfil profesional actualizado con documentos en regla.' },
    { paso: 2, titulo: 'Revisa las convocatorias activas', desc: 'Filtra por "Metro de Bogotá" o "Empresa de Transporte del Tercer Milenio". Lee los perfiles y aplica al que mejor se ajuste a tu experiencia.' },
    { paso: 3, titulo: 'Presenta tus pruebas', desc: 'Si eres preseleccionado, serás citado a pruebas técnicas y psicotécnicas en las sedes habilitadas por la Empresa Metro.' },
    { paso: 4, titulo: 'Entrevista con el equipo de talento', desc: 'El área de Gestión Humana del Metro de Bogotá te citará para una entrevista presencial o virtual.' },
    { paso: 5, titulo: '¡Vinculación y firma de contrato!', desc: 'Los candidatos seleccionados recibirán notificación oficial por correo o llamada para inicio de proceso de contratación.' }
  ],
  contacto: [
    { nombre: 'Portal de Oportunidades Bogotá', url: 'https://bogotatrabaja.gov.co/', icon: '🌐' },
    { nombre: 'Secretaría de Desarrollo Económico', url: 'https://www.desarrolloeconomico.gov.co', icon: '🏛️' },
    { nombre: 'Empresa Metro de Bogotá S.A.S.', url: 'https://www.metrodebogota.gov.co', icon: '🚇' }
  ]
};
