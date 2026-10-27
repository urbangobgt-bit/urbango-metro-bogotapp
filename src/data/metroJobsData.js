// Datos oficiales y estructurados de Empleo y Convocatorias - Primera Línea del Metro de Bogotá
// Consorcio Metro Línea 1 & Agencia Pública de Empleo de Bogotá (Bogotá Trabaja)

export const METRO_JOB_STEPS = [
  {
    step: 1,
    title: 'Registro en Plataforma Oficial',
    summary: 'Agencia Pública de Empleo (Bogotá Trabaja) o El Empleo',
    desc: 'Crea o actualiza tu hoja de vida en el portal distrital de empleo o en el portal oficial de El Empleo con tus datos de contacto vigentes.',
    detail: 'Es el primer requisito legal para la preselección en convenios públicos de la Alcaldía Mayor de Bogotá y el Consorcio Metro Línea 1.',
    actionLabel: 'Ir a bogotatrabaja.gov.co',
    url: 'https://bogotatrabaja.gov.co/',
    badge: 'Paso Obligatorio'
  },
  {
    step: 2,
    title: 'Búsqueda de Vacantes Activas',
    summary: 'Convenio "Consorcio Metro Línea 1" o Ferias Distritales',
    desc: 'Filtra las vacantes bajo el término "Consorcio Metro Línea 1", "Empresa Metro de Bogotá" o asiste a las ferias presenciales de empleabilidad en Bosa y Kennedy.',
    detail: 'Las vacantes se publican de forma periódica según el avance de cada frente de obra y la fase de alistamiento pre-operativo.',
    actionLabel: 'Ver vacantes en El Empleo',
    url: 'https://www.elempleo.com/co/sitio-empresarial/consorcio-metro-linea-1',
    badge: 'Filtro por Tramo'
  },
  {
    step: 3,
    title: 'Postulación y Carga de Soportes',
    summary: 'Hoja de vida, cédula y certificados requeridos',
    desc: 'Adjunta tu documento de identidad ampliado al 150%, certificado de bachiller o actas técnicas, y certificaciones laborales si el cargo lo requiere.',
    detail: 'Recuerda que para cargos operativos NO se exige experiencia previa; únicamente soportes académicos básicos.',
    actionLabel: 'Ver requisitos de soportes',
    badge: 'Revisión Documental'
  },
  {
    step: 4,
    title: 'Selección y Capacitación Pagada',
    summary: 'Entrevistas, exámenes médicos y formación técnica',
    desc: 'Aprobada la revisión, pasarás a entrevistas, exámenes médicos ocupacionales y un programa intensivo de formación técnica 100% cubierto por la empresa.',
    detail: 'Incluye subsidio de sostenimiento durante la etapa de formación en simuladores de trenes y protocolos de vía en Patio Taller.',
    badge: 'Ingreso & Contrato'
  }
];

export const METRO_JOB_AREAS = [
  {
    id: 'operativa',
    name: 'Área Operativa y de Estaciones',
    subtitle: 'Sin experiencia previa · Capacitación brindada por la empresa',
    tag: 'Sin Experiencia',
    tagColor: 'bg-emerald-500 text-white',
    borderHighlight: 'border-emerald-500/30 dark:border-emerald-500/40',
    color: '#059669', // Emerald
    iconName: 'Train',
    description: 'Puestos de atención directa en el viaducto, andenes y cabina de trenes. Se otorga formación técnica certificada pagada por el consorcio.',
    vacantesTotal: 75,
    jobs: [
      {
        id: 'op-conductor',
        title: 'Conductor(a) de Tren',
        requisitoPrincipal: 'Requisito: Nivel bachiller culminado. Sin experiencia previa requerida.',
        detalleRequisitos: 'Mayor de 18 años, situación militar definida (si aplica), disponibilidad para turnos rotativos en Patio Taller y viaducto.',
        funciones: 'Operación asistida en modo GoA4, control de apertura/cierre de puertas, maniobras de alistamiento matutino y respuesta a protocolos de contingencia técnica en vía.',
        capacitacion: 'Curso de 240 horas en el simulador cinemático del Metro de Bogotá con subsidio de aprendizaje garantizado.',
        ubicacion: 'Patio Taller Bosa / Viaducto Línea 1',
        tipoContrato: 'Término indefinido tras certificación',
        salarioEstimado: '$2.600.000 - $3.400.000 COP + Prestaciones + Recargos nocturnos',
        vacantes: 35,
        sinExperiencia: true,
        destacada: true
      },
      {
        id: 'op-auxiliar',
        title: 'Auxiliar de Estación',
        requisitoPrincipal: 'Requisito: Nivel bachiller. Servicio al usuario y logística en accesos.',
        detalleRequisitos: 'Excelente expresión verbal, empatía, orientación al ciudadano y habilidades en resolución de dudas operativas.',
        funciones: 'Orientación a pasajeros en torniquetes y andenes, supervisión de puertas automáticas de andén (PSD), apoyo a personas con movilidad reducida y primeros auxilios.',
        capacitacion: 'Capacitación integral de 80 horas en servicio al cliente, emergencias y accesibilidad universal.',
        ubicacion: '16 Estaciones Línea 1 (Bosa a Calle 72)',
        tipoContrato: 'Directo con el consorcio',
        salarioEstimado: '$1.850.000 - $2.200.000 COP + Beneficios de ley',
        vacantes: 28,
        sinExperiencia: true,
        destacada: false
      },
      {
        id: 'op-comunicaciones',
        title: 'Controlador(a) de Comunicaciones',
        requisitoPrincipal: 'Requisito: Bachiller. Preferible experiencia en call center o atención telefónica.',
        detalleRequisitos: 'Manejo fluido de voz, escucha activa y capacidad para seguir protocolos de emergencia y reportes en tiempo real.',
        funciones: 'Monitoreo de interfonia interna, emisión de anuncios de megafonía pública en trenes y estaciones, canalización de reportes de seguridad hacia la Policía Metro y CCO.',
        capacitacion: 'Entrenamiento en consolas TETRA de radiocomunicación y sistemas de circuito cerrado CCTV.',
        ubicacion: 'Centro de Control Operacional (CCO) Calle 72',
        tipoContrato: 'Término fijo renovable con opción de permanencia',
        salarioEstimado: '$2.100.000 - $2.600.000 COP + Prestaciones',
        vacantes: 12,
        sinExperiencia: false,
        destacada: false
      }
    ]
  },
  {
    id: 'tecnica',
    name: 'Área Técnica e Infraestructura',
    subtitle: 'Con formación técnica y experiencia comprobada',
    tag: 'Técnica & Mantenimiento',
    tagColor: 'bg-blue-600 text-white',
    borderHighlight: 'border-blue-500/30 dark:border-blue-500/40',
    color: '#2563EB', // Blue
    iconName: 'Wrench',
    description: 'Cuadrillas técnicas dedicadas a la confiabilidad de sistemas eléctricos de tracción, redes hidrosanitarias, HVAC y arquitectura de estaciones.',
    vacantesTotal: 52,
    jobs: [
      {
        id: 'tec-electricistas',
        title: 'Técnicos Electricistas y de Control',
        requisitoPrincipal: 'Subestaciones y cableado de potencia. Certificación CONTE / técnico electricista.',
        detalleRequisitos: 'Mínimo 1 año de experiencia en media y alta tensión, conexionado de tableros de potencia y cableado estructurado industrial.',
        funciones: 'Montaje y pruebas de subestaciones rectificadoras de tracción (750V / 1500V DC), tendido de tercer riel o catenaria rígida y sistemas de puesta a tierra.',
        capacitacion: 'Certificación en seguridad eléctrica bajo normativa NFPA 70E y estándares ferroviarios internacionales.',
        ubicacion: 'Subestaciones Eléctricas de Tracción (SET) y Viaducto',
        tipoContrato: 'Obra o labor / Fijo con prestaciones completas',
        salarioEstimado: '$2.900.000 - $3.800.000 COP',
        vacantes: 18,
        sinExperiencia: false,
        destacada: true
      },
      {
        id: 'tec-controladores-energia',
        title: 'Controladores de Energía',
        requisitoPrincipal: 'Tecnólogo en electricidad, electromecánica o afines.',
        detalleRequisitos: 'Experiencia mínima de 18 meses en centros de despacho eléctrico, manejo de sistemas SCADA y telecontrol de interruptores.',
        funciones: 'Monitoreo 24/7 de la red eléctrica de alimentación de la Primera Línea, maniobras remotas de seccionamiento y coordinación con Enel Colombia.',
        capacitacion: 'Especialización en plataforma SCADA ferroviaria provista por el fabricante del sistema.',
        ubicacion: 'Centro de Control Operacional (CCO Calle 72)',
        tipoContrato: 'Término indefinido',
        salarioEstimado: '$3.500.000 - $4.400.000 COP',
        vacantes: 8,
        sinExperiencia: false,
        destacada: false
      },
      {
        id: 'tec-hvac',
        title: 'Técnicos HVAC e Hidráulicos',
        requisitoPrincipal: 'Climatización, ventilación y redes contra incendios.',
        detalleRequisitos: 'Técnico certificado en refrigeración/climatización o plomería industrial con 1 año de experiencia en proyectos de gran envergadura.',
        funciones: 'Instalación y mantenimiento de extractores axiales en estaciones, enfriadoras Chiller, redes de rociadores automáticos y bombas de presión contra incendios.',
        capacitacion: 'Normativa NFPA 130 para sistemas de ventilación de emergencia en transporte masivo guiado.',
        ubicacion: 'Estaciones subterráneas (Cll 72) y edificios técnicos elevados',
        tipoContrato: 'Obra civil / Fijo',
        salarioEstimado: '$2.600.000 - $3.300.000 COP',
        vacantes: 14,
        sinExperiencia: false,
        destacada: false
      },
      {
        id: 'tec-instaladores',
        title: 'Instaladores y Acabados',
        requisitoPrincipal: 'Oficiales de drywall, pintores de obra y enchape.',
        detalleRequisitos: 'Mínimo 2 años de experiencia certificada como oficial de acabados en centros comerciales o infraestructura pública.',
        funciones: 'Montaje de cielorrasos metálicos registrables, paneles fenólicos en fachadas de estaciones, pintura epóxica de pisos técnicos e instalación de pisos podotáctiles.',
        capacitacion: 'Inducción de trabajo seguro en alturas (Nivel Avanzado) con certificado vigente.',
        ubicacion: 'Edificios de acceso a estaciones (Tramo 1 al 6)',
        tipoContrato: 'Obra civil con dotación y alimentación en obra',
        salarioEstimado: '$2.300.000 - $2.900.000 COP',
        vacantes: 12,
        sinExperiencia: false,
        destacada: false
      }
    ]
  },
  {
    id: 'construccion',
    name: 'Área de Construcción y Obras Civiles',
    subtitle: 'Fuerza laboral base · Obras en viaducto y frentes de vía',
    tag: 'Obras Civiles',
    tagColor: 'bg-amber-600 text-white',
    borderHighlight: 'border-amber-500/30 dark:border-amber-500/40',
    color: '#D97706', // Amber
    iconName: 'HardHat',
    description: 'Mano de obra operativa y técnica en el montaje de columnas, capiteles, vigas U del viaducto y obras de adecuación vial.',
    vacantesTotal: 65,
    jobs: [
      {
        id: 'civ-ayudantes',
        title: 'Ayudantes y Auxiliares de Obra',
        requisitoPrincipal: 'Apoyo general. Mínimo 6 meses de experiencia en construcción.',
        detalleRequisitos: 'Saber leer y escribir, certificado de alturas vigente o disposición inmediata para renovación, buen estado de salud para trabajo de campo.',
        funciones: 'Apoyo en vaciado de concreto, desencofrado, acopio de materiales, limpieza de frentes de obra y apoyo logístico a oficiales y cuadrillas.',
        capacitacion: 'Inducción SST, manejo de herramientas de poder y protocolos de seguridad vial urbana.',
        ubicacion: 'Frentes Av. Caracas, Primero de Mayo y Bosa',
        tipoContrato: 'Obra civil con todas las prestaciones y dotación periódica',
        salarioEstimado: '$1.750.000 - $2.100.000 COP + Horas extras y dominicales',
        vacantes: 35,
        sinExperiencia: false,
        destacada: true
      },
      {
        id: 'civ-trafico',
        title: 'Auxiliares de Tráfico',
        requisitoPrincipal: 'Coordinación vial y señalización en frentes de obra (Plan de Manejo de Tránsito PMT).',
        detalleRequisitos: 'Nivel bachiller, certificado de capacitación en señalización vial y PMT de la Secretaría Distrital de Movilidad (o equivalente).',
        funciones: 'Control de tráfico vehicular en cruces críticos de la Av. Caracas y Primero de Mayo, guía a peatones en desvíos temporales y orientación a buses zonales.',
        capacitacion: 'Actualización en normatividad de tránsito del Distrito y protocolos de comunicación por radio.',
        ubicacion: 'Puntos críticos de desvío vial (Calles 26, 39, 57 y 72)',
        tipoContrato: 'Directo con contratista del Consorcio Metro Línea 1',
        salarioEstimado: '$1.800.000 - $2.200.000 COP + Recargos',
        vacantes: 18,
        sinExperiencia: false,
        destacada: false
      },
      {
        id: 'civ-maquinaria',
        title: 'Operadores de Maquinaria Pesada',
        requisitoPrincipal: 'Conductores de grúas, pilotadoras y excavadoras.',
        detalleRequisitos: 'Licencia de conducción C2 o C3 vigente sin comparendos pendientes, certificación de operador de maquinaria pesada emitida por el SENA o ente acreditado, mínimo 3 años de experiencia.',
        funciones: 'Operación de pilotadoras hidráulicas para cimentación profunda, grúas telescópicas para izaje de dovelas y retroexcavadoras orugadas.',
        capacitacion: 'Procedimientos específicos de maniobra con vigas lanzadoras y gálibos ferroviarios.',
        ubicacion: 'Frentes de viaducto elevado y Patio Taller Bosa',
        tipoContrato: 'Término de obra con alta bonificación por rendimiento',
        salarioEstimado: '$3.500.000 - $5.200.000 COP',
        vacantes: 12,
        sinExperiencia: false,
        destacada: false
      }
    ]
  },
  {
    id: 'profesionales',
    name: 'Perfiles Profesionales y Administrativos',
    subtitle: 'Ingeniería, gestión interdisciplinaria y soporte bilingüe',
    tag: 'Profesional & Bilingüe',
    tagColor: 'bg-purple-600 text-white',
    borderHighlight: 'border-purple-500/30 dark:border-purple-500/40',
    color: '#9333EA', // Purple
    iconName: 'GraduationCap',
    description: 'Cargos de dirección técnica, interventoría, control de interfaces electromecánicas y gestión corporativa colombo-china.',
    vacantesTotal: 28,
    jobs: [
      {
        id: 'pro-civiles',
        title: 'Ingenieros Civiles y Residentes de Obra',
        requisitoPrincipal: 'Urbanismo, pavimentos y redes. Matrícula profesional COPNIA vigente.',
        detalleRequisitos: 'Profesional graduado en Ingeniería Civil con mínimo 3 años de experiencia en infraestructura de transporte, viaductos o pavimentos rígidos.',
        funciones: 'Control de calidad de mezclas de concreto, seguimiento a cronogramas de vigas lanzadoras, aprobación de ensayos de laboratorio y relación con interventoría.',
        capacitacion: 'Sistemas de aseguramiento de calidad FIDIC y software BIM de seguimiento constructivo.',
        ubicacion: 'Frentes Caracas Norte / Tramo 2 y 3',
        tipoContrato: 'Término indefinido con plan de carrera',
        salarioEstimado: '$5.500.000 - $7.800.000 COP',
        vacantes: 10,
        sinExperiencia: false,
        destacada: true
      },
      {
        id: 'pro-interfaces',
        title: 'Ingenieros de Interfaces / Redes',
        requisitoPrincipal: 'Técnicos bilingües (Inglés intermedio/avanzado B2 o superior).',
        detalleRequisitos: 'Ingeniería Electrónica, Mecatrónica o de Telecomunicaciones con experiencia en integración de sistemas ferroviarios o industriales.',
        funciones: 'Validación de protocolos de señalización CBTC entre el material rodante (trenes CRRC) y los enclavamientos en tierra, redes de fibra óptica y sistemas de energía.',
        capacitacion: 'Entrenamiento directo con fabricantes de sistemas de control en Pekín y Shanghái (remoto y presencial).',
        ubicacion: 'Sede Consorcio Metro Línea 1 / CCO Calle 72',
        tipoContrato: 'Término indefinido',
        salarioEstimado: '$6.000.000 - $9.200.000 COP',
        vacantes: 8,
        sinExperiencia: false,
        destacada: true
      },
      {
        id: 'pro-soporte',
        title: 'Profesionales de Soporte y Gestión',
        requisitoPrincipal: 'Analistas de gestión humana, contabilidad y perfiles bilingües (Inglés / Mandarín).',
        detalleRequisitos: 'Profesionales en Administración de Empresas, Contaduría Pública, Psicología Organizacional, Filología o Negocios Internacionales. Dominio de inglés; conocimiento de mandarín es altamente valorado.',
        funciones: 'Gestión de nómina de más de 4.000 colaboradores, selección de personal local, traducción técnica y enlace documental entre el consorcio chino y las autoridades distritales.',
        capacitacion: 'Inmersión en cultura corporativa internacional y protocolos de auditoría pública distrital.',
        ubicacion: 'Oficinas Administrativas Consorcio Metro Línea 1 (Calle 72)',
        tipoContrato: 'Término indefinido',
        salarioEstimado: '$4.200.000 - $6.500.000 COP',
        vacantes: 10,
        sinExperiencia: false,
        destacada: false
      }
    ]
  }
];

export const OFFICIAL_JOB_PORTALS = [
  {
    id: 'bogota-trabaja',
    name: 'Agencia Pública de Empleo - Bogotá Trabaja',
    entity: 'Alcaldía Mayor de Bogotá · Sec. Desarrollo Económico',
    url: 'https://bogotatrabaja.gov.co/',
    description: 'Canal oficial público y 100% gratuito del Distrito Capital. Postulaciones directas y ferias de empleo locales.',
    btnText: 'Ir a Bogotá Trabaja',
    highlight: true,
    color: '#B30000'
  },
  {
    id: 'el-empleo',
    name: 'El Empleo - Consorcio Metro Línea 1',
    entity: 'Convenio Empresarial de Reclutamiento Masivo',
    url: 'https://www.elempleo.com/co/sitio-empresarial/consorcio-metro-linea-1',
    fallbackUrl: 'https://www.elempleo.com/co/ofertas-empleo?trabajo=metro+bogota',
    description: 'Portal corporativo oficial donde el concesionario constructor publica las vacantes especializadas de obra y operación.',
    btnText: 'Ver Vacantes en El Empleo - Metro Línea 1',
    highlight: true,
    color: '#2D8B3C'
  }
];

// Multilingual resolver for Steps
export const getLocalizedJobSteps = (lang = 'es') => {
  const l = (lang || 'es').toLowerCase();
  if (l === 'es') return METRO_JOB_STEPS;

  if (l === 'en') {
    return [
      {
        step: 1,
        title: '1. Resume Registration on Official Platform',
        summary: 'Public Employment Agency (Bogotá Trabaja) or El Empleo',
        desc: 'Create or update your CV on the district employment portal or on the official El Empleo portal with your current contact information.',
        detail: 'This is the mandatory first legal requirement for preselection under official agreements with Bogotá Mayor Office and Metro Line 1 Consortium.',
        actionLabel: 'Go to bogotatrabaja.gov.co',
        url: 'https://bogotatrabaja.gov.co/',
        badge: 'Mandatory Step'
      },
      {
        step: 2,
        title: '2. Search for Active Vacancies',
        summary: '"Consorcio Metro Línea 1" Agreement or District Fairs',
        desc: 'Filter job openings under the keyword "Consorcio Metro Línea 1", "Empresa Metro de Bogotá" or attend local job fairs in Bosa and Kennedy.',
        detail: 'Vacancies are posted periodically according to construction front milestones and pre-operational testing schedules.',
        actionLabel: 'View jobs on El Empleo',
        url: 'https://www.elempleo.com/co/sitio-empresarial/consorcio-metro-linea-1',
        badge: 'Filter by Section'
      },
      {
        step: 3,
        title: '3. Official Application & Document Upload',
        summary: 'Resume, ID card, and academic certificates',
        desc: 'Attach your official identification document, high school diploma or technical degree, and employment verification letters if applicable.',
        detail: 'Note that operational roles DO NOT require prior experience; only basic academic credentials.',
        actionLabel: 'Check document requirements',
        badge: 'Document Review'
      },
      {
        step: 4,
        title: '4. Selection & 100% Paid Training',
        summary: 'Interviews, medical exams, and technical simulator training',
        desc: 'Once approved, you will proceed to interviews, occupational medical tests, and an intensive technical training program fully covered by the consortium.',
        detail: 'Includes a learning stipend during training on kinematic train simulators at the Bosa Yard Depot.',
        badge: 'Hiring & Contract'
      }
    ];
  }

  if (l === 'pt') {
    return [
      {
        step: 1,
        title: '1. Registro do Currículo na Plataforma Oficial',
        summary: 'Agência Pública de Emprego (Bogotá Trabaja) ou El Empleo',
        desc: 'Crie ou atualize seu currículo no portal distrital de empregos ou no El Empleo oficial com seus dados de contato vigentes.',
        detail: 'Primeiro requisito legal para pré-seleção nos convênios da Prefeitura de Bogotá e do Consórcio Metro Línea 1.',
        actionLabel: 'Ir para bogotatrabaja.gov.co',
        url: 'https://bogotatrabaja.gov.co/',
        badge: 'Passo Obrigatório'
      },
      {
        step: 2,
        title: '2. Busca de Vagas Abertas',
        summary: 'Convênio "Consorcio Metro Línea 1" ou Feiras Distritais',
        desc: 'Filtre as vagas abertas por "Consorcio Metro Línea 1" ou compareça às feiras presenciais de emprego em Bosa e Kennedy.',
        detail: 'As vagas são divulgadas periodicamente conforme o avanço de cada frente de obra.',
        actionLabel: 'Ver vagas no El Empleo',
        url: 'https://www.elempleo.com/co/sitio-empresarial/consorcio-metro-linea-1',
        badge: 'Filtro por Trecho'
      },
      {
        step: 3,
        title: '3. Candidatura Oficial e Envio de Documentos',
        summary: 'Currículo, documento de identidade e certificados',
        desc: 'Anexe seu documento de identidade, certificado de escolaridade e comprovantes de experiência se exigidos.',
        detail: 'Para cargos operacionais NÃO se exige experiência prévia; apenas documentação escolar básica.',
        actionLabel: 'Ver requisitos de documentos',
        badge: 'Revisão Documental'
      },
      {
        step: 4,
        title: '4. Seleção e Treinamento Remunerado',
        summary: 'Entrevistas, exames médicos e capacitação técnica',
        desc: 'Aprovada a análise, você passará por entrevistas, exames médicos e capacitação técnica 100% remunerada pela empresa.',
        detail: 'Inclui bolsa-auxílio durante a formação prática nos simuladores de trem no Pátio de Manutenção.',
        badge: 'Contratação & Início'
      }
    ];
  }

  if (l === 'zh') {
    return [
      {
        step: 1,
        title: '1. 官方平台个人简历注册',
        summary: '波哥大市政公共就业局 (Bogotá Trabaja) 或 El Empleo',
        desc: '在市政就业门户或 El Empleo 官方招聘专区创建或更新您的个人简历与有效联络方式。',
        detail: '这是波哥大市政府与波哥大地铁一号线财团联合招募初筛的法定首要步骤。',
        actionLabel: '前往 bogotatrabaja.gov.co',
        url: 'https://bogotatrabaja.gov.co/',
        badge: '必经步骤'
      },
      {
        step: 2,
        title: '2. 筛选在招有效岗位',
        summary: '“Consorcio Metro Línea 1” 专区或线下招聘集市',
        desc: '通过关键词“Consorcio Metro Línea 1”或“Empresa Metro de Bogotá”筛选，或参加博萨与肯尼迪区线下招聘会。',
        detail: '岗位根据各施工标段工期及试运行筹备进度分批定期发布。',
        actionLabel: '在 El Empleo 查看职位',
        url: 'https://www.elempleo.com/co/sitio-empresarial/consorcio-metro-linea-1',
        badge: '标段筛选'
      },
      {
        step: 3,
        title: '3. 正式申请与材料附件上传',
        summary: '个人简历、身份证件及相关学历证明',
        desc: '附上身份证件、高中毕业证或专业技能认证，以及以往工作经历证明（如岗位需要）。',
        detail: '请注意：操作运营类基础岗位【无需任何以往工作经验】，仅需基础学历材料。',
        actionLabel: '查看证件要求细则',
        badge: '资料审核'
      },
      {
        step: 4,
        title: '4. 考核选拔与100%全薪岗前培训',
        summary: '综合面试、职业体检与专业驾驶及技术培训',
        desc: '资料审核通过后参加面试和体检，随后进入由公司100%全额出资并提供津贴的高强度专业技术培训。',
        detail: '在博萨车辆段多功能模拟驾驶舱及正线轨道实操期间享受全额培训津贴保障。',
        badge: '录用签约'
      }
    ];
  }

  return METRO_JOB_STEPS;
};

// Multilingual resolver for Job Areas & Openings
export const getLocalizedJobAreas = (lang = 'es') => {
  const l = (lang || 'es').toLowerCase();
  if (l === 'es') return METRO_JOB_AREAS;

  if (l === 'en') {
    return [
      {
        ...METRO_JOB_AREAS[0],
        name: '1. Operations & Station Area',
        subtitle: 'No prior experience required · Paid training provided by company',
        tag: 'No Experience Needed',
        description: 'Direct customer service and operational positions on viaduct, platforms and train cabins. Fully paid certified technical training provided.',
        jobs: [
          {
            ...METRO_JOB_AREAS[0].jobs[0],
            title: 'Train Driver (GoA4)',
            requisitoPrincipal: 'Requirement: High school diploma completed. No prior experience required.',
            detalleRequisitos: '18+ years old, military service status defined (if applicable), availability for rotating shifts at Bosa Yard Depot and viaduct.',
            funciones: 'Assisted driving in GoA4 mode, door control, daily morning inspection drills and response to railway technical contingency protocols.',
            capacitacion: '240-hour course on Bogotá Metro kinematic train simulator with guaranteed learning allowance.',
            ubicacion: 'Bosa Yard Depot / Line 1 Viaduct',
            tipoContrato: 'Indefinite term upon certification',
            salarioEstimado: '$2,600,000 - $3,400,000 COP + Benefits + Night differential'
          },
          {
            ...METRO_JOB_AREAS[0].jobs[1],
            title: 'Station Assistant',
            requisitoPrincipal: 'Requirement: High school diploma. Customer service and access logistics.',
            detalleRequisitos: 'Excellent verbal communication, empathy, public guidance, and operational problem solving.',
            funciones: 'Passenger guidance at turnstiles and platforms, platform screen door (PSD) supervision, reduced mobility assistance, and first aid.',
            capacitacion: 'Comprehensive 80-hour customer service, emergency protocols, and universal accessibility course.',
            ubicacion: '16 Line 1 Stations (Bosa to Calle 72)',
            tipoContrato: 'Direct contract with consortium',
            salarioEstimado: '$1,850,000 - $2,200,000 COP + Legal benefits'
          },
          {
            ...METRO_JOB_AREAS[0].jobs[2],
            title: 'Communications Controller',
            requisitoPrincipal: 'Requirement: High school diploma. Call center or phone support experience preferred.',
            detalleRequisitos: 'Fluent voice skills, active listening, and ability to follow emergency protocols and real-time incident reporting.',
            funciones: 'Intercom monitoring, public address audio announcements on trains and platforms, security coordination with Metro Police and OCC.',
            capacitacion: 'Training in TETRA radio communication consoles and CCTV surveillance systems.',
            ubicacion: 'Operational Control Center (OCC) Calle 72',
            tipoContrato: 'Renewable fixed-term with permanent career opportunity',
            salarioEstimado: '$2,100,000 - $2,600,000 COP + Benefits'
          }
        ]
      },
      {
        ...METRO_JOB_AREAS[1],
        name: '2. Technical & Infrastructure Area',
        subtitle: 'Requires technical degree and verified experience',
        tag: 'Technical & Maintenance',
        description: 'Technical teams dedicated to traction electrical systems, plumbing networks, HVAC, and station architecture.',
        jobs: [
          {
            ...METRO_JOB_AREAS[1].jobs[0],
            title: 'Electrical & Control Technicians',
            requisitoPrincipal: 'Substations and power cabling. Certified electrician.',
            detalleRequisitos: 'Minimum 1 year experience in medium/high voltage, power panel connection, and industrial structured cabling.',
            funciones: 'Assembly and testing of traction rectifier substations (750V / 1500V DC), third rail or rigid catenary laying, and grounding systems.',
            capacitacion: 'NFPA 70E electrical safety certification and international railway standards.',
            ubicacion: 'Traction Electrical Substations (SET) and Viaduct',
            tipoContrato: 'Civil works / Fixed with full benefits',
            salarioEstimado: '$2,900,000 - $3,800,000 COP'
          },
          {
            ...METRO_JOB_AREAS[1].jobs[1],
            title: 'Power Dispatch Controllers',
            requisitoPrincipal: 'Technologist in electricity, electromechanics or related field.',
            detalleRequisitos: 'Minimum 18 months experience in power dispatch centers, SCADA systems management, and remote switchgear control.',
            funciones: '24/7 monitoring of Line 1 traction power grid, remote sectionalizing maneuvers, and coordination with Enel Colombia.',
            capacitacion: 'Specialization in railway SCADA platform provided by system manufacturer.',
            ubicacion: 'Operational Control Center (OCC Calle 72)',
            tipoContrato: 'Indefinite term',
            salarioEstimado: '$3,500,000 - $4,400,000 COP'
          },
          {
            ...METRO_JOB_AREAS[1].jobs[2],
            title: 'HVAC & Hydraulic Technicians',
            requisitoPrincipal: 'Air conditioning, ventilation, and fire protection networks.',
            detalleRequisitos: 'Certified technician in refrigeration/HVAC or industrial plumbing with 1 year experience in large projects.',
            funciones: 'Installation and maintenance of axial exhaust fans in stations, chiller units, automatic sprinkler networks, and fire booster pumps.',
            capacitacion: 'NFPA 130 standard for emergency ventilation systems in guided mass transit.',
            ubicacion: 'Underground stations (Calle 72) and elevated technical buildings',
            tipoContrato: 'Civil works / Fixed term',
            salarioEstimado: '$2,600,000 - $3,300,000 COP'
          },
          {
            ...METRO_JOB_AREAS[1].jobs[3],
            title: 'Station Finishers & Installers',
            requisitoPrincipal: 'Drywall installers, commercial painters, and tiling specialists.',
            detalleRequisitos: 'Minimum 2 years verified experience as finishing craftsman in shopping centers or public infrastructure.',
            funciones: 'Installation of drop ceilings, phenolic station facade panels, technical room epoxy coatings, and tactile paving.',
            capacitacion: 'Advanced working at heights certified training.',
            ubicacion: 'Station Access Buildings (Sections 1 to 6)',
            tipoContrato: 'Civil works with PPE and site meals included',
            salarioEstimado: '$2,300,000 - $2,900,000 COP'
          }
        ]
      },
      {
        ...METRO_JOB_AREAS[2],
        name: '3. Construction & Civil Works Area',
        subtitle: 'Base workforce · Viaduct and track construction fronts',
        tag: 'Civil Works',
        description: 'Operational and technical labor force in column assembly, pier caps, U-beams, and roadway adaptations.',
        jobs: [
          {
            ...METRO_JOB_AREAS[2].jobs[0],
            title: 'Construction Laborers & Helpers',
            requisitoPrincipal: 'General support. Minimum 6 months construction experience.',
            detalleRequisitos: 'Literate, valid heights certification or immediate renewal readiness, good physical condition for site work.',
            funciones: 'Support in concrete pouring, formwork stripping, material stocking, site clearing, and logistical assistance to squads.',
            capacitacion: 'Occupational health & safety induction, power tool handling, and urban traffic safety.',
            ubicacion: 'Av. Caracas, Primero de Mayo, and Bosa fronts',
            tipoContrato: 'Civil works with full statutory benefits and periodic workwear',
            salarioEstimado: '$1,750,000 - $2,100,000 COP + Overtime & Sunday pay'
          },
          {
            ...METRO_JOB_AREAS[2].jobs[1],
            title: 'Traffic Control Assistants',
            requisitoPrincipal: 'Traffic coordination and signage at worksites (Traffic Management Plan PMT).',
            detalleRequisitos: 'High school diploma, certified training in road signage and PMT from District Mobility Secretariat (or equivalent).',
            funciones: 'Vehicular traffic direction at critical junctions along Av. Caracas and Primero de Mayo, pedestrian guidance at detours.',
            capacitacion: 'Refresher training in district road regulations and two-way radio communication protocols.',
            ubicacion: 'Key traffic detour locations (Calles 26, 39, 57, and 72)',
            tipoContrato: 'Direct with Metro Line 1 Consortium contractor',
            salarioEstimado: '$1,800,000 - $2,200,000 COP + Differentials'
          },
          {
            ...METRO_JOB_AREAS[2].jobs[2],
            title: 'Heavy Machinery Operators',
            requisitoPrincipal: 'Crane, piling rig, and excavator operators.',
            detalleRequisitos: 'Valid heavy vehicle driver license, heavy machinery operator certification from SENA or accredited institute, 3+ years experience.',
            funciones: 'Operation of hydraulic piling rigs for deep foundations, mobile cranes for segment erection, and crawler excavators.',
            capacitacion: 'Specific launching girder handling procedures and railway structural clearances.',
            ubicacion: 'Elevated viaduct fronts and Bosa Yard Depot',
            tipoContrato: 'Project duration contract with performance bonus',
            salarioEstimado: '$3,500,000 - $5,200,000 COP'
          }
        ]
      },
      {
        ...METRO_JOB_AREAS[3],
        name: '4. Professional & Administrative Profiles',
        subtitle: 'Engineering, cross-disciplinary management and bilingual support',
        tag: 'Professional & Bilingual',
        description: 'Technical management, auditing, electromechanical interface control, and Chinese-Colombian corporate administration.',
        jobs: [
          {
            ...METRO_JOB_AREAS[3].jobs[0],
            title: 'Civil Engineers & Site Residents',
            requisitoPrincipal: 'Urban planning, paving, and wet utilities. Valid professional license.',
            detalleRequisitos: 'Graduated Civil Engineer with at least 3 years experience in transit infrastructure, viaducts, or rigid pavements.',
            funciones: 'Concrete mix quality control, launching girder scheduling, lab test validation, and liaison with external auditors.',
            capacitacion: 'FIDIC quality assurance systems and BIM construction tracking software.',
            ubicacion: 'North Caracas Fronts / Sections 2 & 3',
            tipoContrato: 'Indefinite term with career progression',
            salarioEstimado: '$5,500,000 - $7,800,000 COP'
          },
          {
            ...METRO_JOB_AREAS[3].jobs[1],
            title: 'Interface & Network Engineers',
            requisitoPrincipal: 'Bilingual technical professionals (Upper-Intermediate English B2+).',
            detalleRequisitos: 'Electronic, Mechatronic or Telecommunications Engineering with experience in railway or industrial system integration.',
            funciones: 'Validation of CBTC signaling protocols between rolling stock (CRRC trains) and wayside interlocking, fiber optics, and power.',
            capacitacion: 'Direct training with signaling manufacturers in Beijing and Shanghai (remote and in-person).',
            ubicacion: 'Metro Line 1 Consortium HQ / OCC Calle 72',
            tipoContrato: 'Indefinite term',
            salarioEstimado: '$6,000,000 - $9,200,000 COP'
          },
          {
            ...METRO_JOB_AREAS[3].jobs[2],
            title: 'Support & Management Specialists',
            requisitoPrincipal: 'HR analysts, accounting, and bilingual specialists (English / Mandarin).',
            detalleRequisitos: 'Business Administration, Accounting, Organizational Psychology, or International Business. Fluent English; Mandarin proficiency is a strong advantage.',
            funciones: 'Payroll management for 4,000+ staff, local talent acquisition, technical translation, and liaison between Chinese consortium and city authorities.',
            capacitacion: 'Immersion in international corporate culture and public municipal auditing protocols.',
            ubicacion: 'Metro Line 1 Consortium Offices (Calle 72)',
            tipoContrato: 'Indefinite term',
            salarioEstimado: '$4,200,000 - $6,500,000 COP'
          }
        ]
      }
    ];
  }

  if (l === 'pt') {
    return [
      {
        ...METRO_JOB_AREAS[0],
        name: '1. Área Operacional e Estações',
        subtitle: 'Sem experiência prévia · Treinamento fornecido pela empresa',
        tag: 'Sem Experiência',
        description: 'Postos de atendimento e operação nas estações, plataformas e cabine dos trens. Formação técnica certificada paga pelo consórcio.',
        jobs: [
          {
            ...METRO_JOB_AREAS[0].jobs[0],
            title: 'Condutor(a) de Trem (GoA4)',
            requisitoPrincipal: 'Requisito: Ensino médio concluído. Sem experiência prévia necessária.',
            detalleRequisitos: 'Maior de 18 anos, disponibilidade para turnos alternados no Pátio de Bosa e viaduto.',
            funciones: 'Operação assistida em modo GoA4, controle de portas, checagem matinal e resposta a protocolos de contingência técnica.',
            capacitacion: 'Curso de 240 horas no simulador do Metrô de Bogotá com bolsa-auxílio garantida.',
            ubicacion: 'Pátio de Manutenção de Bosa / Viaduto Linha 1',
            tipoContrato: 'Prazo indeterminado após certificação',
            salarioEstimado: '$2.600.000 - $3.400.000 COP + Benefícios'
          },
          {
            ...METRO_JOB_AREAS[0].jobs[1],
            title: 'Auxiliar de Estação',
            requisitoPrincipal: 'Requisito: Ensino médio. Atendimento ao público e logística de acesso.',
            detalleRequisitos: 'Comunicação verbal clara, empatia, orientação ao cidadão e resolução de dúvidas.',
            funciones: 'Orientação de passageiros nas catracas e plataformas, supervisão de portas de plataforma (PSD) e apoio à acessibilidade.',
            capacitacion: 'Capacitação completa de 80 horas em atendimento ao cliente e primeiros socorros.',
            ubicacion: '16 Estações da Linha 1 (Bosa a Calle 72)',
            tipoContrato: 'Direto com o consórcio',
            salarioEstimado: '$1.850.000 - $2.200.000 COP + Benefícios'
          },
          {
            ...METRO_JOB_AREAS[0].jobs[2],
            title: 'Controlador(a) de Comunicações',
            requisitoPrincipal: 'Requisito: Ensino médio. Experiência desejável em call center.',
            detalleRequisitos: 'Fluência verbal, escuta ativa e agilidade no cumprimento de protocolos de emergência.',
            funciones: 'Monitoramento de interfonia, avisos sonoros nos trens e estações, canalização de ocorrências para a Polícia e CCO.',
            capacitacion: 'Treinamento em consoles TETRA de rádio e sistemas de CFTV.',
            ubicacion: 'Centro de Controle Operacional (CCO Calle 72)',
            tipoContrato: 'Prazo determinado renovável',
            salarioEstimado: '$2.100.000 - $2.600.000 COP + Benefícios'
          }
        ]
      },
      {
        ...METRO_JOB_AREAS[1],
        name: '2. Área Técnica e Infraestrutura',
        subtitle: 'Com formação técnica e experiência comprovada',
        tag: 'Técnica & Manutenção',
        description: 'Equipes técnicas dedicadas aos sistemas de tração elétrica, redes hidráulicas, climatização HVAC e arquitetura.',
        jobs: [
          {
            ...METRO_JOB_AREAS[1].jobs[0],
            title: 'Técnicos Eletricistas e de Controle',
            requisitoPrincipal: 'Subestações e cabeamento de força. Técnico eletricista.',
            detalleRequisitos: 'Mínimo de 1 ano de experiência em média e alta tensão e montagem de quadros elétricos industriais.',
            funciones: 'Montagem e testes de subestações retificadoras de tração (750V / 1500V CC), instalação de terceiro trilho e aterramento.',
            capacitacion: 'Certificação em segurança elétrica NFPA 70E e normas ferroviárias.',
            ubicacion: 'Subestações de Tração (SET) e Viaduto',
            tipoContrato: 'Obra civil / Fixo com benefícios completos',
            salarioEstimado: '$2.900.000 - $3.800.000 COP'
          },
          {
            ...METRO_JOB_AREAS[1].jobs[1],
            title: 'Controladores de Energia',
            requisitoPrincipal: 'Técnico/Tecnólogo em eletrotécnica ou eletromecânica.',
            detalleRequisitos: 'Experiência mínima de 18 meses em centros de despacho elétrico e sistemas SCADA.',
            funciones: 'Monitoramento 24/7 da rede de alimentação da Linha 1 e manobras remotas de seccionamento.',
            capacitacion: 'Especialização na plataforma SCADA ferroviária.',
            ubicacion: 'Centro de Controle Operacional (CCO Calle 72)',
            tipoContrato: 'Prazo indeterminado',
            salarioEstimado: '$3.500.000 - $4.400.000 COP'
          },
          {
            ...METRO_JOB_AREAS[1].jobs[2],
            title: 'Técnicos HVAC e Hidráulicos',
            requisitoPrincipal: 'Climatização, ventilação e sistemas contra incêndio.',
            detalleRequisitos: 'Técnico certificado com 1 ano de experiência em projetos de grande porte.',
            funciones: 'Instalação e manutenção de exaustores axiais nas estações, chillers e bombas de incêndio.',
            capacitacion: 'Norma NFPA 130 para ventilação de emergência em transporte sobre trilhos.',
            ubicacion: 'Estações subterrâneas e edifícios técnicos elevados',
            tipoContrato: 'Obra civil / Prazo determinado',
            salarioEstimado: '$2.600.000 - $3.300.000 COP'
          },
          {
            ...METRO_JOB_AREAS[1].jobs[3],
            title: 'Instaladores e Acabamentos',
            requisitoPrincipal: 'Gesseiros, pintores industriais e colocadores de piso.',
            detalleRequisitos: 'Mínimo de 2 anos de experiência comprovada em acabamentos de grandes obras.',
            funciones: 'Montagem de forros metálicos, painéis de fachada, pintura epóxi e piso tátil.',
            capacitacion: 'Treinamento de trabalho em altura com certificado válido.',
            ubicacion: 'Edifícios de acesso às estações',
            tipoContrato: 'Obra civil com alimentação no local',
            salarioEstimado: '$2.300.000 - $2.900.000 COP'
          }
        ]
      },
      {
        ...METRO_JOB_AREAS[2],
        name: '3. Área de Construção e Obras Civis',
        subtitle: 'Força de trabalho nas frentes de obra do viaduto e vias',
        tag: 'Obras Civis',
        description: 'Mão de obra operacional na montagem de pilares, vigas do viaduto e adequações urbanas.',
        jobs: [
          {
            ...METRO_JOB_AREAS[2].jobs[0],
            title: 'Ajudantes e Auxiliares de Obras',
            requisitoPrincipal: 'Apoio geral. Mínimo de 6 meses de experiência em construção civil.',
            detalleRequisitos: 'Alfabetizado, certificado para trabalho em altura e aptidão física para campo.',
            funciones: 'Apoio em concretagem, desforma, movimentação de materiais e limpeza de frentes.',
            capacitacion: 'Segurança do trabalho e protocolos de segurança viária.',
            ubicacion: 'Frentes Av. Caracas, Primero de Mayo e Bosa',
            tipoContrato: 'Obra civil com benefícios de lei e horas extras',
            salarioEstimado: '$1.750.000 - $2.100.000 COP + Horas extras'
          },
          {
            ...METRO_JOB_AREAS[2].jobs[1],
            title: 'Auxiliares de Trânsito',
            requisitoPrincipal: 'Orientação viária e sinalização nas frentes de obra (Plano de Trânsito PMT).',
            detalleRequisitos: 'Ensino médio completo e curso de sinalização viária urbana.',
            funciones: 'Orientação de motoristas e pedestres nos desvios temporários de tráfego.',
            capacitacion: 'Normas de trânsito distrital e comunicação por rádio.',
            ubicacion: 'Pontos críticos de desvio (Ruas 26, 39, 57 e 72)',
            tipoContrato: 'Direto com empreiteira do Consórcio Metro Línea 1',
            salarioEstimado: '$1.800.000 - $2.200.000 COP + Adicionais'
          },
          {
            ...METRO_JOB_AREAS[2].jobs[2],
            title: 'Operadores de Maquinário Pesado',
            requisitoPrincipal: 'Operadores de guindastes, perfuratrizes e escavadeiras.',
            detalleRequisitos: 'CNH profissional compatível, certificação de operador de máquinas pesadas e 3+ anos de experiência.',
            funciones: 'Operação de perfuratrizes para fundações profundas e guindastes telescópicos.',
            capacitacion: 'Procedimentos específicos de içamento com vigas lançadeiras.',
            ubicacion: 'Viaduto elevado e Pátio de Bosa',
            tipoContrato: 'Contrato por obra com bonificação por produção',
            salarioEstimado: '$3.500.000 - $5.200.000 COP'
          }
        ]
      },
      {
        ...METRO_JOB_AREAS[3],
        name: '4. Perfis Profissionais e Administrativos',
        subtitle: 'Engenharia, gestão multidisciplinar e suporte bilíngue',
        tag: 'Profissional & Bilíngue',
        description: 'Cargos técnicos de engenharia, fiscalização, controle de interfaces e gestão corporativa colombo-chinesa.',
        jobs: [
          {
            ...METRO_JOB_AREAS[3].jobs[0],
            title: 'Engenheiros Civis e Residentes de Obra',
            requisitoPrincipal: 'Infraestrutura de transporte e pavimentos. Registro profissional ativo.',
            detalleRequisitos: 'Engenheiro Civil com 3+ anos de experiência em viadutos ou pavimentação rígida.',
            funciones: 'Controle de qualidade do concreto, cronograma das vigas lançadeiras e testes de laboratório.',
            capacitacion: 'Normas de garantia de qualidade FIDIC e software BIM.',
            ubicacion: 'Frentes Caracas Norte / Trechos 2 e 3',
            tipoContrato: 'Prazo indeterminado com plano de carreira',
            salarioEstimado: '$5.500.000 - $7.800.000 COP'
          },
          {
            ...METRO_JOB_AREAS[3].jobs[1],
            title: 'Engenheiros de Redes e Interfaces',
            requisitoPrincipal: 'Engenheiros bilíngues (Inglês B2+ ou fluente).',
            detalleRequisitos: 'Engenharia Eletrônica, Mecatrônica ou Telecomunicações com experiência em integração de sistemas.',
            funciones: 'Validação dos protocolos de sinalização CBTC entre trens e vias, fibra óptica e energia.',
            capacitacion: 'Treinamento direto com fabricantes em Pequim e Xangai.',
            ubicacion: 'Sede do Consórcio Metro Línea 1 / CCO Calle 72',
            tipoContrato: 'Prazo indeterminado',
            salarioEstimado: '$6.000.000 - $9.200.000 COP'
          },
          {
            ...METRO_JOB_AREAS[3].jobs[2],
            title: 'Profissionais de Suporte e Gestão',
            requisitoPrincipal: 'Analistas de RH, contabilidade e perfis bilíngues (Inglês / Mandarim).',
            detalleRequisitos: 'Administração, Ciências Contábeis ou Negócios Internacionais. Inglês fluente; Mandarim valorizado.',
            funciones: 'Gestão de folha de pagamento de mais de 4.000 funcionários, recrutamento e tradução técnica.',
            capacitacion: 'Imersão em cultura corporativa multinacional.',
            ubicacion: 'Escritórios Administrativos (Calle 72)',
            tipoContrato: 'Prazo indeterminado',
            salarioEstimado: '$4.200.000 - $6.500.000 COP'
          }
        ]
      }
    ];
  }

  if (l === 'zh') {
    return [
      {
        ...METRO_JOB_AREAS[0],
        name: '1. 运营与车站管理领域',
        subtitle: '无需以往经验 · 公司提供100%全额资助带薪培训',
        tag: '无经验要求',
        description: '高架轨道、车站站台及列车驾驶室一线工作岗位，财团提供带薪认证专业技术培训。',
        jobs: [
          {
            ...METRO_JOB_AREAS[0].jobs[0],
            title: '地铁列车驾驶员 (GoA4)',
            requisitoPrincipal: '学历要求：高中毕业或中专学历。无需以往任何驾驶或铁路经验。',
            detalleRequisitos: '年满18周岁，身体健康，能适应博萨车辆段与高架正线倒班制。',
            funciones: 'GoA4全自动辅助驾驶、车门开闭控制、早晚出车检查及正线应急故障处置。',
            capacitacion: '波哥大地铁全动模拟驾驶舱240小时专业培训，培训期间享受全额生活津贴。',
            ubicacion: '博萨车辆段 / 1号线高架正线',
            tipoContrato: '考取上岗资格证后签订无固定期限合同',
            salarioEstimado: '2,600,000 - 3,400,000 哥伦比亚比索 + 法定福利 + 夜班补助'
          },
          {
            ...METRO_JOB_AREAS[0].jobs[1],
            title: '车站客服与站务助理',
            requisitoPrincipal: '学历要求：高中毕业。具备良好的公众服务与沟通意识。',
            detalleRequisitos: '口头表达流利，有耐心，具备良好的解决日常出行疑问能力。',
            funciones: '闸机与站台乘车引导、站台屏蔽门 (PSD) 监护、无障碍乘客接送及基础急救。',
            capacitacion: '80小时客户服务、应急疏散及无障碍服务标准化培训。',
            ubicacion: '1号线全线16座车站（博萨至第72街）',
            tipoContrato: '与财团直接签署正式合同',
            salarioEstimado: '1,850,000 - 2,200,000 哥伦比亚比索 + 法定全额福利'
          },
          {
            ...METRO_JOB_AREAS[0].jobs[2],
            title: '行车调度通信员',
            requisitoPrincipal: '学历要求：高中或中专。有呼叫中心或客服经验者优先。',
            detalleRequisitos: '普通话/西班牙语表达标准，具备实时应急报告处理与倾听能力。',
            funciones: '站车内部通话监听、列车及车站广播播发、治安事件向地铁公安与控制中心分流。',
            capacitacion: 'TETRA 数字集群无线对讲控制台与 CCTV 视频监控系统培训。',
            ubicacion: '第72街运行控制中心 (OCC)',
            tipoContrato: '可续签固定期限合同（具有长期留任与晋升通道）',
            salarioEstimado: '2,100,000 - 2,600,000 哥伦比亚比索 + 福利'
          }
        ]
      },
      {
        ...METRO_JOB_AREAS[1],
        name: '2. 技术与基础设施维护领域',
        subtitle: '需具备专业技术背景及相关工程实操经验',
        tag: '技术与维保',
        description: '保障牵引供电、给排水管网、车站暖通空调及建筑结构的专业工程技术队伍。',
        jobs: [
          {
            ...METRO_JOB_AREAS[1].jobs[0],
            title: '电气与控制技术员',
            requisitoPrincipal: '牵引变电所与强电布线。持有电工上岗证书。',
            detalleRequisitos: '至少1年中高压电气、动力配电柜接线及工业布线工作经验。',
            funciones: '直流牵引整流变电所（750V/1500V DC）安装调试、接触轨/刚性接触网及接地系统敷设。',
            capacitacion: 'NFPA 70E 电气安全标准及国际铁路电气规范认证。',
            ubicacion: '牵引变电所 (SET) 及高架桥区间',
            tipoContrato: '工程标段/固定期限全额社保合同',
            salarioEstimado: '2,900,000 - 3,800,000 哥伦比亚比索'
          },
          {
            ...METRO_JOB_AREAS[1].jobs[1],
            title: '电力调度值班员',
            requisitoPrincipal: '电力、机电一体化大专或高等技术学历。',
            detalleRequisitos: '至少18个月电力调度中心、SCADA自动化系统及断路器远动控制经验。',
            funciones: '1号线供电网络24小时全天候监视、远程倒闸操作及与供电电网对接协调。',
            capacitacion: '设备原厂铁路 SCADA 监控平台定制化深造。',
            ubicacion: '第72街运营控制中心 (OCC)',
            tipoContrato: '无固定期限合同',
            salarioEstimado: '3,500,000 - 4,400,000 哥伦比亚比索'
          },
          {
            ...METRO_JOB_AREAS[1].jobs[2],
            title: '暖通空调与给排水技术员',
            requisitoPrincipal: '车站通风、制冷与消防管道网络。',
            detalleRequisitos: '制冷/暖通或给排水专业技术认证，1年以上大型商业或公建项目经验。',
            funciones: '车站轴流风机、离心式冷水机组、自动喷淋消防管网及增压泵组安装维护。',
            capacitacion: '轨道交通应急排烟通风 NFPA 130 规范专项培训。',
            ubicacion: '第72街地下车站及高架车站设备机房',
            tipoContrato: '工程合同 / 固定期限合同',
            salarioEstimado: '2,600,000 - 3,300,000 哥伦比亚比索'
          },
          {
            ...METRO_JOB_AREAS[1].jobs[3],
            title: '车站装饰与结构安装工',
            requisitoPrincipal: '石膏板龙骨、工业防腐涂料及铺装熟练技工。',
            detalleRequisitos: '至少2年商场或大型基础设施公共区域装饰装修经验。',
            funciones: '金属吊顶安装、车站幕墙外挂板拼装、设备房防静电环氧地坪及盲道砖铺设。',
            capacitacion: '持证高处作业安全进阶培训。',
            ubicacion: '各标段车站出入口附属建筑 (1至6标段)',
            tipoContrato: '土建用工合同，提供现场食宿与劳保',
            salarioEstimado: '2,300,000 - 2,900,000 哥伦比亚比索'
          }
        ]
      },
      {
        ...METRO_JOB_AREAS[2],
        name: '3. 土木工程与施工一线领域',
        subtitle: '核心一线基建劳动力 · 高架桥梁与道路改造标段',
        tag: '土木工程',
        description: '高架墩身、盖梁、预制节段箱梁拼装及道路恢复作业的骨干力量。',
        jobs: [
          {
            ...METRO_JOB_AREAS[2].jobs[0],
            title: '土建施工助理与普工',
            requisitoPrincipal: '施工现场基础辅助。具备至少6个月建筑工地经验。',
            detalleRequisitos: '具备基本读写能力，高处作业证有效或可立即培训取证，身体健康。',
            funciones: '配合混凝土浇筑、模板拆装、材料堆放整理、作业面清理及班组后勤协同。',
            capacitacion: '安全生产 (SST) 入场培训、电动工具规范操作与城市道路施工安全。',
            ubicacion: '加拉加斯大道、五月一日大道及博萨工区',
            tipoContrato: '法定全额福利用工合同 + 加班与节假日津贴',
            salarioEstimado: '1,750,000 - 2,100,000 哥伦比亚比索 + 加班费'
          },
          {
            ...METRO_JOB_AREAS[2].jobs[1],
            title: '交通导流与路口协调员',
            requisitoPrincipal: '施工路段交通组织与安全警示（交通疏导方案 PMT）。',
            detalleRequisitos: '高中学历，持有市政交通局颁发的交通疏解与安全警示培训证书。',
            funciones: '加拉加斯大道关键路口车流引导、人行临时通道安全指引与地面公交疏导。',
            capacitacion: '首都交通法规更新与对讲机标准通话用语。',
            ubicacion: '关键交通导流节点（第26、39、57及72街）',
            tipoContrato: '与财团直管施工单位签署',
            salarioEstimado: '1,800,000 - 2,200,000 哥伦比亚比索 + 补贴'
          },
          {
            ...METRO_JOB_AREAS[2].jobs[2],
            title: '大型工程机械操作手',
            requisitoPrincipal: '汽车起重机、旋挖钻机及大型挖掘机驾驶员。',
            detalleRequisitos: '持有有效工程机械驾驶证件，3年以上大型设备操作实操经验，无重大安全记录。',
            funciones: '高架深基坑旋挖桩机作业、节段梁吊装大型汽车吊及履带式挖掘机操作。',
            capacitacion: '架桥机协同作业流程及铁路建筑限界安全红线规范。',
            ubicacion: '高架桥施工作业面及博萨车辆段',
            tipoContrato: '标段施工合同，附设高额工期与安全绩效奖金',
            salarioEstimado: '3,500,000 - 5,200,000 哥伦比亚比索'
          }
        ]
      },
      {
        ...METRO_JOB_AREAS[3],
        name: '4. 专业工程与行政管理领域',
        subtitle: '工程设计、跨学科驻场管理及中西双语协同支持',
        tag: '专业双语',
        description: '工程技术总监部、现场监理、机电系统接口协调及中哥联合企业综合管理。',
        jobs: [
          {
            ...METRO_JOB_AREAS[3].jobs[0],
            title: '土木驻场工程师',
            requisitoPrincipal: '道路桥梁与管网市政工程，持有有效工程执业注册资格。',
            detalleRequisitos: '土木工程本科及以上学历，3年以上桥梁高架或轨道交通工程经验。',
            funciones: '混凝土配比质量监督、架桥机节点工期把控、第三方试验室检测报告审批。',
            capacitacion: 'FIDIC 菲迪克质量控制体系与 BIM 数字化施工进度跟踪软件。',
            ubicacion: '加拉加斯北段工区 / 2标与3标',
            tipoContrato: '无固定期限合同，具备晋升机制',
            salarioEstimado: '5,500,000 - 7,800,000 哥伦比亚比索'
          },
          {
            ...METRO_JOB_AREAS[3].jobs[1],
            title: '接口与网络集成工程师',
            requisitoPrincipal: '技术双语专员（英语中高级 B2 以上水平）。',
            detalleRequisitos: '电子、机电或通信工程专业，具备轨道交通或工业自动化系统集成经验。',
            funciones: '验证中车电动车组与地面连锁设备之间的 CBTC 信号协议、光纤主干及电力接口。',
            capacitacion: '中车控制系统原厂北京与上海专家一对一培训指导。',
            ubicacion: '财团总部大楼 / 第72街控制中心',
            tipoContrato: '无固定期限正式合同',
            salarioEstimado: '6,000,000 - 9,200,000 哥伦比亚比索'
          },
          {
            ...METRO_JOB_AREAS[3].jobs[2],
            title: '综合行政与人力资源专员',
            requisitoPrincipal: '人力资源薪酬、财务对账与双语协调（英语/中文普通话）。',
            detalleRequisitos: '工商管理、财务会计、应用语言学或国际贸易专业。英语流利，懂中文者优先。',
            funciones: '管理4000余名中外员工考勤薪酬、本地人才招聘招聘、工程技术文件双向翻译及与市政部门公文往来。',
            capacitacion: '国际化跨文化企业管理与市政审计公文流程。',
            ubicacion: '第72街财团行政综合大楼',
            tipoContrato: '无固定期限合同',
            salarioEstimado: '4,200,000 - 6,500,000 哥伦比亚比索'
          }
        ]
      }
    ];
  }

  return METRO_JOB_AREAS;
};

export default {
  METRO_JOB_STEPS,
  METRO_JOB_AREAS,
  OFFICIAL_JOB_PORTALS,
  getLocalizedJobSteps,
  getLocalizedJobAreas
};
