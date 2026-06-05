(function () {
  var layer = document.getElementById('brains-layer');
  if (!layer) return;

  var PUSH_RADIUS = 110;
  var PUSH_FORCE  = 280;
  var MAX_SPEED   = 2.2;
  var FRICTION    = 0.994;

  var variants = [
    { src: 'images/cerebros png/1.png', filter: 'none',                                               size: 110 },
    { src: 'images/cerebros png/2.png', filter: 'none',                                               size: 100 },
    { src: 'images/cerebros png/3.png', filter: 'none',                                               size: 120 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(200deg) saturate(1.1) brightness(1.1)',   size: 105 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(210deg) saturate(1.2)',                   size: 115 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(205deg) saturate(1.1)',                   size: 100 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(215deg) saturate(1.0)',                   size: 135 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(270deg) saturate(1.2)',                   size: 108 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(260deg) saturate(1.1)',                   size: 100 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(280deg) saturate(1.2)',                   size: 125 },
    { src: 'images/cerebros png/2.png', filter: 'hue-rotate(265deg) saturate(1.3) brightness(1.2)',   size: 102 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(60deg)  saturate(1.2) brightness(1.1)',   size: 105 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(50deg)  saturate(1.1)',                   size: 115 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(40deg)  saturate(1.2)',                   size: 100 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(20deg)  saturate(1.2)',                   size: 145 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(30deg)  saturate(1.1) brightness(1.1)',   size: 110 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(90deg)  saturate(1.3)',                   size: 108 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(100deg) saturate(1.2)',                   size: 120 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(80deg)  saturate(1.2) brightness(1.1)',   size: 100 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(110deg) saturate(1.1)',                   size: 112 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(180deg) saturate(1.1) brightness(1.1)',   size: 105 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(170deg) saturate(1.2)',                   size: 130 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(190deg) saturate(1.1)',                   size: 100 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(330deg) saturate(1.1)',                   size: 100 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(340deg) saturate(1.2)',                   size: 112 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(350deg) saturate(1.1)',                   size: 105 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(310deg) saturate(1.1)',                   size: 105 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(315deg) saturate(1.1) brightness(1.1)',   size: 118 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(320deg) saturate(1.2)',                   size: 100 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(150deg) saturate(1.2) brightness(1.1)',   size: 102 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(160deg) saturate(1.1)',                   size: 110 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(355deg) saturate(1.2) brightness(1.1)',   size: 108 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(10deg)  saturate(1.2)',                   size: 100 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(75deg)  saturate(1.3) brightness(1.1)',   size: 105 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(235deg) saturate(1.2)',                   size: 108 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(245deg) saturate(1.1)',                   size: 100 },
    { src: 'images/cerebros png/3.png', filter: 'hue-rotate(130deg) saturate(1.1) opacity(0.55)',     size: 160 },
    { src: 'images/cerebros png/1.png', filter: 'hue-rotate(240deg) saturate(1.1) opacity(0.55)',     size: 155 },
    { src: 'images/cerebros png/3.png', filter: 'opacity(0.5)',                                        size: 170 },
    { src: 'images/cerebros png/2.png', filter: 'opacity(0.45)',                                       size: 150 },
    { src: 'images/cerebros png/2.png', filter: 'brightness(0.6)',                                     size: 104 },
    { src: 'images/cerebros png/2.png', filter: 'brightness(1.4) invert(0.1)',                         size: 110 },
    { src: 'images/cerebros png/1.png', filter: 'brightness(1.5) saturate(0.3)',                       size: 102 },
    { src: 'images/cerebros png/3.png', filter: 'brightness(1.6) saturate(0.2)',                       size: 108 },
  ];

  // En móvil usar solo 10 cerebros
  var isMobile = window.innerWidth <= 900;
  if (isMobile) {
    variants = variants.filter(function (_, i) { return i % 4 === 0 || i < 3; }).slice(0, 10);
  }

  var balls = variants.map(function (v) {
    var img = document.createElement('img');
    img.src = v.src;
    img.className = 'brain-ball';
    img.draggable = false;
    img.style.width  = v.size + 'px';
    img.style.height = v.size + 'px';
    img.style.cursor = 'grab';
    if (v.filter !== 'none') img.style.filter = v.filter;
    layer.appendChild(img);

    var W = window.innerWidth;
    var H = window.innerHeight;
    var angle = Math.random() * Math.PI * 2;
    var speed = 1.2 + Math.random() * 1.4;

    return {
      el:        img,
      size:      v.size,
      x:         Math.random() * (W - v.size),
      y:         Math.random() * (H - v.size),
      vx:        Math.cos(angle) * speed,
      vy:        Math.sin(angle) * speed,
      // flotación suave — única por cerebro
      floatFreq: 0.28 + Math.random() * 0.22,   // ciclos/seg
      floatAmp:  3.5  + Math.random() * 4.0,    // amplitud px, apenas noticia
      floatPhase: Math.random() * Math.PI * 2,
      baseY:     0,   // se actualiza al parar
      dragging:  false,
      dragOffX:  0,
      dragOffY:  0,
      prevX:     0,
      prevY:     0,
    };
  });

  /* ── Drag ── */
  var dragged = null;
  var mouseX  = 0;
  var mouseY  = 0;

  balls.forEach(function (b) {
    b.el.addEventListener('mousedown', function (e) {
      e.preventDefault();
      dragged    = b;
      b.dragging = true;
      b.dragOffX = e.clientX - b.x;
      b.dragOffY = e.clientY - b.y;
      b.prevX    = b.x;
      b.prevY    = b.y;
      b.vx = 0; b.vy = 0;
      b.el.style.cursor    = 'grabbing';
      b.el.style.zIndex    = 999;
      b.el.style.transform = 'scale(1.1)';
    });

    b.el.addEventListener('touchstart', function (e) {
      e.preventDefault();
      var t = e.touches[0];
      dragged    = b;
      b.dragging = true;
      b.dragOffX = t.clientX - b.x;
      b.dragOffY = t.clientY - b.y;
      b.prevX    = b.x;
      b.prevY    = b.y;
      b.vx = 0; b.vy = 0;
      b.el.style.zIndex    = 999;
      b.el.style.transform = 'scale(1.1)';
    }, { passive: false });
  });

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (dragged && dragged.dragging) {
      dragged.prevX = dragged.x;
      dragged.prevY = dragged.y;
      dragged.x = e.clientX - dragged.dragOffX;
      dragged.y = e.clientY - dragged.dragOffY;
    }
  });

  function release() {
    if (dragged) {
      dragged.vx = (dragged.x - dragged.prevX) * 1.6;
      dragged.vy = (dragged.y - dragged.prevY) * 1.6;
      dragged.baseY = dragged.y;
      dragged.dragging = false;
      dragged.el.style.cursor    = 'grab';
      dragged.el.style.zIndex    = '';
      dragged.el.style.transform = '';
      dragged = null;
    }
  }
  document.addEventListener('mouseup',  release);
  document.addEventListener('touchend', release);

  document.addEventListener('touchmove', function (e) {
    if (dragged && dragged.dragging) {
      var t = e.touches[0];
      dragged.prevX = dragged.x;
      dragged.prevY = dragged.y;
      dragged.x = t.clientX - dragged.dragOffX;
      dragged.y = t.clientY - dragged.dragOffY;
    }
  }, { passive: false });

  /* ── Loop ── */
  var startTime = performance.now();

  function tick(now) {
    var W = window.innerWidth;
    var H = window.innerHeight;
    var t = (now - startTime) * 0.001;

    balls.forEach(function (b) {
      if (b.dragging) {
        b.el.style.left = b.x + 'px';
        b.el.style.top  = b.y + 'px';
        return;
      }

      /* ── Empuje cursor ── */
      var cx = b.x + b.size / 2;
      var cy = b.y + b.size / 2;
      var dx = cx - mouseX;
      var dy = cy - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < PUSH_RADIUS && dist > 1) {
        var f = (1 - dist / PUSH_RADIUS) * PUSH_FORCE;
        b.vx += (dx / dist) * f * 0.016;
        b.vy += (dy / dist) * f * 0.016;
      }

      /* ── Repulsión suave de bordes ── */
      var margin = 90;
      if (cx < margin)     b.vx += (1 - cx / margin) * 1.8;
      if (cx > W - margin) b.vx -= (1 - (W - cx) / margin) * 1.8;
      if (cy < margin)     b.vy += (1 - cy / margin) * 1.8;
      if (cy > H - margin) b.vy -= (1 - (H - cy) / margin) * 1.8;

      /* ── Velocidad máxima ── */
      var speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (speed > MAX_SPEED) {
        b.vx = b.vx / speed * MAX_SPEED;
        b.vy = b.vy / speed * MAX_SPEED;
      }

      b.vx *= FRICTION;
      b.vy *= FRICTION;
      b.x  += b.vx;
      b.y  += b.vy;

      /* ── Flotación suave encima del movimiento ──
         Se aplica solo cuando la velocidad es baja (parece una nube en calma) */
      var floatBlend = Math.max(0, 1 - speed / 1.2);
      var floatOffset = Math.sin(t * b.floatFreq * Math.PI * 2 + b.floatPhase) * b.floatAmp * floatBlend;

      /* Límites duros */
      b.x = Math.max(0, Math.min(W - b.size, b.x));
      b.y = Math.max(0, Math.min(H - b.size, b.y));

      b.el.style.left = b.x + 'px';
      b.el.style.top  = (b.y + floatOffset) + 'px';
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
