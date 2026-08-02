// functions/api/activa.js
// Puente entre la página /activa y el intake del servidor.
// El visitante se identifica con su magic link (t); esta Function añade el
// Bearer del intake (secreto del servidor, nunca viaja al navegador).
// NO registra en logs los valores de credenciales.

const INTAKE = 'https://intake.weareemory.com';

export async function onRequestPost(context) {
  const { request, env } = context;
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (!env.INTAKE_TOKEN) {
    return json({ ok: false, error: 'Configuración incompleta del servidor.' }, 500, cors);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Petición inválida.' }, 400, cors);
  }
  const accion = body.accion || '';
  const t = (body.t || '').trim();
  if (!t) return json({ ok: false, motivo: 'enlace_invalido' }, 200, cors);

  let ruta = null;
  let payload = null;
  if (accion === 'estado') {
    ruta = '/lead/estado';
    payload = { t };
  } else if (accion === 'checkout') {
    ruta = '/lead/checkout';
    payload = { t };
  } else if (accion === 'credenciales') {
    ruta = '/lead/credenciales';
    payload = { t, items: Array.isArray(body.items) ? body.items : [], notas: body.notas || '' };
  } else {
    return json({ ok: false, error: 'Acción desconocida.' }, 400, cors);
  }

  try {
    const r = await fetch(INTAKE + ruta, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.INTAKE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const d = await r.json();
    return json(d, 200, cors);
  } catch (err) {
    return json({ ok: false, error: 'No pude hablar con el servidor. Prueba de nuevo en un minuto.' }, 502, cors);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...(cors || {}) },
  });
}
