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

    if (l === "ja") {
    return [
      {
        step: 1,
        title: "1. 公式プラットフォームでの履歴書登録",
        summary: "ボゴタ市公共雇用局 (Bogotá Trabaja) または El Empleo",
        desc: "ボゴタ市の雇用ポータルまたはEl Empleo公式特設サイトに最新の連絡先情報とともにプロフィール・履歴書を登録します。",
        detail: "ボゴタ市庁およびメトロ1号線コンソーシアムの協定による公募選考における必須の第1ステップです。",
        actionLabel: "bogotatrabaja.gov.co へ移動",
        url: "https://bogotatrabaja.gov.co/",
        badge: "必須ステップ"
      },
      {
        step: 2,
        title: "2. 募集求人の検索・絞り込み",
        summary: "「Consorcio Metro Línea 1」公募または就職フェア",
        desc: "「Consorcio Metro Línea 1」や「Empresa Metro de Bogotá」のキーワードで検索するか、ボサ地区やケネディ地区の対面雇用フェアに参加します。",
        detail: "各工事区間の進捗状況および運行準備フェーズに応じて求人が定期的に公開されます。",
        actionLabel: "El Empleo で求人を見る",
        url: "https://www.elempleo.com/co/sitio-empresarial/consorcio-metro-linea-1",
        badge: "区間別検索"
      },
      {
        step: 3,
        title: "3. 正式応募と必要書類の提出",
        summary: "履歴書、身分証明書、必要資格証明書",
        desc: "身分証明書のコピー、高校卒業証書または技術修了証、職歴証明書（必要職種のみ）を添付します。",
        detail: "運行・駅務の基本職種は【事前実務経験不問】です。基礎的な学歴書類のみで応募可能です。",
        actionLabel: "必要書類の詳細を確認",
        badge: "書類審査"
      },
      {
        step: 4,
        title: "4. 選考と全額給与支給の技術研修",
        summary: "面接、適性検査・健康診断、専門シミュレーター研修",
        desc: "書類選考通過後、面接と健康診断を経て、会社全額負担の充実した専門技術研修プログラムを受講します。",
        detail: "ボサ車両基地のシミュレーター研修および本線軌道実習期間中も生活手当・給与が100%保障されます。",
        badge: "採用・契約締結"
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

    if (l === "ja") {
    return [
      {
        ...METRO_JOB_AREAS[0],
        name: "1. 運行管理・駅務部門",
        subtitle: "実務未経験歓迎 · 会社負担の有給研修制度完備",
        tag: "未経験歓迎",
        description: "高架線、プラットホーム、運転台での運行・旅客サービス業務。コンソーシアム全額負担の公認技術研修が提供されます。",
        jobs: [
          {
            ...METRO_JOB_AREAS[0].jobs[0],
            title: "地下鉄運転士 (GoA4自動運転)",
            requisitoPrincipal: "応募要件: 高卒以上。事前実務経験不問。",
            detalleRequisitos: "18歳以上、ボサ車両基地および高架線での交代制勤務（シフト制）が可能な方。",
            funciones: "GoA4自動運転モード下での支援操縦、ドア開閉監視、始発前の点検作業、非常時安全プロトコル対応。",
            capacitacion: "ボサ車両基地の最先端キネマティックシミュレーターによる240時間の専門研修（研修中も給与全額支給）。",
            ubicacion: "ボサ車両基地 (Patio Taller) / 1号線高架区間",
            tipoContrato: "資格取得後、無期雇用契約（正社員）",
            salarioEstimado: "$2,600,000 - $3,400,000 COP + 法定福利厚生 + 夜勤手当"
          },
          {
            ...METRO_JOB_AREAS[0].jobs[1],
            title: "駅務・ステーションアシスタント",
            requisitoPrincipal: "応募要件: 高卒以上。カスタマーサービスおよび改札・誘導業務。",
            detalleRequisitos: "丁寧な接客マナー、コミュニケーション能力、乗客への親切な案内ができる方。",
            funciones: "改札口やホームでの乗客案内、ホームドア(PSD)の安全確認、車いす等の移動円滑化支援、初期応急救護。",
            capacitacion: "接客サービス、緊急時対応、バリアフリー支援に関する80時間の総合研修。",
            ubicacion: "1号線全16駅（ボサ〜72番街）",
            tipoContrato: "コンソーシアム直接雇用",
            salarioEstimado: "$1,850,000 - $2,200,000 COP + 法定福利厚生"
          },
          {
            ...METRO_JOB_AREAS[0].jobs[2],
            title: "指令通信管制員",
            requisitoPrincipal: "応募要件: 高卒以上。コールセンターまたは電話対応経験者優遇。",
            detalleRequisitos: "明瞭な発声、傾聴力、緊急時プロトコルに沿った迅速な報告・指示ができる方。",
            funciones: "車内・構内インターホン監視、列車および駅構内での案内放送、警察・総合指令所(OCC)との治安連携。",
            capacitacion: "TETRAデジタル無線通信コンソールおよびCCTV監視システムの操作研修。",
            ubicacion: "72番街運行管理センター (OCC)",
            tipoContrato: "更新制有期雇用（正社員登用制度あり）",
            salarioEstimado: "$2,100,000 - $2,600,000 COP + 法定福利厚生"
          }
        ]
      },
      {
        ...METRO_JOB_AREAS[1],
        name: "2. 技術・インフラ保全部門",
        subtitle: "技術系専攻修了および実務経験必須",
        tag: "技術・保全",
        description: "電車線給電設備、配管設備、駅舎空調、建築設備の安全稼働を支える技術者チーム。",
        jobs: [
          {
            ...METRO_JOB_AREAS[1].jobs[0],
            title: "電気・制御保全技術者",
            requisitoPrincipal: "変電設備・強電配線。電気工事士資格保持者。",
            detalleRequisitos: "中高圧電気、受配電盤配線、産業用配線工事において1年以上の実務経験。",
            funciones: "直流整流変電所(750V/1500V DC)の据付試験、第3軌条・剛体電車線および接地システムの敷設点検。",
            capacitacion: "NFPA 70E電気安全基準および国際鉄道規格の認定講習。",
            ubicacion: "受電変電所 (SET) および高架区間",
            tipoContrato: "工事契約 / 各種保険完備の固定契約",
            salarioEstimado: "$2,900,000 - $3,800,000 COP"
          },
          {
            ...METRO_JOB_AREAS[1].jobs[1],
            title: "電力系統給電指令員",
            requisitoPrincipal: "電気、電気機械工学等の高等技術士修了者。",
            detalleRequisitos: "電力指令センター、SCADA自動化システム運用において18ヶ月以上の実務経験。",
            funciones: "1号線牽引電力系統の24時間監視、遠隔開閉器操作、電力会社との受電調整。",
            capacitacion: "システム製造元による鉄道SCADAプラットフォームの専門講習。",
            ubicacion: "72番街総合指令所 (OCC)",
            tipoContrato: "無期雇用契約",
            salarioEstimado: "$3,500,000 - $4,400,000 COP"
          },
          {
            ...METRO_JOB_AREAS[1].jobs[2],
            title: "空調・給排水設備技術者",
            requisitoPrincipal: "駅舎換気、空調冷却、消火配管設備。",
            detalleRequisitos: "空調冷熱または衛生給排水の公的認定、大型施設で1年以上の実務経験。",
            funciones: "排煙軸流ファン、大型チラー設備、スプリンクラー消火配管、加圧ポンプの点検整備。",
            capacitacion: "地下鉄道防災換気基準 NFPA 130 専門講習。",
            ubicacion: "72番街地下駅および高架駅機械室",
            tipoContrato: "工事契約 / 有期雇用契約",
            salarioEstimado: "$2,600,000 - $3,300,000 COP"
          },
          {
            ...METRO_JOB_AREAS[1].jobs[3],
            title: "駅舎内装・建築施工技能士",
            requisitoPrincipal: "軽天ボード、工業塗装、タイル施工熟練工。",
            detalleRequisitos: "大型商業施設や公共インフラの内装仕上げで2年以上の実務経験。",
            funciones: "天井パネル施工、外壁パネル取付、電気室防静電塗装、視覚障害者用誘導ブロック敷設。",
            capacitacion: "高所作業従事安全講習修了証取得。",
            ubicacion: "各工区の駅出入口施設 (1〜6工区)",
            tipoContrato: "労災・装備・現場食事付き工事契約",
            salarioEstimado: "$2,300,000 - $2,900,000 COP"
          }
        ]
      },
      {
        ...METRO_JOB_AREAS[2],
        name: "3. 土木・建設工事現場部門",
        subtitle: "現場主力作業員 · 高架橋梁と道路改修工区",
        tag: "土木・架橋",
        description: "橋脚、梁、プレキャストセグメント架設、街路復旧を担う最前線の建設チーム。",
        jobs: [
          {
            ...METRO_JOB_AREAS[2].jobs[0],
            title: "土木作業員・現場アシスタント",
            requisitoPrincipal: "建設現場補助業務。土木現場経験6ヶ月以上。",
            detalleRequisitos: "読み書きができ、高所作業資格保持または研修受講可能な健康な方。",
            funciones: "コンクリート打設補助、型枠脱着、資材運搬整理、作業面清掃、班長補助。",
            capacitacion: "労働安全衛生 (SST) 入場教育、電動工具安全取扱教育。",
            ubicacion: "カラカス通り、5月1日通り、ボサ工区",
            tipoContrato: "法定福利厚生完備契約 + 残業・休日手当",
            salarioEstimado: "$1,750,000 - $2,100,000 COP + 残業手当"
          },
          {
            ...METRO_JOB_AREAS[2].jobs[1],
            title: "交通誘導員・交差点保安員",
            requisitoPrincipal: "工事区間での車両・歩行者交通誘導 (PMT計画遵守)。",
            detalleRequisitos: "高卒以上。市交通局公認の交通誘導・保安員講習修了者。",
            funciones: "カラカス通りの主要交差点での車両誘導、仮設歩行者通路の安全確保。",
            capacitacion: "最新交通法規および無線通信プロトコル講習。",
            ubicacion: "主要交通結節点 (26番街、39番街、57番街、72番街)",
            tipoContrato: "コンソーシアム直轄施工契約",
            salarioEstimado: "$1,800,000 - $2,200,000 COP + 交通手当"
          },
          {
            ...METRO_JOB_AREAS[2].jobs[2],
            title: "大型重機オペレーター",
            requisitoPrincipal: "クレーン、杭打機、大型油圧ショベル操縦士。",
            detalleRequisitos: "該当重機免許保持、大型機実務3年以上、無事故実績。",
            funciones: "深礎杭打機操作、大型クローラクレーンによる桁材揚重、掘削機操作。",
            capacitacion: "架橋機連携作業手順および鉄道近接施工安全基準。",
            ubicacion: "高架橋工事現場およびボサ車両基地",
            tipoContrato: "出来高・安全実績手当付き工事契約",
            salarioEstimado: "$3,500,000 - $5,200,000 COP"
          }
        ]
      },
      {
        ...METRO_JOB_AREAS[3],
        name: "4. 専門エンジニア・管理部門",
        subtitle: "設計監理、現場統括および多言語バイリンガル協働",
        tag: "専門・管理",
        description: "技術総括部、現場監理、機電インターフェース調整、国際共同企業体運営管理。",
        jobs: [
          {
            ...METRO_JOB_AREAS[3].jobs[0],
            title: "土木常駐監理エンジニア",
            requisitoPrincipal: "橋梁・道路・都市土木。技術士資格保持者。",
            detalleRequisitos: "土木工学学士以上、橋梁高架または鉄道工事で3年以上の実務経験。",
            funciones: "コンクリート品質管理、架橋機施工進捗監督、外部検査機関試験成績書の審査承認。",
            capacitacion: "FIDIC約款品質管理体系およびBIM施工管理ソフトウェア講習。",
            ubicacion: "カラカス北工区 / 第2・第3工区",
            tipoContrato: "無期雇用契約（昇進制度あり）",
            salarioEstimado: "$5,500,000 - $7,800,000 COP"
          },
          {
            ...METRO_JOB_AREAS[3].jobs[1],
            title: "システム統合・インターフェース技術者",
            requisitoPrincipal: "英語上級 (B2以上) の技術バイリンガル専任者。",
            detalleRequisitos: "電子、機電、情報通信専攻。鉄道または産業自動化統合経験者。",
            funciones: "車両(CRRC)と地上設備間のCBTC信号プロトコル、光ネットワーク、給電連携の検証。",
            capacitacion: "CRRC製造元専門家による1対1技術指導。",
            ubicacion: "コンソーシアム本部ビル / 72番街指令所",
            tipoContrato: "無期雇用契約",
            salarioEstimado: "$6,000,000 - $9,200,000 COP"
          },
          {
            ...METRO_JOB_AREAS[3].jobs[2],
            title: "総務・労務・人事バイリンガルスペシャリスト",
            requisitoPrincipal: "給与計算、労務管理、語学コーディネート（英語／スペイン語／中国語）。",
            detalleRequisitos: "経営、労務、国際ビジネス、応用言語学専攻。多言語能力保持者。",
            funciones: "4,000名超の社員勤怠管理、地元採用募集、技術文書の翻訳、行政機関との公文書対応。",
            capacitacion: "異文化企業マネジメントおよび自治体監査プロトコル研修。",
            ubicacion: "72番街コンソーシアム本部ビル",
            tipoContrato: "無期雇用契約",
            salarioEstimado: "$4,200,000 - $6,500,000 COP"
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
