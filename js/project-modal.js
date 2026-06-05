(function () {
  var modal    = document.getElementById('project-modal');
  var backdrop = document.getElementById('modal-backdrop');
  var closeBtn = document.getElementById('modal-close');
  var modalEmbed = document.getElementById('modal-embed');
  var modalTitle = document.getElementById('modal-title');
  var modalBtn   = document.getElementById('modal-btn');

  // Extrae el ID numérico de una URL de Behance
  function getBehanceId(url) {
    var match = url.match(/gallery\/(\d+)/);
    return match ? match[1] : null;
  }

  function openModal(card) {
    var url   = card.dataset.url;
    var title = card.dataset.title;
    var id    = getBehanceId(url);

    modalTitle.textContent = title;
    modalBtn.href = url;

    if (id) {
      modalEmbed.src = 'https://www.behance.net/embed/project/' + id + '?ilo0=1';
      modalEmbed.style.display = 'block';
    } else {
      // Proyecto de Instagram u otro — mostrar imagen local
      modalEmbed.src = '';
      modalEmbed.style.display = 'none';
      document.getElementById('modal-fallback').src = card.dataset.img;
      document.getElementById('modal-fallback').style.display = 'block';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modalEmbed.src = '';
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
