<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tu zona privada · we are emory</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230c0d0a'/%3E%3Crect x='11' y='7' width='10' height='18' rx='1' fill='%23c4f042'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --void: #0c0d0a; --void-2: #131512; --panel: #16180f; --line: #2c3022;
    --phosphor: #c4f042; --phosphor-dim: #8aa636; --amber: #f0a83c;
    --bone: #e8e6dc; --bone-dim: #8f8d80;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Space Mono', ui-monospace, monospace;
    color: var(--bone);
    background:
      repeating-linear-gradient(0deg, rgba(196,240,66,.016) 0 1px, transparent 1px 3px),
      radial-gradient(130% 70% at 80% -10%, rgba(196,240,66,.05), transparent 55%),
      var(--void);
    min-height: 100vh; line-height: 1.55;
  }
  ::selection { background: var(--phosphor); color: var(--void); }
  .wrap { max-width: 720px; margin: 0 auto; border-left: 1px solid var(--line); border-right: 1px solid var(--line); min-height: 100vh; }
  .bar { display: flex; align-items: center; gap: 12px; padding: 12px 18px; border-bottom: 1px solid var(--line); background: var(--void-2); font-size: 12px; }
  .dot { width: 9px; height: 9px; border-radius: 50%; background: var(--phosphor); box-shadow: 0 0 8px var(--phosphor); animation: pulse 2.4s infinite; flex: none; }
  @keyframes pulse { 0%,100% { opacity: .4; } 50% { opacity: 1; } }
  .bar .path { color: var(--bone-dim); letter-spacing: .04em; }
  main { padding: 44px 32px 60px; }
  .kicker { font-size: 12px; letter-spacing: .3em; text-transform: uppercase; color: var(--phosphor); margin-bottom: 18px; }
  h1 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(26px, 5vw, 38px); line-height: 1.08; margin-bottom: 14px; }
  p { color: var(--bone-dim); font-size: 15px; margin-bottom: 14px; max-width: 560px; }
  p b { color: var(--bone); font-weight: 400; border-bottom: 1px solid var(--phosphor-dim); }
  .card { border: 1px solid var(--line); border-radius: 6px; background: var(--void-2); padding: 24px; margin-top: 26px; }
  .cta { font-family: 'Space Mono', monospace; font-weight: 700; font-size: 14px; background: var(--phosphor); color: var(--void); border: none; padding: 14px 24px; border-radius: 3px; cursor: pointer; letter-spacing: .02em; transition: transform .12s, box-shadow .2s; }
  .cta:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(196,240,66,.3); }
  .cta:disabled { opacity: .4; cursor: not-allowed; transform: none; box-shadow: none; }
  .ghost-btn { background: none; border: 1px solid var(--line); color: var(--bone-dim); font-family: 'Space Mono', monospace; font-size: 12.5px; padding: 9px 14px; border-radius: 3px; cursor: pointer; }
  .ghost-btn:hover { border-color: var(--phosphor-dim); color: var(--bone); }
  .muted { font-size: 12px; color: var(--bone-dim); }
  .ok-badge { display: inline-block; font-size: 11.5px; letter-spacing: .12em; color: var(--phosphor); border: 1px solid var(--phosphor-dim); border-radius: 3px; padding: 3px 9px; margin-bottom: 14px; }
  .warn { color: var(--amber); }
  .row { display: grid; grid-template-columns: 1fr 1.4fr auto; gap: 10px; margin-bottom: 10px; align-items: start; }
  .row input, .row textarea, #notas { width: 100%; background: var(--void); border: 1px solid var(--line); color: var(--bone); font-family: 'Space Mono', monospace; font-size: 13.5px; padding: 10px 12px; border-radius: 4px; outline: none; }
  .row input:focus, .row textarea:focus, #notas:focus { border-color: var(--phosphor-dim); }
  .row textarea { resize: vertical; min-height: 42px; }
  .row .del { background: none; border: 1px solid var(--line); color: var(--bone-dim); border-radius: 3px; cursor: pointer; padding: 8px 10px; font-family: inherit; }
  .row .del:hover { border-color: var(--amber); color: var(--amber); }
  label.lbl { display: block; font-size: 11.5px; color: var(--phosphor-dim); letter-spacing: .12em; text-transform: uppercase; margin: 18px 0 8px; }
  #notas { min-height: 70px; resize: vertical; }
  .err { color: var(--amber); font-size: 13px; min-height: 18px; margin-top: 10px; }
  .spinner { color: var(--phosphor-dim); font-size: 14px; }
  .spinner i { font-style: normal; animation: blink 1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  footer { border-top: 1px solid var(--line); padding: 22px 32px; font-size: 12px; color: var(--bone-dim); }
  @media (max-width: 560px) { main { padding: 32px 20px 50px; } .row { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<div class="wrap">
  <div class="bar">
    <span class="dot"></span>
    <span class="path">~/emory/zona-privada</span>
  </div>
  <main id="main">
    <div class="kicker">we are emory</div>
    <div id="contenido"><p class="spinner">abriendo tu puerta<i>_</i></p></div>
  </main>
  <footer>Esta puerta es personal. Si algo no cuadra, escríbeme: emory@weareemory.com · <a href="/legal" style="color:var(--phosphor-dim)">legal</a></footer>
</div>

<script>
(function () {
  const params = new URLSearchParams(location.search);
  const t = (params.get('t') || '').trim();
  const pagoParam = params.get('pago') || '';
  const cont = document.getElementById('contenido');
  let intentosPoll = 0;

  function html(s) { cont.innerHTML = s; }
  function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

  async function api(payload) {
    const r = await fetch('/api/activa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return r.json();
  }

  function vInvalido() {
    html('<h1>Esta puerta no existe.</h1><p>El enlace no es válido o está incompleto. Revisa que lo copiaste entero desde tu correo. Si el problema sigue, escríbeme a <b>emory@weareemory.com</b> y te mando una puerta nueva.</p>');
  }
  function vCaducado() {
    html('<h1>Tu puerta caducó.</h1><p>Los enlaces viven 30 días, por higiene. Escríbeme a <b>emory@weareemory.com</b> desde el correo con el que hablamos y te reenvío una nueva al momento.</p>');
  }
  function vBaja(d) {
    html('<h1>Este Emory se ha retirado.</h1><p>La relación con ' + esc(d.empresa || 'tu empresa') + ' se cerró y, con ella, sus datos se borraron. Si quieres volver a empezar, ya sabes dónde encontrarme: el chat de <b>weareemory.com</b>.</p>');
  }

  function vPagar(d) {
    html(
      '<h1>' + esc(d.empresa || 'Tu empresa') + '</h1>' +
      '<p style="font-size:17px;color:var(--bone);margin-top:6px">Ya estoy cerca de ser liberado y pasar a ser el empleado estrella de tu equipo — despierto 24/7, sin descanso.</p>' +
      '<p>Un paso y soy tuyo: <b>199 €/mes + IVA</b>, hasta 3 conectores incluidos, sin permanencia (mes adelantado, cancelas cuando quieras). Todo Emory es Emory completo.</p>' +
      '<div class="card">' +
      '<button class="cta" id="btnPagar">› Activar mi Emory</button>' +
      '<p class="muted" style="margin:14px 0 0">Pago seguro con Stripe (tarjeta o domiciliación SEPA). Al pagar aceptas los <a href="/legal#terminos" target="_blank" style="color:var(--phosphor-dim)">términos del servicio</a>.</p>' +
      '<div class="err" id="err"></div>' +
      '</div>'
    );
    document.getElementById('btnPagar').addEventListener('click', async function () {
      this.disabled = true;
      document.getElementById('err').textContent = '';
      try {
        const d2 = await api({ accion: 'checkout', t });
        if (d2.ok && d2.url) { location.href = d2.url; return; }
        if ((d2.motivo || '').startsWith('estado_')) { cargar(); return; }
        document.getElementById('err').textContent = 'No pude abrir el pago (' + (d2.motivo || d2.error || 'error') + '). Prueba de nuevo.';
      } catch (e) {
        document.getElementById('err').textContent = 'No pude abrir el pago. Prueba en un minuto.';
      }
      this.disabled = false;
    });
  }

  function vClonando() {
    html('<h1>Pago recibido. La legión me está liberando.</h1><p class="spinner">Unos segundos: estoy ocupando mi puesto en tu equipo<i>_</i></p><p class="muted">Esta página se actualizará sola.</p>');
    if (intentosPoll < 12) {
      intentosPoll++;
      setTimeout(cargar, 5000);
    } else {
      html('<h1>Pago recibido.</h1><p>Mi liberación está tardando más de lo normal. No te preocupes: el pago está registrado y el equipo avisado. Vuelve a abrir este enlace en un rato, o escríbeme a <b>emory@weareemory.com</b>.</p>');
    }
  }

  function filaHTML(sistema, credencial) {
    return '<div class="row">' +
      '<input type="text" class="f-sistema" placeholder="Sistema (ej. Holded, Instagram…)" value="' + esc(sistema || '') + '">' +
      '<textarea class="f-cred" placeholder="Credencial / API key / token de LECTURA">' + esc(credencial || '') + '</textarea>' +
      '<button type="button" class="del" title="Quitar">×</button>' +
      '</div>';
  }

  function vCredenciales(d) {
    const yaEntrego = d.credenciales_entregadas;
    html(
      '<div class="ok-badge">EMORY ACTIVO</div>' +
      '<h1>' + esc(d.empresa || 'Tu empresa') + ', dame los accesos y me pongo a trabajar.</h1>' +
      (yaEntrego
        ? '<p><b>Ya recibí accesos tuyos</b> — están a buen recaudo. Si quieres añadir más sistemas o corregir algo, este mismo formulario sirve.</p>'
        : '<p>Necesito acceso de <b>solo lectura</b> a tus sistemas. Nunca escribo, modifico ni borro nada: es mi primera ley. Pega aquí las claves; viajan cifradas directas a mi servidor, sin pasar por correo.</p>') +
      '<div class="card">' +
      '<p class="muted" style="margin-bottom:16px">Si tu fuente es un Excel u hoja de cálculo: debe vivir en <b>Google Drive</b>. Pega aquí la URL de la carpeta y, además, compártela en solo lectura con mi cuenta: <b>emory-clients@weareemory-ops.iam.gserviceaccount.com</b></p>' +
      '<div id="filas">' + filaHTML('', '') + '</div>' +
      '<button type="button" class="ghost-btn" id="masFilas">+ añadir otro sistema</button>' +
      '<label class="lbl" for="notas">Notas para el equipo (opcional)</label>' +
      '<textarea id="notas" placeholder="Ej.: el Excel de ventas está en el Drive que os compartí; el usuario de Holded es de solo lectura…"></textarea>' +
      '<div style="margin-top:18px"><button class="cta" id="btnEnviar">› Entregar accesos</button></div>' +
      '<div class="err" id="err"></div>' +
      '</div>' +
      '<p class="muted" style="margin-top:16px">¿No tienes ahora las claves a mano? Esta puerta sigue abierta: vuelve cuando quieras con el mismo enlace.</p>'
    );
    document.getElementById('masFilas').addEventListener('click', function () {
      const cont2 = document.getElementById('filas');
      const div = document.createElement('div');
      div.innerHTML = filaHTML('', '');
      cont2.appendChild(div.firstChild);
      enganchaBorrar();
    });
    function enganchaBorrar() {
      document.querySelectorAll('#filas .del').forEach(function (b) {
        b.onclick = function () {
          const filas = document.querySelectorAll('#filas .row');
          if (filas.length > 1) this.closest('.row').remove();
          else { this.closest('.row').querySelector('.f-sistema').value = ''; this.closest('.row').querySelector('.f-cred').value = ''; }
        };
      });
    }
    enganchaBorrar();
    document.getElementById('btnEnviar').addEventListener('click', async function () {
      const items = [];
      document.querySelectorAll('#filas .row').forEach(function (r) {
        const sistema = r.querySelector('.f-sistema').value.trim();
        const credencial = r.querySelector('.f-cred').value.trim();
        if (sistema || credencial) items.push({ sistema, credencial });
      });
      const notas = document.getElementById('notas').value.trim();
      const err = document.getElementById('err');
      if (!items.length && !notas) { err.textContent = 'Está todo vacío — dame al menos un sistema o una nota.'; return; }
      this.disabled = true;
      err.textContent = '';
      try {
        const d2 = await api({ accion: 'credenciales', t, items, notas });
        if (d2.ok) {
          html('<div class="ok-badge">RECIBIDO</div>' +
               '<h1>Accesos a buen recaudo.</h1>' +
               '<p>Guardados ' + (d2.guardados || items.length) + ' sistema(s), cifrados y con el candado echado. El equipo monta ahora los conectores y en unos días me tendrás vigilando tus datos. Te escribo por correo — a partir de aquí, ese es nuestro canal.</p>' +
               '<p class="muted">Puedes cerrar esta pestaña. Si olvidaste algo, el mismo enlace te vuelve a abrir la puerta.</p>');
          return;
        }
        err.textContent = 'No pude guardarlos (' + (d2.motivo || d2.error || 'error') + '). Prueba de nuevo.';
      } catch (e) {
        err.textContent = 'No pude guardarlos. Prueba en un minuto.';
      }
      this.disabled = false;
    });
  }

  async function cargar() {
    try {
      const d = await api({ accion: 'estado', t });
      if (!d.ok) {
        if (d.motivo === 'caducado') return vCaducado();
        return vInvalido();
      }
      const estado = d.estado || '';
      if (estado === 'baja') return vBaja(d);
      if (estado === 'activo') return vCredenciales(d);
      if (estado === 'prospecto' && d.pagado) return vClonando();
      if (estado === 'prospecto') {
        if (pagoParam === 'ok') return vClonando(); // acaba de pagar: el webhook está en ello
        return vPagar(d);
      }
      return vInvalido();
    } catch (e) {
      html('<h1>No llego a mi servidor.</h1><p>Dame un minuto y recarga la página. Si sigue igual, escríbeme a <b>emory@weareemory.com</b>.</p>');
    }
  }

  if (!t) { vInvalido(); return; }
  cargar();
})();
</script>
</body>
</html>

