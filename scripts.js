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

setInterval(() => {
  spawnSquare();
}, 800);

function spawnSquare() {
  const square = document.createElement('div');
  square.className = 'square';

  const pageHeight = document.body.scrollHeight - 50;
  square.style.setProperty('--fall-distance', `${pageHeight}px`);

  const pageWidth = window.innerWidth * Math.random();
  square.style.left = `${pageWidth}px`;

  const duration = Math.random() * 4 + 15;
  square.style.animationDuration = `${duration}s`;

  square.addEventListener('animationend', () => {
    square.remove();
  });

  document.body.appendChild(square);
  return square;
}
