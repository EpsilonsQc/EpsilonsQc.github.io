window.onload = function() { document.body.classList.remove('is-preload'); };
if (screen.orientation) {
	screen.orientation.addEventListener('change', function() { document.body.scrollTop = 0; });
}
document.getElementById('year').textContent = new Date().getFullYear();
