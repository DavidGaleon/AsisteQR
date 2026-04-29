// AsisteQR — Módulo compartido: almacenamiento y utilidades
// Cargado antes de cualquier módulo. Expone window.Store y window.Utils.

(function () {

  // ─── Claves de localStorage ───────────────────────────────────────────────
  const KEYS = {
    events:    'asisteqr-events',
    eventSeq:  'asisteqr-event-seq',
    students:  'asisteqr-students',
    attendance:'asisteqr-attendances',
    session:   'asisteqr-session',
    user:      'asisteqr-user'
  };

  // ─── Acceso genérico a localStorage ──────────────────────────────────────
  function getAll(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  }

  function saveAll(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ─── Eventos ──────────────────────────────────────────────────────────────
  function getEvents()          { return getAll(KEYS.events); }
  function saveEvents(events)   { saveAll(KEYS.events, events); }
  function getEventById(id)     { return getEvents().find(e => e.id === id) || null; }

  function nextEventId() {
    const seq = parseInt(localStorage.getItem(KEYS.eventSeq)) || getEvents().length + 1;
    localStorage.setItem(KEYS.eventSeq, String(seq + 1));
    return seq;
  }

  // ─── Estudiantes ──────────────────────────────────────────────────────────
  function getStudents()              { return getAll(KEYS.students); }
  function saveStudents(students)     { saveAll(KEYS.students, students); }
  function getStudentById(id)         { return getStudents().find(s => s.id === id) || null; }
  function getStudentByCedula(cedula) { return getStudents().find(s => s.cedula === cedula) || null; }
  function getStudentByCode(code)     { return getStudents().find(s => s.codigo === code || s.qrCode === code) || null; }

  // ─── Asistencias ──────────────────────────────────────────────────────────
  function getAttendances()         { return getAll(KEYS.attendance); }
  function saveAttendances(list)    { saveAll(KEYS.attendance, list); }

  function getAttendancesByEvent(eventId) {
    return getAttendances().filter(a => a.eventId === eventId);
  }

  function isAlreadyRegistered(studentId, eventId) {
    return getAttendances().some(a => a.studentId === studentId && a.eventId === eventId);
  }

  function addAttendance(record) {
    const list = getAttendances();
    list.push(record);
    saveAttendances(list);
  }

  // ─── Sesión ───────────────────────────────────────────────────────────────
  function getCurrentUser() {
    try { return JSON.parse(sessionStorage.getItem(KEYS.user)) || { username: 'admin', role: 'admin' }; }
    catch { return { username: 'admin', role: 'admin' }; }
  }

  // ─── Config de estado de eventos (única fuente de verdad) ─────────────────
  const ESTADO_CONFIG = {
    programado: { text: 'Programado', class: 'status-programado', color: '#0078D4' },
    activo:     { text: 'Activo',     class: 'status-activo',     color: '#107C10' },
    finalizado: { text: 'Finalizado', class: 'status-finalizado', color: '#999'    }
  };

  function getEstadoConfig(estado) {
    return ESTADO_CONFIG[estado] || ESTADO_CONFIG.programado;
  }


  // ─── Datos iniciales (demo) ───────────────────────────────────────────────
  // Incrementar DEMO_VERSION para forzar recarga automática en todos los navegadores
  const DEMO_VERSION = '3';

  const DEMO_EVENTS = [
    { id:1,  estado:'finalizado', nombre:'Congreso Internacional de Innovacion Tecnologica',
      descripcion:'Conferencias magistrales sobre IA, blockchain, computacion cuantica y desarrollo sostenible con ponentes internacionales.',
      fecha:'2026-02-10', lugar:'Auditorio Central - Campus Norte', codigo:'EVT-2026-001', horaInicio:'08:00', horaFin:'18:00', cupos:500 },
    { id:2,  estado:'finalizado', nombre:'Taller de Emprendimiento Digital',
      descripcion:'Sesion intensiva sobre modelos de negocio digitales, estrategias de marketing online y pitch ante inversores.',
      fecha:'2026-02-18', lugar:'Sala de Innovacion 204 - Edificio B', codigo:'EVT-2026-002', horaInicio:'14:00', horaFin:'17:00', cupos:80 },
    { id:3,  estado:'finalizado', nombre:'Hackathon Universitario - Soluciones Sostenibles',
      descripcion:'48 horas de programacion intensiva para crear soluciones tecnologicas a problematicas ambientales y sociales.',
      fecha:'2026-02-25', lugar:'Laboratorio de Computacion - Piso 3', codigo:'EVT-2026-003', horaInicio:'09:00', horaFin:'18:00', cupos:120 },
    { id:4,  estado:'finalizado', nombre:'Seminario de Inteligencia Artificial Aplicada',
      descripcion:'Aplicaciones practicas de IA en medicina, agricultura, finanzas y educacion con casos de estudio reales.',
      fecha:'2026-03-05', lugar:'Auditorio Principal', codigo:'EVT-2026-004', horaInicio:'10:00', horaFin:'16:00', cupos:300 },
    { id:5,  estado:'finalizado', nombre:'Feria de Proyectos de Investigacion Estudiantil',
      descripcion:'Exposicion de proyectos innovadores desarrollados por estudiantes de todas las facultades ante jurados externos.',
      fecha:'2026-03-12', lugar:'Plaza Central - Campus', codigo:'EVT-2026-005', horaInicio:'08:00', horaFin:'17:00', cupos:800 },
    { id:6,  estado:'finalizado', nombre:'Simposio de Ciberseguridad y Privacidad Digital',
      descripcion:'Expertos en seguridad informatica abordan las principales amenazas del entorno digital y estrategias de proteccion.',
      fecha:'2026-03-20', lugar:'Sala de Conferencias A - Bloque 5', codigo:'EVT-2026-006', horaInicio:'09:00', horaFin:'17:00', cupos:150 },
    { id:7,  estado:'finalizado', nombre:'Jornada de Orientacion Vocacional y Profesional',
      descripcion:'Encuentro con egresados y empresas del sector para orientar a estudiantes sobre oportunidades laborales y de posgrado.',
      fecha:'2026-03-27', lugar:'Centro de Convenciones Universitario', codigo:'EVT-2026-007', horaInicio:'10:00', horaFin:'15:00', cupos:400 },
    { id:8,  estado:'finalizado', nombre:'Workshop de Diseno UX/UI para Aplicaciones Moviles',
      descripcion:'Taller practico de diseno de experiencias de usuario, prototipado en Figma y pruebas de usabilidad.',
      fecha:'2026-04-03', lugar:'Lab. Multimedia - Edificio C', codigo:'EVT-2026-008', horaInicio:'08:00', horaFin:'12:00', cupos:60 },
    { id:9,  estado:'finalizado', nombre:'Conferencia de Salud Mental Universitaria',
      descripcion:'Espacio de sensibilizacion sobre bienestar emocional, manejo del estres academico y recursos de apoyo disponibles.',
      fecha:'2026-04-08', lugar:'Auditorio Facultad de Medicina', codigo:'EVT-2026-009', horaInicio:'14:00', horaFin:'17:00', cupos:250 },
    { id:10, estado:'finalizado', nombre:'Bootcamp de Ciencia de Datos con Python',
      descripcion:'Introduccion intensiva a pandas, visualizacion con matplotlib y machine learning con scikit-learn desde cero.',
      fecha:'2026-04-14', lugar:'Laboratorio de Computacion - Piso 2', codigo:'EVT-2026-010', horaInicio:'08:00', horaFin:'17:00', cupos:40 },
    { id:11, estado:'finalizado', nombre:'Foro de Derecho Digital y Propiedad Intelectual',
      descripcion:'Debate academico sobre regulacion de plataformas digitales, derechos de autor en la era del streaming y la IA.',
      fecha:'2026-04-17', lugar:'Sala de Derecho - Bloque 7', codigo:'EVT-2026-011', horaInicio:'09:00', horaFin:'13:00', cupos:120 },
    { id:12, estado:'finalizado', nombre:'Semana de la Ingenieria - Exposicion Tecnologica',
      descripcion:'Demostracion de proyectos de grado, robotica, impresion 3D y drones por parte de los estudiantes de ingenieria.',
      fecha:'2026-04-22', lugar:'Plazoleta Ingenieria - Campus Sur', codigo:'EVT-2026-012', horaInicio:'10:00', horaFin:'18:00', cupos:1000 },
    { id:13, estado:'activo',     nombre:'Congreso Estudiantil de Liderazgo y Gestion',
      descripcion:'Desarrollo de habilidades de liderazgo, trabajo en equipo y comunicacion asertiva con dinamicas experienciales.',
      fecha:'2026-04-28', lugar:'Salon Comunal - Edificio A', codigo:'EVT-2026-013', horaInicio:'08:00', horaFin:'17:00', cupos:200 },
    { id:14, estado:'activo',     nombre:'Charla: Oportunidades de Intercambio Internacional',
      descripcion:'Informacion sobre becas, doble titulacion, semestres en el exterior y convenios con universidades de 30 paises.',
      fecha:'2026-04-28', lugar:'Auditorio Relaciones Internacionales', codigo:'EVT-2026-014', horaInicio:'14:00', horaFin:'16:00', cupos:180 },
    { id:15, estado:'programado', nombre:'Taller de Finanzas Personales para Universitarios',
      descripcion:'Conceptos practicos de presupuesto, ahorro, inversion y manejo responsable del credito para estudiantes.',
      fecha:'2026-05-06', lugar:'Sala Multiple - Bienestar Universitario', codigo:'EVT-2026-015', horaInicio:'15:00', horaFin:'17:00', cupos:100 },
    { id:16, estado:'programado', nombre:'Hackathon de Salud Digital - HealthTech',
      descripcion:'Reto de innovacion enfocado en soluciones tecnologicas para el sector salud: apps, wearables y telemedicina.',
      fecha:'2026-05-09', lugar:'Centro de Innovacion - Bloque Nuevo', codigo:'EVT-2026-016', horaInicio:'08:00', horaFin:'20:00', cupos:90 },
    { id:17, estado:'programado', nombre:'Seminario Internacional de Sostenibilidad Ambiental',
      descripcion:'Expertos nacionales e internacionales debaten sobre cambio climatico, economia circular y energias renovables.',
      fecha:'2026-05-14', lugar:'Auditorio Central - Campus Norte', codigo:'EVT-2026-017', horaInicio:'09:00', horaFin:'17:00', cupos:400 },
    { id:18, estado:'programado', nombre:'Jornada de Simulacros de Entrevistas de Trabajo',
      descripcion:'Sesiones individuales y grupales con reclutadores reales para practicar entrevistas tecnicas y de competencias.',
      fecha:'2026-05-20', lugar:'Sala de Empleabilidad - Facultad de Negocios', codigo:'EVT-2026-018', horaInicio:'08:00', horaFin:'13:00', cupos:70 },
    { id:19, estado:'programado', nombre:'Competencia Interuniversitaria de Programacion (ICPC)',
      descripcion:'Fase clasificatoria regional del concurso de programacion competitiva mas prestigioso a nivel universitario mundial.',
      fecha:'2026-05-24', lugar:'Laboratorio de Computacion - Piso 3', codigo:'EVT-2026-019', horaInicio:'09:00', horaFin:'14:00', cupos:80 },
    { id:20, estado:'programado', nombre:'Ceremonia de Grados - Primer Semestre 2026',
      descripcion:'Acto solemne de graduacion para los egresados de todas las facultades del primer semestre del año 2026.',
      fecha:'2026-05-30', lugar:'Coliseo Universitario', codigo:'EVT-2026-020', horaInicio:'10:00', horaFin:'13:00', cupos:2000 }
  ];

  const DEMO_STUDENTS = [
    { id:1,  cedula:'1001234567', codigo:'JMRG567', primerNombre:'Juan',      segundoNombre:'Manuel',
      primerApellido:'Rodriguez', segundoApellido:'Garcia',    nombre:'Juan Manuel Rodriguez Garcia',
      correo:'juan.rodriguez@universidad.edu.co',  carrera:'Ingenieria de Sistemas',    semestre:'8', fechaRegistro:'2026-01-10T10:30:00', qrCode:'JMRG567' },
    { id:2,  cedula:'1001234890', codigo:'MALM890', primerNombre:'Maria',     segundoNombre:'Andrea',
      primerApellido:'Lopez',     segundoApellido:'Martinez',  nombre:'Maria Andrea Lopez Martinez',
      correo:'maria.lopez@universidad.edu.co',     carrera:'Ingenieria Industrial',     semestre:'6', fechaRegistro:'2026-01-11T11:00:00', qrCode:'MALM890' },
    { id:3,  cedula:'1001235123', codigo:'CAGS123', primerNombre:'Carlos',    segundoNombre:'Alberto',
      primerApellido:'Gonzalez',  segundoApellido:'Sanchez',   nombre:'Carlos Alberto Gonzalez Sanchez',
      correo:'carlos.gonzalez@universidad.edu.co', carrera:'Administracion de Empresas', semestre:'5', fechaRegistro:'2026-01-12T09:00:00', qrCode:'CAGS123' },
    { id:4,  cedula:'1001235456', codigo:'LFH456',  primerNombre:'Laura',     segundoNombre:'',
      primerApellido:'Hernandez', segundoApellido:'',          nombre:'Laura Hernandez',
      correo:'laura.hernandez@universidad.edu.co', carrera:'Psicologia',                semestre:'3', fechaRegistro:'2026-01-13T14:00:00', qrCode:'LFH456' },
    { id:5,  cedula:'1001235789', codigo:'DASM789', primerNombre:'Diego',     segundoNombre:'Alejandro',
      primerApellido:'Sanchez',   segundoApellido:'Morales',   nombre:'Diego Alejandro Sanchez Morales',
      correo:'diego.sanchez@universidad.edu.co',   carrera:'Ingenieria Electronica',    semestre:'7', fechaRegistro:'2026-01-14T10:00:00', qrCode:'DASM789' },
    { id:6,  cedula:'1001236100', codigo:'ACMG100', primerNombre:'Andrea',    segundoNombre:'Carolina',
      primerApellido:'Morales',   segundoApellido:'Gutierrez', nombre:'Andrea Carolina Morales Gutierrez',
      correo:'andrea.morales@universidad.edu.co',  carrera:'Medicina',                  semestre:'4', fechaRegistro:'2026-01-15T08:30:00', qrCode:'ACMG100' },
    { id:7,  cedula:'1001236200', codigo:'LFGP200', primerNombre:'Luis',      segundoNombre:'Fernando',
      primerApellido:'Garcia',    segundoApellido:'Perez',     nombre:'Luis Fernando Garcia Perez',
      correo:'luis.garcia@universidad.edu.co',     carrera:'Derecho',                   semestre:'6', fechaRegistro:'2026-01-16T09:15:00', qrCode:'LFGP200' },
    { id:8,  cedula:'1001236300', codigo:'VJRS300', primerNombre:'Valentina', segundoNombre:'Jimena',
      primerApellido:'Ruiz',      segundoApellido:'Salcedo',   nombre:'Valentina Jimena Ruiz Salcedo',
      correo:'valentina.ruiz@universidad.edu.co',  carrera:'Diseno Grafico',            semestre:'5', fechaRegistro:'2026-01-17T11:45:00', qrCode:'VJRS300' },
    { id:9,  cedula:'1001236400', codigo:'SEOP400', primerNombre:'Santiago',  segundoNombre:'Esteban',
      primerApellido:'Ospina',    segundoApellido:'Pineda',    nombre:'Santiago Esteban Ospina Pineda',
      correo:'santiago.ospina@universidad.edu.co', carrera:'Ingenieria Civil',          semestre:'9', fechaRegistro:'2026-01-18T13:00:00', qrCode:'SEOP400' },
    { id:10, cedula:'1001236500', codigo:'NMTC500', primerNombre:'Natalia',   segundoNombre:'Melissa',
      primerApellido:'Torres',    segundoApellido:'Castillo',  nombre:'Natalia Melissa Torres Castillo',
      correo:'natalia.torres@universidad.edu.co',  carrera:'Contaduria Publica',        semestre:'2', fechaRegistro:'2026-01-19T15:30:00', qrCode:'NMTC500' }
  ];

  function buildDemoAttendances() {
    const rows = [
      // EVT-001: 8 asistencias
      { ev:1, st:1,  ts:'2026-02-10T08:15:00', lat:4.6102, lng:-74.0820, acc:8,  dist:5  },
      { ev:1, st:2,  ts:'2026-02-10T08:22:00', lat:4.6103, lng:-74.0821, acc:10, dist:8  },
      { ev:1, st:3,  ts:'2026-02-10T09:05:00', lat:4.6101, lng:-74.0819, acc:7,  dist:4  },
      { ev:1, st:4,  ts:'2026-02-10T09:30:00', lat:4.6104, lng:-74.0822, acc:12, dist:11 },
      { ev:1, st:5,  ts:'2026-02-10T10:10:00', lat:4.6100, lng:-74.0818, acc:9,  dist:7  },
      { ev:1, st:6,  ts:'2026-02-10T10:45:00', lat:4.6105, lng:-74.0823, acc:11, dist:9  },
      { ev:1, st:7,  ts:'2026-02-10T11:20:00', lat:4.6099, lng:-74.0817, acc:8,  dist:6  },
      { ev:1, st:8,  ts:'2026-02-10T11:55:00', lat:4.6106, lng:-74.0824, acc:13, dist:14 },
      // EVT-002: 5 asistencias
      { ev:2, st:1,  ts:'2026-02-18T14:05:00', lat:4.6110, lng:-74.0810, acc:9,  dist:6  },
      { ev:2, st:3,  ts:'2026-02-18T14:12:00', lat:4.6111, lng:-74.0811, acc:11, dist:9  },
      { ev:2, st:5,  ts:'2026-02-18T14:30:00', lat:4.6109, lng:-74.0809, acc:8,  dist:5  },
      { ev:2, st:9,  ts:'2026-02-18T15:00:00', lat:4.6112, lng:-74.0812, acc:14, dist:18 },
      { ev:2, st:10, ts:'2026-02-18T15:20:00', lat:4.6108, lng:-74.0808, acc:10, dist:7  },
      // EVT-003: 6 asistencias
      { ev:3, st:2,  ts:'2026-02-25T09:10:00', lat:4.6095, lng:-74.0815, acc:7,  dist:3  },
      { ev:3, st:4,  ts:'2026-02-25T09:25:00', lat:4.6096, lng:-74.0816, acc:9,  dist:5  },
      { ev:3, st:6,  ts:'2026-02-25T10:00:00', lat:4.6094, lng:-74.0814, acc:12, dist:10 },
      { ev:3, st:7,  ts:'2026-02-25T10:30:00', lat:4.6097, lng:-74.0817, acc:8,  dist:4  },
      { ev:3, st:8,  ts:'2026-02-25T11:00:00', lat:4.6093, lng:-74.0813, acc:15, dist:20 },
      { ev:3, st:10, ts:'2026-02-25T11:45:00', lat:4.6098, lng:-74.0818, acc:10, dist:8  },
      // EVT-004: 7 asistencias
      { ev:4, st:1,  ts:'2026-03-05T10:05:00', lat:4.6102, lng:-74.0820, acc:8,  dist:5  },
      { ev:4, st:2,  ts:'2026-03-05T10:15:00', lat:4.6103, lng:-74.0821, acc:9,  dist:6  },
      { ev:4, st:3,  ts:'2026-03-05T10:30:00', lat:4.6101, lng:-74.0819, acc:11, dist:9  },
      { ev:4, st:5,  ts:'2026-03-05T11:00:00', lat:4.6104, lng:-74.0822, acc:7,  dist:4  },
      { ev:4, st:6,  ts:'2026-03-05T11:20:00', lat:4.6100, lng:-74.0818, acc:13, dist:12 },
      { ev:4, st:9,  ts:'2026-03-05T12:00:00', lat:4.6105, lng:-74.0823, acc:10, dist:8  },
      { ev:4, st:10, ts:'2026-03-05T12:30:00', lat:4.6099, lng:-74.0817, acc:9,  dist:7  },
      // EVT-005: 4 asistencias
      { ev:5, st:3,  ts:'2026-03-12T08:20:00', lat:4.6108, lng:-74.0825, acc:8,  dist:5  },
      { ev:5, st:4,  ts:'2026-03-12T08:45:00', lat:4.6109, lng:-74.0826, acc:11, dist:10 },
      { ev:5, st:7,  ts:'2026-03-12T09:10:00', lat:4.6107, lng:-74.0824, acc:9,  dist:6  },
      { ev:5, st:8,  ts:'2026-03-12T09:30:00', lat:4.6110, lng:-74.0827, acc:14, dist:16 },
      // EVT-006: 5 asistencias
      { ev:6, st:1,  ts:'2026-03-20T09:05:00', lat:4.6115, lng:-74.0830, acc:7,  dist:4  },
      { ev:6, st:2,  ts:'2026-03-20T09:20:00', lat:4.6116, lng:-74.0831, acc:10, dist:8  },
      { ev:6, st:5,  ts:'2026-03-20T10:00:00', lat:4.6114, lng:-74.0829, acc:9,  dist:6  },
      { ev:6, st:6,  ts:'2026-03-20T10:30:00', lat:4.6117, lng:-74.0832, acc:12, dist:11 },
      { ev:6, st:9,  ts:'2026-03-20T11:00:00', lat:4.6113, lng:-74.0828, acc:8,  dist:5  },
      // EVT-007: 4 asistencias
      { ev:7, st:2,  ts:'2026-03-27T10:10:00', lat:4.6120, lng:-74.0835, acc:11, dist:9  },
      { ev:7, st:4,  ts:'2026-03-27T10:25:00', lat:4.6121, lng:-74.0836, acc:8,  dist:5  },
      { ev:7, st:8,  ts:'2026-03-27T11:00:00', lat:4.6119, lng:-74.0834, acc:13, dist:13 },
      { ev:7, st:10, ts:'2026-03-27T11:30:00', lat:4.6122, lng:-74.0837, acc:10, dist:8  },
      // EVT-008: 5 asistencias
      { ev:8, st:1,  ts:'2026-04-03T08:05:00', lat:4.6090, lng:-74.0810, acc:7,  dist:3  },
      { ev:8, st:3,  ts:'2026-04-03T08:15:00', lat:4.6091, lng:-74.0811, acc:9,  dist:6  },
      { ev:8, st:5,  ts:'2026-04-03T08:30:00', lat:4.6089, lng:-74.0809, acc:11, dist:9  },
      { ev:8, st:7,  ts:'2026-04-03T09:00:00', lat:4.6092, lng:-74.0812, acc:8,  dist:5  },
      { ev:8, st:9,  ts:'2026-04-03T09:20:00', lat:4.6088, lng:-74.0808, acc:14, dist:17 },
      // EVT-009: 3 asistencias
      { ev:9, st:4,  ts:'2026-04-08T14:05:00', lat:4.6125, lng:-74.0840, acc:9,  dist:6  },
      { ev:9, st:6,  ts:'2026-04-08T14:20:00', lat:4.6126, lng:-74.0841, acc:12, dist:11 },
      { ev:9, st:8,  ts:'2026-04-08T14:45:00', lat:4.6124, lng:-74.0839, acc:10, dist:8  },
      // EVT-010: 4 asistencias
      { ev:10, st:1, ts:'2026-04-14T08:10:00', lat:4.6095, lng:-74.0815, acc:7,  dist:4  },
      { ev:10, st:2, ts:'2026-04-14T08:20:00', lat:4.6096, lng:-74.0816, acc:10, dist:7  },
      { ev:10, st:5, ts:'2026-04-14T08:35:00', lat:4.6094, lng:-74.0814, acc:9,  dist:5  },
      { ev:10, st:7, ts:'2026-04-14T09:00:00', lat:4.6097, lng:-74.0817, acc:13, dist:12 },
      // EVT-011: 3 asistencias
      { ev:11, st:3, ts:'2026-04-17T09:05:00', lat:4.6130, lng:-74.0845, acc:8,  dist:5  },
      { ev:11, st:6, ts:'2026-04-17T09:15:00', lat:4.6131, lng:-74.0846, acc:11, dist:9  },
      { ev:11, st:10,ts:'2026-04-17T09:40:00', lat:4.6129, lng:-74.0844, acc:9,  dist:6  },
      // EVT-012: 6 asistencias
      { ev:12, st:1, ts:'2026-04-22T10:05:00', lat:4.6085, lng:-74.0805, acc:8,  dist:5  },
      { ev:12, st:2, ts:'2026-04-22T10:15:00', lat:4.6086, lng:-74.0806, acc:10, dist:7  },
      { ev:12, st:3, ts:'2026-04-22T10:30:00', lat:4.6084, lng:-74.0804, acc:9,  dist:6  },
      { ev:12, st:4, ts:'2026-04-22T11:00:00', lat:4.6087, lng:-74.0807, acc:12, dist:10 },
      { ev:12, st:8, ts:'2026-04-22T11:20:00', lat:4.6083, lng:-74.0803, acc:7,  dist:4  },
      { ev:12, st:9, ts:'2026-04-22T11:45:00', lat:4.6088, lng:-74.0808, acc:14, dist:15 }
    ];
    return rows.map((r, i) => ({
      id:          i + 1,
      eventId:     r.ev,
      studentId:   r.st,
      encargado:   'admin',
      timestamp:   r.ts,
      nota:        r.dist > 15 ? 'Fuera del radio recomendado (' + r.dist + 'm del evento)' : null,
      fueraDeRadio: r.dist > 30,
      location:    { lat: r.lat, lng: r.lng, accuracy: r.acc, distance: r.dist }
    }));
  }

  function ensureDemoData() {
    // Fuerza recarga si la version de datos cambio (limpia datos de versiones anteriores)
    if (localStorage.getItem('asisteqr-demo-version') !== DEMO_VERSION) {
      localStorage.removeItem(KEYS.events);
      localStorage.removeItem(KEYS.students);
      localStorage.removeItem(KEYS.attendance);
      localStorage.removeItem(KEYS.eventSeq);
      localStorage.setItem('asisteqr-demo-version', DEMO_VERSION);
    }
    if (!localStorage.getItem(KEYS.events)) {
      saveAll(KEYS.events, DEMO_EVENTS);
      localStorage.setItem(KEYS.eventSeq, String(DEMO_EVENTS.length + 1));
    }
    if (!localStorage.getItem(KEYS.students)) {
      saveAll(KEYS.students, DEMO_STUDENTS);
    }
    if (!localStorage.getItem(KEYS.attendance)) {
      saveAll(KEYS.attendance, buildDemoAttendances());
    }
  }

  // ─── API pública ──────────────────────────────────────────────────────────
  window.Store = {
    KEYS,
    // Eventos
    getEvents, saveEvents, getEventById, nextEventId,
    // Estudiantes
    getStudents, saveStudents, getStudentById, getStudentByCedula, getStudentByCode,
    // Asistencias
    getAttendances, saveAttendances, getAttendancesByEvent, isAlreadyRegistered, addAttendance,
    // Sesión
    getCurrentUser,
    // Estado config
    getEstadoConfig, ESTADO_CONFIG,
    // Demo
    ensureDemoData
  };

})();
