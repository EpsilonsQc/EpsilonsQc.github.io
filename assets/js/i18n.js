(function() {
	var translations = {
		en: {
			title: 'Alexandre Perreault | Developer',
			tagline: 'Software Engineer &nbsp;&bull;&nbsp; Game Developer &nbsp;&bull;&nbsp; Game Designer',
			emailTooltip: 'Email',
			toggleLabel: 'FR',
			toggleTitle: 'Français',
			aboutLink: 'About me',
			aboutTexts: [
				'Software engineer with a background in game development (C++, C#, Unity, Unreal Engine), now building cross-platform solutions spanning web, desktop, and mobile. Working daily with Java, C# (.NET Core), Blazor/MudBlazor, SQL, JavaScript, and CSS to deliver modern enterprise applications.',
				'Passionate about clean code, interactive experiences, and solving real-world problems through technology.'
			]
		},
		fr: {
			title: 'Alexandre Perreault | Développeur',
			tagline: 'Programmeur &nbsp;&bull;&nbsp; Développeur de jeux &nbsp;&bull;&nbsp; Concepteur de jeux',
			emailTooltip: 'Courriel',
			toggleLabel: 'EN',
			toggleTitle: 'English',
			aboutLink: 'À propos',
			aboutTexts: [
				'Programmeur avec un parcours en développement de jeux vidéo (C++, C#, Unity, Unreal Engine), maintenant orienté vers le développement de solutions multiplateformes : web, bureau et mobile. Au quotidien, je travaille avec Java, C# (.NET Core), Blazor/MudBlazor, SQL, JavaScript et CSS pour livrer des applications d\'entreprise modernes.',
				'Passionné par le code propre, les expériences interactives et la résolution de problèmes concrets grâce à la technologie.'
			]
		}
	};

	var currentLang = 'en';
	var tagline = document.getElementById('tagline');
	var toggle = document.getElementById('lang-toggle');
	var emailLink = document.querySelector('a[href^="mailto:"]');
	var aboutLink = document.getElementById('about-link');
	var aboutContent = document.getElementById('about-modal-content');

	function apply(lang) {
		currentLang = lang;
		var t = translations[lang];
		document.title = t.title;
		tagline.innerHTML = t.tagline;
		if (emailLink) emailLink.title = t.emailTooltip;
		toggle.textContent = t.toggleLabel;
		toggle.title = t.toggleTitle;
		aboutLink.title = t.aboutLink;
		var paragraphs = aboutContent.querySelectorAll('p');
		t.aboutTexts.forEach(function(text, i) {
			if (paragraphs[i]) paragraphs[i].textContent = text;
		});
		document.documentElement.lang = lang;
	}

	// Detect browser language and apply
	var browserLang = (navigator.language || '').substring(0, 2);
	apply(browserLang === 'fr' ? 'fr' : 'en');

	// Toggle button
	toggle.addEventListener('click', function() {
		apply(currentLang === 'en' ? 'fr' : 'en');
	});
})();
