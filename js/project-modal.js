(function () {
  var modal      = document.getElementById('project-modal');
  var backdrop   = document.getElementById('modal-backdrop');
  var closeBtn   = document.getElementById('modal-close');
  var gallery    = document.getElementById('modal-gallery');
  var modalTitle = document.getElementById('modal-title');
  var modalBtn   = document.getElementById('modal-btn');

  var PROXIES = [
    function(u){ return 'https://corsproxy.io/?' + encodeURIComponent(u); },
    function(u){ return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u); },
    function(u){ return 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u); },
  ];

  function extractImages(html) {
    var images = [];
    var seen   = {};

    // Buscar todas las URLs de imagen de CDN de Behance en el HTML/JSON
    var re = /https?:\/\/[^\s"'<>\\]*(?:mir-s0-img\.behance\.net|behance\.net\/gallery\/module|akamai)[^\s"'<>\\]*\.(?:jpg|jpeg|png|webp)/gi;
    var m;
    while ((m = re.exec(html)) !== null) {
      var u = m[0].replace(/\\u002F/g,'/').replace(/\\/g,'');
      if (!seen[u] && !/avatar|profile|icon|favicon|_sq\b|_50\b|_100\b|_115\b|_230\b/i.test(u)) {
        seen[u] = true;
        images.push(u);
      }
    }

    // Segunda pasada: URLs genéricas de imágenes dentro del JSON de Next.js
    if (images.length === 0) {
      var re2 = /https?:\\?\/\\?\/[^"\\]*\.(?:jpg|jpeg|png|webp)[^"\\]*/gi;
      while ((m = re2.exec(html)) !== null) {
        var u2 = m[0].replace(/\\u002F/g,'/').replace(/\\\/\//g,'//').replace(/\\/g,'');
        if (!seen[u2] && /behance|akamai/i.test(u2) &&
            !/avatar|profile|icon|_sq|_50\b|_100\b/i.test(u2)) {
          seen[u2] = true;
          images.push(u2);
        }
      }
    }

    return images;
  }

  function tryFetch(url, proxies, index) {
    if (index >= proxies.length) return Promise.reject('all failed');
    return fetch(proxies[index](url), { signal: AbortSignal.timeout(8000) })
      .then(function(r){
        if (!r.ok) throw new Error('bad response');
        return r.text();
      })
      .catch(function(){
        return tryFetch(url, proxies, index + 1);
      });
  }

  function showLoading() {
    gallery.innerHTML = '<div class="modal-loading"><span class="modal-spinner"></span>Cargando proyecto…</div>';
  }

  function showFallback(imgSrc, projectUrl) {
    gallery.innerHTML =
      '<div class="modal-fallback-wrap">' +
        '<img src="' + imgSrc + '" alt="">' +
        '<p>No se pudo cargar el proyecto completo.<br>Visítalo directamente en Behance.</p>' +
      '</div>';
  }

  function renderImages(images) {
    if (!images || images.length === 0) return false;
    gallery.innerHTML = images.map(function(src){
      return '<img src="' + src + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">';
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

    tryFetch(url, PROXIES, 0)
      .then(function(html){
        var images = extractImages(html);
        if (!renderImages(images)) showFallback(img, url);
      })
      .catch(function(){ showFallback(img, url); });
  }

  function closeModal() {
    modal.classList.remove('open');
    gallery.innerHTML = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.dark-project-card').forEach(function(card){
    card.addEventListener('click', function(){ openModal(card); });
  });

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click',  closeModal);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeModal();
  });
})();
