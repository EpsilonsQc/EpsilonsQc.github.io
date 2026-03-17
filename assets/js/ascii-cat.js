(function() {
	var COLS = 64;
	var ROWS = 28;
	var CHARS = [' ','\u00b7','~','o','x','+','=','*','%','$','@'];
	var catPre = document.getElementById('cat-art');
	var frames = [];
	var blinkHTML = '';
	var eyeX = 2, eyeY = 1;
	var blinking = false;
	var lastMove = 0;
	var driftAngle = 0;
	var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var ready = false;

	// SVG paths — organic cat-eye shapes, vertical slit irises, W-mouth
	var EYE_L = 'M44 51C36 48 30 53 27 56C25 59 25 61 25 62C26 66 29 72 37 75C45 77 51 73 54 70C55 69 55 67 55 65C54 61 52 54 44 51Z';
	var EYE_R = 'M97 51C105 48 111 53 114 56C116 59 116 61 116 62C115 66 112 72 104 75C96 77 90 73 87 70C86 69 86 67 86 65C87 61 89 54 97 51Z';
	var IRIS_L = 'M45 63C45 68 43 73 40.5 73C38 73 36 68 36 63C36 58 38 53 40.5 53C43 53 45 58 45 63Z';
	var IRIS_R = 'M96 63C96 68 98 73 100.5 73C103 73 105 68 105 63C105 58 103 53 100.5 53C98 53 96 58 96 63Z';
	var MOUTH = 'M70 82C72 82 75 81 75 83C76 85 73 87 72 88C72 88 72 88 72 89C73 91 74 93 77 94C81 94 83 91 84 90C84 89 86 89 86 90C87 90 87 91 86 92C85 94 83 97 79 97C74 97 71 94 70 93C69 94 67 97 62 97C57 97 55 94 55 92C54 91 54 90 55 90C55 89 57 89 57 90C58 91 60 94 63 94C67 93 68 91 69 89C69 88 69 88 68 88C68 87 65 85 66 83C66 81 68 82 70 82Z';

	function buildSVG(dx, dy, blink) {
		var s = '<svg xmlns="http://www.w3.org/2000/svg" width="141" height="141" viewBox="0 0 141 141" fill="none">';
		s += '<defs>';
		s += '<filter id="g0" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>';
		s += '<filter id="g1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>';
		s += '<filter id="g2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>';
		s += '</defs>';
		if (blink) {
			s += '<line x1="25" y1="63" x2="55" y2="63" stroke="#6BFA80" stroke-width="3" stroke-linecap="round"/>';
			s += '<line x1="86" y1="63" x2="116" y2="63" stroke="#6BFA80" stroke-width="3" stroke-linecap="round"/>';
		} else {
			// Left eye: glow + solid + iris
			s += '<g opacity="0.6" filter="url(#g0)"><path d="'+EYE_L+'" fill="#1BFF3D"/></g>';
			s += '<path d="'+EYE_L+'" fill="#6BFA80"/>';
			s += '<g transform="translate('+dx+','+dy+')"><path d="'+IRIS_L+'" fill="#2F393A"/></g>';
			// Right eye: glow + solid + iris
			s += '<g opacity="0.6" filter="url(#g1)"><path d="'+EYE_R+'" fill="#1BFF3D"/></g>';
			s += '<path d="'+EYE_R+'" fill="#6BFA80"/>';
			s += '<g transform="translate('+dx+','+dy+')"><path d="'+IRIS_R+'" fill="#2F393A"/></g>';
		}
		// Mouth: glow + solid (always visible)
		s += '<g opacity="0.6" filter="url(#g2)"><path d="'+MOUTH+'" fill="#1BFF3D"/></g>';
		s += '<path d="'+MOUTH+'" fill="#6BFA80"/>';
		s += '</svg>';
		return s;
	}

	function rasterize(svgStr) {
		return new Promise(function(resolve) {
			var c = document.createElement('canvas');
			c.width = COLS; c.height = ROWS;
			var ctx = c.getContext('2d');
			var img = new Image();
			var blob = new Blob([svgStr], {type:'image/svg+xml;charset=utf-8'});
			var url = URL.createObjectURL(blob);
			img.onload = function() {
				ctx.drawImage(img, 0, 0, COLS, ROWS);
				URL.revokeObjectURL(url);
				var d = ctx.getImageData(0, 0, COLS, ROWS).data;
				var grid = [];
				for (var y = 0; y < ROWS; y++) {
					var row = [];
					for (var x = 0; x < COLS; x++) {
						var p = (y * COLS + x) * 4;
						var lum = (0.299*d[p] + 0.587*d[p+1] + 0.114*d[p+2]) * (d[p+3]/255);
						var ci = Math.floor(lum / 255 * CHARS.length);
						if (ci >= CHARS.length) ci = CHARS.length - 1;
						row.push(CHARS[ci]);
					}
					grid.push(row);
				}
				resolve(grid);
			};
			img.onerror = function() { URL.revokeObjectURL(url); resolve([]); };
			img.src = url;
		});
	}

	// SVG-to-canvas scale factors
	var SX = COLS / 141;
	var SY = ROWS / 141;
	// Iris ellipse half-axes in canvas coords (slightly padded)
	var IRX = 7 * SX;
	var IRY = 13 * SY;

	function toHTML(grid, dx, dy) {
		// Iris centers in canvas coordinates
		var lx = (40.5 + dx) * SX, ly = (63 + dy) * SY;
		var rx = (100.5 + dx) * SX, ry = (63 + dy) * SY;
		var h = '';
		for (var y = 0; y < grid.length; y++) {
			for (var x = 0; x < grid[y].length; x++) {
				var ch = grid[y][x];
				if (ch === ' ') { h += ' '; }
				else {
					var d = CHARS.indexOf(ch) / (CHARS.length - 1);
					var op = (0.3+d*0.7).toFixed(2);
					// Check if inside left or right iris ellipse
					var dlx = (x-lx)/IRX, dly = (y-ly)/IRY;
					var drx = (x-rx)/IRX, dry = (y-ry)/IRY;
					var inIris = (dlx*dlx+dly*dly <= 1) || (drx*drx+dry*dry <= 1);
					if (inIris && d < 0.5) {
						h += '<span style="color:#888;opacity:'+op+'">'+ch+'</span>';
					} else {
						h += '<span style="opacity:'+op+'">'+ch+'</span>';
					}
				}
			}
			if (y < grid.length - 1) h += '\n';
		}
		return h;
	}

	function show() {
		if (!ready) return;
		catPre.innerHTML = blinking ? blinkHTML : (frames[eyeY] && frames[eyeY][eyeX] || frames[1][2]);
	}

	async function init() {
		var ox = [-6, -3, 0, 3, 6];
		var oy = [-4, 0, 4];
		for (var ey = 0; ey < 3; ey++) {
			frames[ey] = [];
			for (var ex = 0; ex < 5; ex++) {
				var grid = await rasterize(buildSVG(ox[ex], oy[ey], false));
				frames[ey][ex] = toHTML(grid, ox[ex], oy[ey]);
			}
		}
		blinkHTML = toHTML(await rasterize(buildSVG(0, 0, true)), 0, 0);
		ready = true;
		show();
	}

	// Mouse tracking — /300 normalization matching Moshi
	document.addEventListener('mousemove', function(e) {
		lastMove = Date.now();
		var rect = catPre.getBoundingClientRect();
		var cx = rect.left + rect.width / 2;
		var cy = rect.top + rect.height / 2;
		var dx = e.clientX - cx;
		var dy = e.clientY - cy;
		var nx = Math.max(-1, Math.min(1, dx / 300));
		var ny = Math.max(-1, Math.min(1, dy / 300));
		eyeX = Math.max(0, Math.min(4, Math.round((nx + 1) * 2)));
		eyeY = Math.max(0, Math.min(2, Math.round(ny + 1)));
		show();
		var mx = Math.max(-15, Math.min(15, dx * 0.02));
		var my = Math.max(-8, Math.min(8, dy * 0.015));
		catPre.style.transform = 'translate('+mx+'px,'+my+'px)';
	});

	document.addEventListener('touchmove', function(e) {
		var t = e.touches[0];
		document.dispatchEvent(new MouseEvent('mousemove', {clientX:t.clientX,clientY:t.clientY}));
	});

	// Blink: 2-5s interval, 250ms duration, 20% chance of double blink
	function doBlink() {
		blinking = true; show();
		setTimeout(function() { blinking = false; show(); }, 250);
	}
	function blink() {
		if (ready) {
			doBlink();
			if (Math.random() < 0.2) {
				setTimeout(doBlink, 450);
			}
		}
		setTimeout(blink, 2000 + Math.random() * 3000);
	}
	if (!reducedMotion) {
		setTimeout(blink, 4000 + Math.random() * 2000);

		// Idle drift: sine wave, speed 0.03, amplitude 0.6
		(function drift() {
			if (Date.now() - lastMove > 3000 && !blinking && ready) {
				driftAngle += 0.03;
				var d = Math.sin(driftAngle) * 0.6;
				eyeX = Math.max(0, Math.min(4, Math.round((d + 1) * 2)));
				eyeY = 1;
				show();
			}
			requestAnimationFrame(drift);
		})();
	}

	init();
})();
