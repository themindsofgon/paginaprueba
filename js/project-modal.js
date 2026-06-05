(function () {
  var modal    = document.getElementById('project-modal');
  var backdrop = document.getElementById('modal-backdrop');
  var closeBtn = document.getElementById('modal-close');
  var modalImg = document.getElementById('modal-img');
  var modalTitle = document.getElementById('modal-title');
  var modalBtn = document.getElementById('modal-btn');

  function openModal(card) {
    modalImg.src       = card.dataset.img;
    modalImg.alt       = card.dataset.title;
    modalTitle.textContent = card.dataset.title;
    modalBtn.href      = card.dataset.url;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.dark-project-card').forEach(function (card) {
    card.addEventListener('click', function () { openModal(card); });
  });

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();
