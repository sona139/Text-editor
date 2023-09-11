export default function convertHSL(data) {
	// Set the color properties
	const alpha = data.alpha;
	const brightness = data.brightness;
	const hue = data.hue;
	const saturation = data.saturation;

	// Convert HSL to RGB
	const c = (1 - Math.abs(2 * brightness - 1)) * saturation;
	const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
	const m = brightness - c / 2;

	let r, g, b;
	if (hue >= 0 && hue < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (hue >= 60 && hue < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (hue >= 120 && hue < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (hue >= 180 && hue < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (hue >= 240 && hue < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (hue >= 300 && hue < 360) {
		r = c;
		g = 0;
		b = x;
	}

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	// Convert RGB to hexadecimal
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
