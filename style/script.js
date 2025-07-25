const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let cw, ch;

function resize() {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function distance(aX, aY, bX, bY) {
  const dx = bX - aX;
  const dy = bY - aY;
  return Math.sqrt(dx * dx + dy * dy);
}

class Firework {
  constructor(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = distance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while(this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 5;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    this.targetRadius = 8;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if(this.targetRadius < 8) this.targetRadius += 0.3;
    this.speed *= this.acceleration;

    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = distance(this.sx, this.sy, this.x + vx, this.y + vy);

    if(this.distanceTraveled >= this.distanceToTarget) {
      createParticles(this.tx, this.ty);
      fireworks.splice(index, 1);
    } else {
      this.x += vx;
      this.y += vy;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${random(0, 360)}, 100%, ${this.brightness}%)`;
    ctx.stroke();

    // ctx.beginPath();
    // ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    // ctx.stroke();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while(this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    this.friction = 0.95;
    this.gravity = 0.7;
    this.hue = random(0, 360);
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if(this.alpha <= 0) {
      particles.splice(index, 1);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
    ctx.stroke();
  }
}

function createParticles(x, y) {
  let particleCount = 30;
  while(particleCount--) {
    particles.push(new Particle(x, y));
  }
}

let fireworks = [];
let particles = [];

function loop() {
  requestAnimationFrame(loop);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = 'lighter';

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].draw();
    particles[i].update(i);
  }

  if(fireworks.length < 5) {
    fireworks.push(new Firework(
      cw / 2,
      ch,
      random(100, cw - 100),
      random(50, ch / 2)
    ));
  }
}
loop();