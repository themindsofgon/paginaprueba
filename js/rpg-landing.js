(function () {
  var landing   = document.getElementById('rpg-landing');
  var flash     = document.getElementById('rpg-flash');
  var menuItems = document.querySelectorAll('.rpg-item');

  var pageMap = {
    'sobre-mi'  : 'page-sobre-mi',
    'proyectos' : 'page-proyectos',
    'contacto'  : 'page-redes'
  };

  var currentPage   = null;
  var focusedIndex  = -1;   // ítem actualmente seleccionado por teclado

  /* ── Animación de entrada escalonada ── */
  menuItems.forEach(function (item, i) {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-24px)';
    item.style.transition = 'none';
    setTimeout(function () {
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, color 0.2s ease';
      item.style.opacity = '1';
      item.style.transform = '';
    }, 700 + i * 160);
  });

  /* ── Selección visual por teclado ── */
  function setFocus(index) {
    menuItems.forEach(function (item, i) {
      item.classList.toggle('rpg-focused', i === index);
    });
    focusedIndex = index;
  }

  function clearFocus() {
    menuItems.forEach(function (item) { item.classList.remove('rpg-focused'); });
    focusedIndex = -1;
  }

  /* ── Navegar a una página RPG ── */
  function goToPage(pageId) {
    var page = document.getElementById(pageId);
    if (!page) return;

    clearFocus();
    flash.classList.add('on');

    setTimeout(function () {
      flash.classList.remove('on');
      landing.classList.add('rpg-exit');
      setTimeout(function () { landing.style.display = 'none'; }, 500);

      page.style.display = 'block';
      page.classList.remove('rpg-page-exit');
      void page.offsetWidth;
      page.classList.add('rpg-page-active');
      page.scrollTop = 0;
      currentPage = page;
    }, 140);
  }

  /* ── Volver al menú ── */
  function goToMenu() {
    if (!currentPage) return;

    flash.classList.add('on');
    setTimeout(function () {
      flash.classList.remove('on');

      var leaving = currentPage;
      leaving.classList.remove('rpg-page-active');
      leaving.classList.add('rpg-page-exit');
      setTimeout(function () {
        leaving.style.display = 'none';
        leaving.classList.remove('rpg-page-exit');
      }, 380);

      landing.style.display = '';
      landing.classList.remove('rpg-exit');
      void landing.offsetWidth;
      currentPage = null;
    }, 130);
  }

  /* ── Teclado: ↑↓  /  W S  /  Enter ── */
  document.addEventListener('keydown', function (e) {
    /* Solo activo cuando el menú principal está visible */
    if (landing.style.display === 'none') return;

    var key = e.key;

    if (key === 'ArrowDown' || key === 's' || key === 'S') {
      e.preventDefault();
      var next = focusedIndex < menuItems.length - 1 ? focusedIndex + 1 : 0;
      setFocus(next);

    } else if (key === 'ArrowUp' || key === 'w' || key === 'W') {
      e.preventDefault();
      var prev = focusedIndex > 0 ? focusedIndex - 1 : menuItems.length - 1;
      setFocus(prev);

    } else if (key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      var pageId = pageMap[menuItems[focusedIndex].dataset.target];
      if (pageId) goToPage(pageId);
    }
  });

  /* ── Clic en ítem del menú ── */
  menuItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      var pageId = pageMap[item.dataset.target];
      if (pageId) goToPage(pageId);
    });

    /* Sincronizar foco visual con el hover del ratón */
    item.addEventListener('mouseenter', function () {
      var idx = Array.prototype.indexOf.call(menuItems, item);
      setFocus(idx);
    });
    item.addEventListener('mouseleave', function () {
      clearFocus();
    });
  });

  /* ── Botón volver ── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.page-back-btn');
    if (btn) { e.preventDefault(); goToMenu(); }
  });

})();
