(function () {
  var modal      = document.getElementById('project-modal');
  var backdrop   = document.getElementById('modal-backdrop');
  var closeBtn   = document.getElementById('modal-close');
  var gallery    = document.getElementById('modal-gallery');
  var modalTitle = document.getElementById('modal-title');
  var modalBtn   = document.getElementById('modal-btn');

  /* ── Extraer imágenes del HTML de Behance ── */
  function extractImages(html) {
    var images = [];

    // 1. Intentar desde __NEXT_DATA__ JSON embebido
    var match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (match) {
      try {
        var data    = JSON.parse(match[1]);
        var jsonStr = JSON.stringify(data);
        // Extraer URLs de imágenes del CDN de Behance
        var urls = jsonStr.match(/https?:\\?\/\\?\/[^"\\]*(?:behance\.net|akamaihd\.net|mir-s0-img)[^"\\]*\.(?:jpg|jpeg|png|webp)/gi);
        if (urls) {
          urls = urls.map(function (u) { return u.replace(/\\u002F/g, '/').replace(/\\/g, ''); });
          // Filtrar avatares, iconos, thumbs y deduplicar
          var seen = {};
          urls.forEach(function (u) {
            if (!seen[u] && !/avatar|profile|icon|favicon|thumb|_sq|_50|_100|_115|_230/i.test(u)) {
              seen[u] = true;
              images.push(u);
            }
          });
        }
      } catch (e) {}
    }

    // 2. Fallback: buscar todas las <img> con src de Behance CDN
    if (images.length === 0) {
      var srcMatches = html.match(/https?:\/\/[^"'\s]*(?:behance\.net|akamaihd\.net|mir-s0)[^"'\s]*\.(?:jpg|jpeg|png|webp)/gi);
      if (srcMatches) {
        var seen2 = {};
        srcMatches.forEach(function (u) {
          if (!seen2[u] && !/avatar|profile|icon|_sq|_50|_100/i.test(u)) {
            seen2[u] = true;
            images.push(u);
          }
        });
      }
    }

    return images;
  }

  function showLoading() {
    gallery.innerHTML = '<div class="modal-loading">Cargando proyecto…</div>';
  }

  function showError(imgSrc) {
    gallery.innerHTML = '<img src="' + imgSrc + '" style="width:100%;display:block;" alt="">';
  }

  function renderImages(images) {
    if (!images || images.length === 0) return false;
    gallery.innerHTML = images.map(function (src) {
      return '<img src="' + src + '" alt="" loading="lazy">';
    }).join('');
    return true;
  }

  function openModal(card) {
    var url   = card.dataset.url;
    var title = card.dataset.title;
    var img   = card.dataset.img;

    modalTitle.textContent = title;
    modalBtn.href          = url;
    showLoading();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    gallery.scrollTop = 0;

    // Obtener página de Behance via proxy CORS
    var proxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
    fetch(proxy)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var images = extractImages(html);
        if (!renderImages(images)) showError(img);
      })
      .catch(function () { showError(img); });
  }

  function closeModal() {
    modal.classList.remove('open');
    gallery.innerHTML = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.dark-project-card').forEach(function (card) {
    card.addEventListener('click', function () { openModal(card); });
  });

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click',  closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();
