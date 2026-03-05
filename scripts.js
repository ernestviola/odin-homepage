let mouseX;
let mouseY;

let PAGE_HEIGHT = calculatePageHeight();

window.addEventListener('resize', () => {
  PAGE_HEIGHT = calculatePageHeight();
});

document.addEventListener('mousemove', (e) => {
  mouseX = e.pageX;
  mouseY = e.pageY;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('project-onscreen');
      observer.unobserve(entry.target);
    }
  });
});

const projects = document.querySelectorAll('.project');

projects.forEach((project) => {
  observer.observe(project);
});

let fallingObjects = [];

setInterval(() => {
  const element = document.createElement('div');
  const velocityX = 0;
  const velocityY = Math.floor(Math.random() * 2) + 2;
  const rotationAngle = Math.floor(Math.random() * 360);
  const rotationSpeed = Math.floor(Math.random() * 2) + 3;
  const rotationDirection = Math.random() > 0.5 ? -1 : 1;
  const size = Math.floor(Math.random() * 25) + 50;
  element.classList.add('square');

  fallingObjects.push(
    new FallingObject(
      element,
      velocityX,
      velocityY,
      rotationAngle,
      rotationSpeed,
      rotationDirection,
      size,
    ),
  );

  document.body.appendChild(element);
}, 1000);

animate();

function animate() {
  fallingObjects.forEach((obj) => {
    if (mouseX !== undefined && mouseY !== undefined) {
      obj.applyMouseRepulsion(mouseX, mouseY);
    }

    obj.iteratePosition();
    obj.iterateAngle();
    obj.render();

    if (obj.y > PAGE_HEIGHT) {
      obj.remove();
    }
  });
  fallingObjects = fallingObjects.filter((obj) => obj.y <= PAGE_HEIGHT);
  requestAnimationFrame(animate);
}

function calculatePageHeight() {
  const lastSection = document.querySelector('footer');
  return lastSection
    ? lastSection.offsetTop + lastSection.offsetHeight
    : document.body.scrollHeight;
}

class FallingObject {
  #OBJECT_THRESHOLD = 100;
  element;
  x = Math.random() * window.innerWidth;
  y = 0;
  velocityX;
  velocityY;
  rotationAngle;
  rotationSpeed;
  size;
  constructor(
    element,
    velocityX,
    velocityY,
    rotationAngle,
    rotationSpeed,
    rotationDirection,
    size,
  ) {
    this.element = element;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.rotationAngle = rotationAngle;
    this.rotationSpeed = rotationSpeed;
    this.rotationDirection = rotationDirection;
    this.size = size;

    this.element.style.height = `${this.size}px`;
    this.element.style.width = `${this.size}px`;
    this.element.style.position = 'absolute';
    this.element.style.top = 0;
    this.element.style.left = 0;
    this.element.style.zIndex = -2;
  }

  iterateAngle() {
    this.rotationAngle += this.rotationSpeed * this.rotationDirection;
  }

  iteratePosition() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityX *= 0.95;
    if (this.velocityY <= 6) {
      this.velocityY += 0.1;
    }
  }

  applyMouseRepulsion(mouseX, mouseY) {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.#OBJECT_THRESHOLD) {
      const directionX = dx / distance;
      const directionY = dy / distance;
      const pushStrength = (this.#OBJECT_THRESHOLD - distance) * 0.2;

      this.velocityX += directionX * pushStrength;
      this.velocityY += directionY * pushStrength;
    }
  }

  render() {
    this.element.style.transform = `translateX(${this.x}px) translateY(${this.y}px) rotate(${this.rotationAngle}deg)`;
  }

  remove() {
    this.element.remove();
  }
}
