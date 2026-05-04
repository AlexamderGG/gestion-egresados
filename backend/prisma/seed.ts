// backend/prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding con datos robustos para dashboard...');

  // Limpiar tablas (orden inverso por dependencias)
  await prisma.auditoriaLog.deleteMany();
  await prisma.reporte.deleteMany();
  await prisma.notificacion.deleteMany();
  await prisma.historialEstado.deleteMany();
  await prisma.postulacion.deleteMany();
  await prisma.ofertaHabilidad.deleteMany();
  await prisma.oferta.deleteMany();
  await prisma.egresadoHabilidad.deleteMany();
  await prisma.egresado.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.user.deleteMany();
  await prisma.habilidad.deleteMany();

  // ----- HABILIDADES (catálogo) -----
  const habilidadesData = [
    // Técnicas
    { nombre: 'JavaScript', categoria: 'tecnica' },
    { nombre: 'TypeScript', categoria: 'tecnica' },
    { nombre: 'React', categoria: 'tecnica' },
    { nombre: 'Node.js', categoria: 'tecnica' },
    { nombre: 'Python', categoria: 'tecnica' },
    { nombre: 'Django', categoria: 'tecnica' },
    { nombre: 'Java', categoria: 'tecnica' },
    { nombre: 'Spring Boot', categoria: 'tecnica' },
    { nombre: 'SQL', categoria: 'tecnica' },
    { nombre: 'MongoDB', categoria: 'tecnica' },
    { nombre: 'AWS', categoria: 'tecnica' },
    { nombre: 'Docker', categoria: 'tecnica' },
    // Blandas
    { nombre: 'Trabajo en equipo', categoria: 'blanda' },
    { nombre: 'Comunicación efectiva', categoria: 'blanda' },
    { nombre: 'Liderazgo', categoria: 'blanda' },
    { nombre: 'Resolución de problemas', categoria: 'blanda' },
    { nombre: 'Adaptabilidad', categoria: 'blanda' },
  ];
  await prisma.habilidad.createMany({ data: habilidadesData });
  console.log(`✅ ${habilidadesData.length} habilidades creadas`);

  const allSkills = await prisma.habilidad.findMany();
  const skillMap = Object.fromEntries(allSkills.map(s => [s.nombre, s.id]));

  // ----- USUARIO ADMIN (ya existía) -----
  const adminPass = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: adminPass,
      role: 'admin',
    },
  });
  console.log('✅ Admin creado');

  // ----- EMPRESAS (5 empresas de ejemplo) -----
  const empresasRaw = [
    { nombreEmpresa: 'TechCorp S.A.', sector: 'Tecnología', ubicacion: 'Lima, Perú', website: 'https://techcorp.com' },
    { nombreEmpresa: 'Innovatech Solutions', sector: 'Software', ubicacion: 'Arequipa, Perú', website: 'https://innovatech.pe' },
    { nombreEmpresa: 'DataSys Peru', sector: 'Data Science', ubicacion: 'Lima, Perú', website: 'https://datasys.pe' },
    { nombreEmpresa: 'Consultora Estratégica', sector: 'Consultoría', ubicacion: 'Cusco, Perú', website: 'https://conest.pe' },
    { nombreEmpresa: 'Startup Hub', sector: 'Emprendimiento', ubicacion: 'Trujillo, Perú', website: 'https://startuphub.com' },
  ];
  const empresas = [];
  for (const emp of empresasRaw) {
    const pass = await bcrypt.hash('empresa123', 10);
    const user = await prisma.user.create({
      data: {
        email: `contacto@${emp.nombreEmpresa.toLowerCase().replace(/\s/g, '')}.com`,
        passwordHash: pass,
        role: 'empresa',
        empresa: {
          create: {
            nombreEmpresa: emp.nombreEmpresa,
            sector: emp.sector,
            ubicacion: emp.ubicacion,
            website: emp.website,
          },
        },
      },
      include: { empresa: true },
    });
    empresas.push(user.empresa);
  }
  console.log(`✅ ${empresas.length} empresas creadas`);

  // ----- EGRESADOS (10 egresados con diferentes datos) -----
  const egresadosRaw = [
    { email: 'juan.perez@example.com', nombres: 'Juan', apellidos: 'Pérez', carrera: 'Ingeniería de Software', anioEgreso: 2023, habilidadesBlandas: 'Liderazgo, adaptabilidad', habilidadesIds: [skillMap['JavaScript'], skillMap['React'], skillMap['Node.js']] },
    { email: 'maria.gomez@example.com', nombres: 'María', apellidos: 'Gómez', carrera: 'Ciencia de Datos', anioEgreso: 2024, habilidadesBlandas: 'Comunicación, trabajo en equipo', habilidadesIds: [skillMap['Python'], skillMap['SQL'], skillMap['MongoDB']] },
    { email: 'carlos.ruiz@example.com', nombres: 'Carlos', apellidos: 'Ruiz', carrera: 'Ingeniería Informática', anioEgreso: 2022, habilidadesBlandas: 'Resolución de problemas', habilidadesIds: [skillMap['Java'], skillMap['Spring Boot'], skillMap['SQL']] },
    { email: 'laura.torres@example.com', nombres: 'Laura', apellidos: 'Torres', carrera: 'Sistemas', anioEgreso: 2021, habilidadesIds: [skillMap['TypeScript'], skillMap['React'], skillMap['Docker']] },
    { email: 'jose.ramirez@example.com', nombres: 'José', apellidos: 'Ramírez', carrera: 'Software', anioEgreso: 2023, habilidadesIds: [skillMap['JavaScript'], skillMap['Node.js'], skillMap['AWS']] },
    { email: 'ana.flores@example.com', nombres: 'Ana', apellidos: 'Flores', carrera: 'Datos', anioEgreso: 2024, habilidadesIds: [skillMap['Python'], skillMap['Django'], skillMap['SQL']] },
    { email: 'luis.mendoza@example.com', nombres: 'Luis', apellidos: 'Mendoza', carrera: 'Redes', anioEgreso: 2022, habilidadesIds: [skillMap['Docker'], skillMap['AWS'], skillMap['SQL']] },
    { email: 'sofia.castro@example.com', nombres: 'Sofía', apellidos: 'Castro', carrera: 'Software', anioEgreso: 2023, habilidadesIds: [skillMap['React'], skillMap['TypeScript'], skillMap['Node.js']] },
    { email: 'andres.silva@example.com', nombres: 'Andrés', apellidos: 'Silva', carrera: 'Sistemas', anioEgreso: 2020, habilidadesIds: [skillMap['Java'], skillMap['Spring Boot'], skillMap['SQL']] },
    { email: 'valentina.rojas@example.com', nombres: 'Valentina', apellidos: 'Rojas', carrera: 'Informática', anioEgreso: 2024, habilidadesIds: [skillMap['JavaScript'], skillMap['React'], skillMap['Node.js']] },
  ];
  const egresados = [];
  for (const eg of egresadosRaw) {
    const pass = await bcrypt.hash('egresado123', 10);
    const user = await prisma.user.create({
      data: {
        email: eg.email,
        passwordHash: pass,
        role: 'egresado',
        egresado: {
          create: {
            nombres: eg.nombres,
            apellidos: eg.apellidos,
            carrera: eg.carrera,
            anioEgreso: eg.anioEgreso,
            habilidadesBlandas: eg.habilidadesBlandas || null,
            habilidades: {
              create: eg.habilidadesIds.map(hid => ({ habilidadId: hid, nivel: Math.floor(Math.random() * 5) + 1 })),
            },
          },
        },
      },
      include: { egresado: { include: { habilidades: true } } },
    });
    egresados.push(user.egresado);
  }
  console.log(`✅ ${egresados.length} egresados creados`);

  // ----- OFERTAS LABORALES (8 ofertas distribuidas en 2024 y 2025) -----
  const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const ofertasData = [
    { empresa: empresas[0], titulo: 'Desarrollador Full Stack', modalidad: 'remoto', habilidades: [skillMap['JavaScript'], skillMap['React'], skillMap['Node.js']], fecha: new Date(2025, 1, 15) },
    { empresa: empresas[0], titulo: 'Ingeniero de Datos', modalidad: 'hibrido', habilidades: [skillMap['Python'], skillMap['SQL'], skillMap['MongoDB']], fecha: new Date(2025, 2, 10) },
    { empresa: empresas[1], titulo: 'Backend Developer Node.js', modalidad: 'remoto', habilidades: [skillMap['Node.js'], skillMap['TypeScript'], skillMap['AWS']], fecha: new Date(2025, 0, 20) },
    { empresa: empresas[1], titulo: 'Frontend React', modalidad: 'presencial', habilidades: [skillMap['React'], skillMap['TypeScript']], fecha: new Date(2025, 3, 5) },
    { empresa: empresas[2], titulo: 'Científico de Datos', modalidad: 'hibrido', habilidades: [skillMap['Python'], skillMap['Django'], skillMap['SQL']], fecha: new Date(2025, 1, 28) },
    { empresa: empresas[2], titulo: 'Analista de Datos', modalidad: 'remoto', habilidades: [skillMap['SQL'], skillMap['Python']], fecha: new Date(2025, 2, 18) },
    { empresa: empresas[3], titulo: 'Consultor TI', modalidad: 'presencial', habilidades: [skillMap['Java'], skillMap['Spring Boot']], fecha: new Date(2025, 3, 12) },
    { empresa: empresas[4], titulo: 'DevOps Engineer', modalidad: 'remoto', habilidades: [skillMap['Docker'], skillMap['AWS']], fecha: new Date(2025, 0, 25) },
    // Ofertas de 2024 para que la gráfica muestre evolución anual
    { empresa: empresas[0], titulo: 'Desarrollador Junior', modalidad: 'presencial', habilidades: [skillMap['JavaScript']], fecha: new Date(2024, 5, 10) },
    { empresa: empresas[1], titulo: 'Trainee Backend', modalidad: 'remoto', habilidades: [skillMap['Node.js']], fecha: new Date(2024, 8, 1) },
  ];
  const ofertas = [];
  for (const oferta of ofertasData) {
    const of = await prisma.oferta.create({
      data: {
        empresaId: oferta.empresa.id,
        titulo: oferta.titulo,
        descripcion: `Oferta para ${oferta.titulo} - Excelente oportunidad`,
        modalidad: oferta.modalidad,
        tipoContrato: 'Tiempo completo',
        salarioMin: 2000,
        salarioMax: 5000,
        activa: true,
        fechaPublicacion: oferta.fecha,
        habilidades: {
          create: oferta.habilidades.map(hid => ({ habilidadId: hid })),
        },
      },
    });
    ofertas.push(of);
  }
  console.log(`✅ ${ofertas.length} ofertas creadas`);

  // ----- POSTULACIONES (asignar aleatoriamente egresados a ofertas, con diferentes estados y fechas) -----
  const estadosPosibles = ['postulado', 'revision', 'entrevista', 'contratado', 'rechazado'];
  const postulaciones = [];
  for (let i = 0; i < 30; i++) {
    const egresadoAleatorio = egresados[Math.floor(Math.random() * egresados.length)];
    const ofertaAleatoria = ofertas[Math.floor(Math.random() * ofertas.length)];
    // Evitar duplicados (opcional)
    const yaExiste = postulaciones.some(p => p.ofertaId === ofertaAleatoria.id && p.egresadoId === egresadoAleatorio.id);
    if (yaExiste) continue;
    const estado = estadosPosibles[Math.floor(Math.random() * estadosPosibles.length)];
    const fechaPostulacion = new Date(2025, Math.floor(Math.random() * 4), Math.floor(Math.random() * 28) + 1);
    const post = await prisma.postulacion.create({
      data: {
        ofertaId: ofertaAleatoria.id,
        egresadoId: egresadoAleatorio.id,
        estado: estado,
        fechaPostulacion: fechaPostulacion,
        fechaEstado: fechaPostulacion,
      },
    });
    postulaciones.push(post);
  }
  console.log(`✅ ${postulaciones.length} postulaciones creadas`);

  // ----- ACTUALIZAR DATOS PARA QUE HAYA CONTRATADOS Y EMPLEABILIDAD -----
  // Elegir 3 egresados como contratados para simular empleabilidad
  const contratados = egresados.slice(0, 3);
  for (const eg of contratados) {
    // Buscar una postulación existente de ese egresado y actualizarla a 'contratado'
    const postExistente = postulaciones.find(p => p.egresadoId === eg.id);
    if (postExistente) {
      await prisma.postulacion.update({
        where: { id: postExistente.id },
        data: { estado: 'contratado', fechaEstado: new Date() },
      });
    } else {
      // Si no tiene postulación, crear una nueva como contratado
      const algunaOferta = ofertas[0];
      await prisma.postulacion.create({
        data: {
          ofertaId: algunaOferta.id,
          egresadoId: eg.id,
          estado: 'contratado',
          fechaPostulacion: new Date(2025, 0, 10),
          fechaEstado: new Date(2025, 1, 15),
        },
      });
    }
  }

  // Refrescar vistas materializadas (si existen)
  try {
    await prisma.$executeRaw`REFRESH MATERIALIZED VIEW mv_empleabilidad_por_carrera`;
    await prisma.$executeRaw`REFRESH MATERIALIZED VIEW mv_demanda_habilidades`;
    console.log('✅ Vistas materializadas refrescadas');
  } catch (e) {
    console.log('⚠️ Vistas materializadas no definidas aún (puedes crearlas después)');
  }

  console.log('🎉 Seeding completado exitosamente. ¡Ya tienes datos para el dashboard!');
}

main()
  .catch(e => {
    console.error('❌ Error en seeding:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());