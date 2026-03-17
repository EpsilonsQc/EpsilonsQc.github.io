(function() {
	var aboutLink = document.getElementById('about-link');
	var aboutModal = document.getElementById('about-modal');
	var aboutClose = document.getElementById('about-close');
	var copyrightLink = document.getElementById('copyright-link');

	function openAbout(e) {
		e.preventDefault();
		aboutModal.classList.remove('modal-hidden');
		aboutClose.focus();
	}

	function closeAbout() {
		aboutModal.classList.add('modal-hidden');
	}

	aboutLink.addEventListener('click', openAbout);
	copyrightLink.addEventListener('click', openAbout);
	aboutClose.addEventListener('click', closeAbout);

	aboutModal.addEventListener('click', function(e) {
		if (e.target === aboutModal) closeAbout();
	});

	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape' && !aboutModal.classList.contains('modal-hidden')) closeAbout();
		if (e.key === 'Tab' && !aboutModal.classList.contains('modal-hidden')) {
			e.preventDefault();
			aboutClose.focus();
		}
	});
})();
