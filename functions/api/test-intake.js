// functions/api/test-intake.js
// Endpoint de PRUEBA reutilizable para verificar el puente E_web → servidor (intake).
// Simula una conversación ya cerrada (con brief) y dispara el envío del lead,
// SIN llamar a Anthropic (determinista, no gasta tokens).
//
// Uso (protegido por el token de intake):
//   curl -s -X POST https://weareemory.com/api/test-intake \
//     -H "Authorization: Bearer <INTAKE_TOKEN>" -H "Content-Type: application/json" -d '{}'
//
// Opcional: enviar un body con {nombre, email, empresa, conversacion, brief}
// para personalizar la prueba; si no, usa datos de ejemplo.
//
// Devuelve el resultado tal cual lo dio el servidor de intake (incluye el L_NNNN creado),
// para que puedas verificar de un vistazo que el lead se creó.

export async function onRequestPost(context) {
  const { request, env } = context;

  // --- Seguridad: mismo token que el intake ---
  const auth = request.headers.get('Authorization') || '';
  if (!env.INTAKE_TOKEN) {
    return json({ error: 'Falta INTAKE_TOKEN en el entorno de Cloudflare.' }, 500);
  }
  if (!auth.startsWith('Bearer ') || auth.slice(7) !== env.INTAKE_TOKEN) {
    return json({ error: 'No autorizado. Falta o no coincide el token.' }, 401);
  }

  // --- Datos de la prueba (personalizables por body, con valores por defecto) ---
  let body = {};
  try { body = await request.json(); } catch { /* body vacío está bien */ }

  // Conversación simulada: un hilo realista que termina en cierre con brief.
  // Reproduce la forma real del array `messages` que maneja chat.js.
  const convoSimulada = body.convo || [
    { role: 'user', content: 'Hola, tengo una distribuidora de material de oficina y voy a ciegas con los márgenes.' },
    { role: 'assistant', content: 'Te entiendo. En distribución, el margen real se escapa por los costes que no miras a diario. ¿Lo llevas todo en algún sistema o va a mano?' },
    { role: 'user', content: 'Uso Holded para facturar, pero los costes los tengo en Excel.' },
    { role: 'assistant', content: 'Clásico. Holded te da la venta, pero el margen vive en ese Excel desconectado. Yo cruzaría ambos para que veas rentabilidad por cliente sin pelearte con hojas. ¿Quién mira esos números hoy?' },
    { role: 'user', content: 'Lo miro yo, pero no tengo tiempo. Me interesa, ¿cómo seguimos?' },
    { role: 'assistant', content: `Perfecto. Me llevo tu caso: cruzaré tu facturación de Holded con tus costes para darte margen real por cliente, y te avisaré cuando algo se tuerza. En cuanto me digas que sí, dejo de ser una charla y me convierto en TU Emory, vigilando tus números mientras tú haces lo que importa. Revisa tu correo, que no tardo.

===BRIEF EMORY===
empresa: Distribuidora Ejemplo SL
sector: distribución material de oficina
descripción_negocio: distribuidora B2B de material de oficina
tamaño_contexto: pyme, no especificado
contacto: prueba de test
quién_decide: el propio contacto
quién_da_accesos: el propio contacto
destinatarios_por_tipo: dirección → el contacto
objetivos_declarados: ver margen real por cliente
decisiones_clave: control de rentabilidad
fuentes_datos_mencionadas: Holded, Excel de costes
accesos_posibles: Holded (lectura)
ideas_que_les_entusiasmaron: margen por cliente, alertas
reacción_al_precio: no se mencionó
señales_de_viabilidad: interés explícito ("me interesa, cómo seguimos")
preguntas_abiertas_para_el_senior: confirmar volumen y estructura de costes
===FIN BRIEF===` },
  ];

  // El "texto final" es el contenido del último mensaje del asistente (donde está el brief)
  const ultimoAsistente = [...convoSimulada].reverse().find((m) => m.role === 'assistant');
  const textFinal = typeof ultimoAsistente?.content === 'string'
    ? ultimoAsistente.content
    : '';

  const lead = body.lead || {
    nombre: 'Prueba Test-Intake',
    email: 'test-intake@ejemplo.com',
    empresaDeducida: 'Distribuidora Ejemplo SL',
    dispositivo: 'test-endpoint',
    idioma: 'es-ES',
  };

  // Metadatos geo: en una llamada por curl request.cf puede no traer datos reales;
  // usamos lo que haya o marcadores de test.
  const cf = request.cf || {};
  const geo = {
    pais: cf.country || 'TEST',
    ciudad: cf.city || 'Test City',
    zona_horaria: cf.timezone || 'Europe/Madrid',
    region: cf.region || null,
  };

  // --- Disparamos el envío del lead (misma lógica que chat.js) ---
  const resultado = await enviarLeadAlServidor(textFinal, lead, geo, convoSimulada, env);

  return json({
    test: 'completado',
    lead_enviado: lead,
    geo,
    resultado_servidor: resultado,
  }, 200);
}

// ───────── Funciones replicadas de chat.js (mantener en sync si cambian allí) ─────────

function construirTranscripcion(convo) {
  const lineas = [];
  for (const m of convo) {
    const rol = m.role === 'assistant' ? 'Emory' : 'Cliente';
    let texto = '';
    if (typeof m.content === 'string') {
      texto = m.content;
    } else if (Array.isArray(m.content)) {
      texto = m.content
        .map((b) => {
          if (typeof b === 'string') return b;
          if (b.type === 'text') return b.text;
          if (b.type === 'tool_use') return `[Emory consultó: ${b.name}]`;
          if (b.type === 'tool_result') return `[resultado de herramienta]`;
          return '';
        })
        .filter(Boolean)
        .join(' ');
    }
    texto = (texto || '').trim();
    if (!texto) continue;
    const idxBrief = texto.indexOf('===BRIEF EMORY===');
    if (idxBrief !== -1) texto = texto.slice(0, idxBrief).trim();
    if (texto) lineas.push(`${rol}: ${texto}`);
  }
  return lineas.join('\n\n');
}

function extraerBrief(fullText) {
  const ini = fullText.indexOf('===BRIEF EMORY===');
  if (ini === -1) return '';
  const fin = fullText.indexOf('===FIN BRIEF===');
  return fin === -1
    ? fullText.slice(ini)
    : fullText.slice(ini, fin + '===FIN BRIEF==='.length);
}

function empresaDesdeBrief(brief) {
  const m = brief.match(/empresa:\s*(.+)/i);
  return m && m[1].trim() ? m[1].trim() : '';
}

// Devuelve un objeto con el resultado (status + cuerpo) para verlo en la respuesta del test.
async function enviarLeadAlServidor(fullText, lead, geo, convo, env) {
  try {
    if (!env.INTAKE_TOKEN) return { ok: false, error: 'Falta INTAKE_TOKEN' };

    const brief = extraerBrief(fullText);
    const empresa = empresaDesdeBrief(brief);
    const transcripcion = construirTranscripcion(convo);

    const payload = {
      nombre: lead?.nombre || null,
      email: lead?.email || null,
      empresa: empresa || lead?.empresaDeducida || null,
      empresaDeducida: lead?.empresaDeducida || null,
      dispositivo: lead?.dispositivo || null,
      idioma: lead?.idioma || null,
      pais: geo.pais,
      ciudad: geo.ciudad,
      zona_horaria: geo.zona_horaria,
      region: geo.region,
      conversacion: transcripcion,
      brief: brief,
    };

    const r = await fetch('https://intake.weareemory.com/lead', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.INTAKE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const cuerpo = await r.text();
    let parsed;
    try { parsed = JSON.parse(cuerpo); } catch { parsed = cuerpo; }
    return { ok: r.ok, status: r.status, respuesta: parsed, transcripcion_enviada: transcripcion };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
