(function() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	var canvas = document.getElementById('bg');
	if (!canvas || !canvas.getContext) return;
	var ctx = canvas.getContext('2d');
	var chars = '{}[]()<>=+-*/|&!?;:.0123456789abcdef';
	var fontSize = 17;
	var columns, drops, speeds;

	function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		columns = Math.floor(canvas.width / fontSize);
		drops = [];
		speeds = [];
		for (var i = 0; i < columns; i++) {
			drops[i] = Math.random() * -50;
			speeds[i] = 0.3 + Math.random() * 0.7;
		}
	}
	resize();
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	window.addEventListener('resize', resize);

	var frame = 0;
	function draw() {
		ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Every 3s, snap near-black pixels to pure black
		if (++frame % 60 === 0) {
			var id = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var d = id.data;
			for (var i = 0; i < d.length; i += 4) {
				if (d[i] < 6 && d[i+1] < 10 && d[i+2] < 6) {
					d[i] = 0; d[i+1] = 0; d[i+2] = 0;
				}
			}
			ctx.putImageData(id, 0, 0);
		}
		ctx.font = fontSize + 'px monospace';

		var cx = canvas.width / 2;
		var fadeStart = canvas.width * 0.22;
		var fadeEnd = canvas.width * 0.42;

		for (var i = 0; i < columns; i++) {
			var y = drops[i] * fontSize;
			if (y > 0) {
				var x = i * fontSize;
				var distFromCenter = Math.abs(x - cx);
				if (distFromCenter < fadeStart) { drops[i] += speeds[i]; if (y > canvas.height && Math.random() > 0.975) { drops[i] = Math.random() * -20; speeds[i] = 0.3 + Math.random() * 0.7; } continue; }
				var alpha = distFromCenter >= fadeEnd ? 1.0 : ((distFromCenter - fadeStart) / (fadeEnd - fadeStart));
				var ch = chars[Math.floor(Math.random() * chars.length)];
				ctx.fillStyle = 'rgba(74, 222, 128, ' + alpha.toFixed(3) + ')';
				ctx.fillText(ch, x, y);
			}
			drops[i] += speeds[i];
			if (y > canvas.height && Math.random() > 0.975) {
				drops[i] = Math.random() * -20;
				speeds[i] = 0.3 + Math.random() * 0.7;
			}
		}
	}
	setInterval(draw, 50);
})();
