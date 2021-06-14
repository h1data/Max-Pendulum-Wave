/**
 * Pendulum Wave drawer for js (jit.mgraphics)
 * @author h1data
 */

inlets = 1;
outlets = 1;
var TWOPI = Math.PI*2;
var f, l, rgb;
var t = 0;
var numBalls = 32;
var thetaMax = 0.08;  // 28.8degree
var ballSize = 9;
var initialHue = 0.33;
var widthHue = 0.789;
var chroma = 0.666;
var brightness = 1.0;
var cycles = 60;	// per 1 minute
var deltaT = 0.001 * 0.75;

function init() {
	f = new Array(numBalls);
  l = new Array(numBalls);
	rgb = new Array(numBalls);
  var tempT = cycles;
  for (var i=0; i<numBalls; i++, tempT--) {
    f[i] = tempT / cycles;
		// ts(i) = 60 -> l(i) = 1.0
    l[i] = Math.pow(tempT, 2) * 0.09;
  }
	setcolor(initialHue, widthHue, chroma, brightness);
}
init();

function setcolor(hue, width, c, b) {
  for (var i=0; i<numBalls; i++) {
		var h = (hue + width*i/numBalls) % 1.0;
		rgb[numBalls - i - 1] = hsvToRgb(h, c, b);
	}
}

function paint() {
  outlet(0, 'clear_surface');
  // outlet(0, 'rectangle', 0, 0, 350, 350, 'set_source_rgba', 0, 0, 0, 1, 'fill');

  for (var i=0; i<l.length; i++) {
    var theta = thetaMax * Math.cos(t*f[i]*TWOPI) * TWOPI;
		var sin = Math.sin(theta);
		var cos = Math.cos(theta);
    outlet(0, 'set_source_rgba', 0.5, 0.5, 0.5, 0.25);
    outlet(0, 'set_line_width', 1.5);
    outlet(0, 'move_to', 175, 0);
    outlet(0, 'line_to', 175 + (l[i] - ballSize) * sin, (l[i] - ballSize) * cos);
    outlet(0, 'stroke');

    outlet(0, 'set_source_rgba', rgb[i][0], rgb[i][1], rgb[i][2], 0.6666667);
    outlet(0, 'arc', 175 + l[i] * sin, l[i] * cos, ballSize, 0, TWOPI);
    outlet(0, 'fill');
  }
}

function bang()
{
	paint();
}

function msg_float(v) {
	t = v * deltaT;
	paint();
}

function forcesize(w,h)
{
	if (w!=h) {
		h = w;
		box.size(w,h);
	}
}
forcesize.local = 1; //private

function onresize(w,h)
{
	forcesize(w,h);
}
onresize.local = 1; //private

function hsvToRgb(h, s, v) {
	var c = v * s;
	var hp = h * 6.0;
	var x = c * (1 - Math.abs(hp % 2 - 1));

	var R, G, B;
	if (0 <= hp && hp < 1) {
		[R, G, B] = [c, x, 0];
	} else if (1 <= hp && hp < 2) {
		[R, G, B] = [x, c, 0];
	} else if (2 <= hp && hp < 3) {
		[R, G, B] = [0, c, x];
	} else if (3 <= hp && hp < 4) {
		[R, G, B] = [0, x, c];
	} else if (4 <= hp && hp < 5) {
		[R, G, B] = [x, 0, c];
	} else if (5 <= hp && hp < 6) {
		[R, G, B] = [c, 0, x];
	}

	var m = v - c;
	[R, G, B] = [R + m, G + m, B + m];
	return [R, G, B];
}
hsvToRgb.local = 1;
