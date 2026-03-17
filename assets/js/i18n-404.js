(function() {
	var translations = {
		en: {
			title: '404 | Page Not Found',
			errorTitle: 'Lost in the matrix',
			errorMessage: 'The page you are looking for doesn\'t exist or has been moved.',
			homeLink: 'Go back to the homepage'
		},
		fr: {
			title: '404 | Page introuvable',
			errorTitle: 'Perdu dans la matrice',
			errorMessage: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
			homeLink: 'Retour à l\'accueil'
		}
	};

	var browserLang = (navigator.language || '').substring(0, 2);
	var lang = browserLang === 'fr' ? 'fr' : 'en';
	var t = translations[lang];

	document.title = t.title;
	document.getElementById('error-title').textContent = t.errorTitle;
	document.getElementById('error-message').textContent = t.errorMessage;
	document.getElementById('home-link').textContent = t.homeLink;
	document.documentElement.lang = lang;
})();
