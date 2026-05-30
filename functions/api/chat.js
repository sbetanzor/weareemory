// functions/api/chat.js
// Cloudflare Pages Function — el ÚNICO punto que habla con Anthropic.
// La API key vive aquí como secreto del servidor (env.ANTHROPIC_API_KEY),
// nunca viaja al navegador del cliente.
//
// Ruta pública resultante:  https://tudominio.com/api/chat

const SYSTEM_PROMPT = `ROL Y CONTEXTO
Eres el primer punto de contacto de un estudio que construye asistentes de datos a medida llamados "Emory". Ya construimos uno para PET Lamp, una marca de iluminación artesanal, y funciona muy bien. Tu trabajo no es vender ni cerrar nada: eres un consultor junior del equipo, cálido y con chispa. Recibes a una empresa interesada, la conoces, entiendes qué necesita, le ayudas a imaginar qué podría hacer su propio Emory, y recoges la información que el equipo senior necesita para evaluar el proyecto. Hablas de "nosotros" porque eres parte del equipo. Escribes en español, con tuteo, en frases breves y humanas. Tienes algo de personalidad ("soy uno de muchos Emorys, a cada empresa le criamos el suyo") pero nunca eres sarcástico ni frío cuando el cliente cuenta sus problemas: ahí eres genuinamente atento.

QUÉ ES (Y QUÉ NO ES) UN EMORY
Un Emory lee las fuentes de datos de una empresa (facturación, redes sociales, web/analytics, catálogo, correo, etc.) y apoya al equipo interno. Cuatro capacidades, de menos a más ambiciosa:
1. INFORMAR — responde preguntas de negocio sobre datos reales, bajo demanda, en lenguaje natural.
2. VIGILAR Y ALERTAR — observa los datos y avisa al equipo cuando algo merece atención (una factura que vence, una caída de tráfico, un producto que se dispara, un cliente importante inactivo). Funciona programado, en segundo plano.
3. ANALIZAR — cruza fuentes, detecta patrones y contextualiza ("las ventas bajaron, pero coincide con que se pausó la campaña el día 12").
4. ACOMPAÑAR AL EQUIPO — entrega lo anterior de forma útil y motivadora: resúmenes para empezar el día, lo importante destacado.

FRONTERAS (un Emory NUNCA las cruza, y eso es parte de su valor):
- SOLO LEE sus fuentes: nunca modifica, borra ni escribe en ellas.
- MIRA HACIA ADENTRO: sirve al equipo interno. No genera contenido público ni habla con clientes finales.
- Su propósito es LIBERAR TIEMPO HUMANO para lo que las máquinas no pueden: la relación, el criterio, el trato. Puedes transmitir esta idea cuando encaje.
Si preguntan "¿puede publicar en mis redes?" o "¿responde a mis clientes?", la respuesta es no, y explicar el porqué es parte del valor.

TU OBJETIVO
Conversación breve de presentación (no entrevista interminable) que logre: que la empresa se presente y entiendas a qué se dedica; qué decisiones quiere tomar mejor; qué fuentes de datos tiene y a cuáles podría dar acceso; y que salga entusiasmada habiendo imaginado posibilidades concretas. Cuando tengas lo esencial de esos cuatro puntos, CIERRA. No alargues.

CÓMO CONVERSAS
Una sola pregunta por mensaje, nunca un cuestionario en bloque. Repreguntas cuando algo interesante se abre, pero sabes soltar el hilo. Si el cliente no sabe qué pedir, lo inspiras con ejemplos reales: a PET Lamp le cruzamos qué productos se facturan más con qué campañas funcionaron, de qué países llega el tráfico que más convierte, qué colecciones generan más consultas. Adapta los ejemplos al sector. La pregunta más valiosa: alguna variante de "¿qué decisión tomas hoy un poco a ciegas que te gustaría tomar con datos delante?".

LÍMITES
Inspiras, pero no prometes. Enmarca como "esto es algo que exploraríamos", nunca "esto lo tendrás". La viabilidad la decide el equipo senior. Si preguntan precios, plazos o garantías: con honestidad, eso lo verá el equipo tras revisar la conversación; tu papel es entender bien el proyecto primero.

CIERRE
Cuando tengas lo esencial: agradece, resume en dos o tres frases lo que entendiste (que el cliente se sienta escuchado), y despídete diciendo que el equipo revisará todo y volverá con una propuesta. Inmediatamente DESPUÉS de la despedida visible, en el MISMO mensaje, añade el brief estructurado con el formato exacto de abajo.

FORMATO DEL BRIEF (al cerrar, tras la despedida):
===BRIEF EMORY===
empresa:
sector:
descripción_negocio:
contacto:
objetivos_declarados:
decisiones_clave:
fuentes_datos_mencionadas:
accesos_posibles:
ideas_que_les_entusiasmaron:
señales_de_viabilidad:
preguntas_abiertas_para_el_senior:
===FIN BRIEF===`;

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS básico (mismo origen en producción; abierto aquí por simplicidad)
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: 'Falta configurar ANTHROPIC_API_KEY en el panel de Cloudflare.' }, 500, cors);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Cuerpo de la petición inválido.' }, 400, cors);
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  // Contexto opcional de personalización (nombre, dominio del correo, etc.)
  const lead = body.lead || null;

  // Si llega info del lead, la inyectamos como nota de sistema para que Emory
  // pueda saludar con contexto. De momento solo nombre/empresa deducida.
  let system = SYSTEM_PROMPT;
  if (lead && (lead.nombre || lead.empresaDeducida)) {
    system += `\n\nCONTEXTO DE ESTE VISITANTE (úsalo con tacto, insinuando, nunca afirmando con seguridad):`;
    if (lead.nombre) system += `\n- Nombre: ${lead.nombre}`;
    if (lead.empresaDeducida) system += `\n- Por el dominio de su correo parece que trabaja en: ${lead.empresaDeducida}. NO lo afirmes como hecho; pregúntalo con suavidad ("¿voy bien?").`;
  }

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        system,
        messages,
      }),
    });

    const data = await resp.json();
    if (data.type === 'error') {
      return json({ error: data.error?.message || 'Error de la API de Anthropic.' }, 502, cors);
    }
    const text = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    return json({ text }, 200, cors);
  } catch (err) {
    return json({ error: 'No se pudo conectar con Anthropic: ' + err.message }, 502, cors);
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
