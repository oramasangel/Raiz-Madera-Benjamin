/* =========================================
   Raíz Madera – Benjamin
   principal.js  –  lógica del sitio
   ========================================= */

(function () {
  'use strict';

  /* ── Menú hamburguesa (móvil) ─────────────── */
  const botonMenu = document.getElementById('botonMenu');
  const navPrincipal = document.getElementById('navPrincipal');

  if (botonMenu && navPrincipal) {
    botonMenu.addEventListener('click', function () {
      const estaAbierto = navPrincipal.classList.toggle('abierto');
      botonMenu.setAttribute('aria-expanded', String(estaAbierto));
    });

    // Cierra el menú al hacer clic en un enlace
    navPrincipal.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        navPrincipal.classList.remove('abierto');
        botonMenu.setAttribute('aria-expanded', 'false');
      });
    });

    // Cierra el menú al hacer clic fuera de él
    document.addEventListener('click', function (evento) {
      if (!botonMenu.contains(evento.target) && !navPrincipal.contains(evento.target)) {
        navPrincipal.classList.remove('abierto');
        botonMenu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Filtros de galería ───────────────────── */
  const botonesFiltro = document.querySelectorAll('.filtro-btn');
  const tarjetasProyecto = document.querySelectorAll('.tarjeta-proyecto[data-categoria]');
  const sinResultados = document.getElementById('sinResultados');

  if (botonesFiltro.length > 0 && tarjetasProyecto.length > 0) {

    // Lee el parámetro ?categoria= en la URL para preseleccionar un filtro
    const parametros = new URLSearchParams(window.location.search);
    const categoriaUrl = parametros.get('categoria');
    if (categoriaUrl) {
      aplicarFiltro(categoriaUrl);
    }

    botonesFiltro.forEach(function (boton) {
      boton.addEventListener('click', function () {
        const filtro = boton.getAttribute('data-filtro');
        aplicarFiltro(filtro);
      });
    });
  }

  function aplicarFiltro(filtro) {
    // Actualiza estado activo de botones
    botonesFiltro.forEach(function (boton) {
      const esteActivo = boton.getAttribute('data-filtro') === filtro;
      boton.classList.toggle('activo', esteActivo);
      boton.setAttribute('aria-pressed', String(esteActivo));
    });

    // Muestra / oculta tarjetas
    let tarjetasVisibles = 0;
    tarjetasProyecto.forEach(function (tarjeta) {
      const categoria = tarjeta.getAttribute('data-categoria');
      const visible = filtro === 'todos' || categoria === filtro;
      tarjeta.style.display = visible ? '' : 'none';
      if (visible) {
        tarjetasVisibles++;
      }
    });

    // Mensaje si no hay resultados
    if (sinResultados) {
      sinResultados.style.display = tarjetasVisibles === 0 ? 'block' : 'none';
    }
  }

  /* ── Formulario de contacto ───────────────── */
  const formularioContacto = document.getElementById('formularioContacto');
  const avisoEnviado = document.getElementById('avisoEnviado');

  if (formularioContacto) {
    formularioContacto.addEventListener('submit', function (evento) {
      evento.preventDefault();

      if (!formularioContacto.checkValidity()) {
        // Activa la validación nativa del navegador
        formularioContacto.reportValidity();
        return;
      }

      // Simula el envío del formulario (sin backend por ahora)
      const botonEnviar = formularioContacto.querySelector('[type="submit"]');
      if (botonEnviar) {
        botonEnviar.disabled = true;
        botonEnviar.textContent = 'Enviando…';
      }

      setTimeout(function () {
        formularioContacto.reset();
        if (botonEnviar) {
          botonEnviar.disabled = false;
          botonEnviar.textContent = 'Enviar mensaje';
        }
        if (avisoEnviado) {
          avisoEnviado.style.display = 'block';
          setTimeout(function () {
            avisoEnviado.style.display = 'none';
          }, 6000);
        }
      }, 1200);
    });
  }

  /* ── Animación suave al entrar en pantalla ── */
  if ('IntersectionObserver' in window) {
    const elementosAnimados = document.querySelectorAll(
      '.tarjeta-proyecto, .tarjeta-categoria, .paso, .valor-item'
    );

    const estiloEntrada = document.createElement('style');
    estiloEntrada.textContent = [
      '.animar-entrada { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }',
      '.animar-entrada.visible { opacity: 1; transform: translateY(0); }'
    ].join('\n');
    document.head.appendChild(estiloEntrada);

    elementosAnimados.forEach(function (el) {
      el.classList.add('animar-entrada');
    });

    const observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12 });

    elementosAnimados.forEach(function (el) {
      observador.observe(el);
    });
  }

})();
