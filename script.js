/* -------------------------------
   Section Zoom-in on Scroll
---------------------------------*/
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('show');
      else entry.target.classList.remove('show');
    });
  },
  { threshold: 0.2 }
);
sections.forEach(section => observer.observe(section));

/* -------------------------------
   Video Modal Logic
---------------------------------*/
const videoBtns = document.querySelectorAll('.video-btn');
const videoModal = document.getElementById('videoModal');
const videoElement = document.getElementById('projectVideo');
const closeVideo = document.querySelector('.close-video');

videoBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const videoSrc = btn.dataset.video;
    videoElement.pause();
    videoElement.src = videoSrc;
    videoElement.load();
    videoModal.style.display = 'flex';
    videoElement.play().catch(() => {
      console.log('Autoplay prevented. User must click play manually.');
    });
  });
});

closeVideo.addEventListener('click', () => {
  videoModal.style.display = 'none';
  videoElement.pause();
  videoElement.currentTime = 0;
  videoElement.src = '';
});

/* -------------------------------
   Contact Form Submission via EmailJS
---------------------------------*/
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    name: contactForm.name.value,
    message: contactForm.message.value,
    email: contactForm.email.value
  };

  emailjs.send('service_jktflig', 'template_eaqlup3', formData, 'BqqUI4uP5FxC3aQYq')
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      alert('Thank you! Your message has been sent.');
      contactForm.reset();
    }, (error) => {
      console.error('FAILED...', error);
      alert('Oops! Something went wrong. Please check console.');
    });
});

/* -------------------------------
   Navigation Active Link on Scroll
---------------------------------*/
const navLinks = document.querySelectorAll('.nav-links a');
const sectionsAll = document.querySelectorAll('header, #about, #projects, #contact');

window.addEventListener('scroll', () => {
  let current = '';
  sectionsAll.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      current = section.getAttribute('id') || 'home';
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

/* -------------------------------
   Smooth Scroll on Nav Click
---------------------------------*/
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetID = link.getAttribute('href').slice(1);
    const targetSection = document.getElementById(targetID);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
});

/* -------------------------------
   Floating PNGs in About Section
---------------------------------*/
const canvas = document.getElementById('codingCanvas');
if(canvas) {
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();

  const img1 = new Image();
  img1.src = 'images/img1.png';
  const img2 = new Image();
  img2.src = 'images/img2.png';

  const images = [
    {img: img1, x: 50, y: 50, angle: 0, radius: 40, speed: 0.008},
    {img: img2, x: canvas.width - 200, y: 100, angle: 0, radius: 45, speed: 0.006}
  ];

  function drawImages() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    images.forEach(obj => {
      const imgWidth = 200;
      const imgHeight = 200;
      if(obj.img.complete){
        const newY = obj.y + Math.sin(obj.angle) * obj.radius;
        ctx.drawImage(obj.img, obj.x, newY, imgWidth, imgHeight);
        obj.angle += obj.speed;
      }
    });

    requestAnimationFrame(drawImages);
  }

  img1.onload = img2.onload = () => drawImages();

  window.addEventListener('resize', () => {
    resizeCanvas();
  });
}
const rgbCanvas = document.getElementById('ambientRGB');
const rgbCtx = rgbCanvas.getContext('2d');

function resizeRGBCanvas() {
  rgbCanvas.width = window.innerWidth;
  rgbCanvas.height = window.innerHeight;
}
resizeRGBCanvas();
window.addEventListener('resize', resizeRGBCanvas);

let time = 0;

function drawRGBGlow() {
  const width = rgbCanvas.width;
  const height = rgbCanvas.height;
  rgbCtx.clearRect(0, 0, width, height);

  // Left Edge Glow
  const leftGradient = rgbCtx.createLinearGradient(0, 0, width * 0.3, 0);
  leftGradient.addColorStop(0, `rgba(${Math.floor(255*Math.abs(Math.sin(time)))},0,255,0.15)`);
  leftGradient.addColorStop(1, 'rgba(0,0,0,0)');

  rgbCtx.fillStyle = leftGradient;
  rgbCtx.fillRect(0, 0, width*0.3, height);

  // Right Edge Glow
  const rightGradient = rgbCtx.createLinearGradient(width, 0, width*0.7, 0);
  rightGradient.addColorStop(0, `rgba(255,${Math.floor(255*Math.abs(Math.sin(time+1)))},0,0.15)`);
  rightGradient.addColorStop(1, 'rgba(0,0,0,0)');

  rgbCtx.fillStyle = rightGradient;
  rgbCtx.fillRect(width*0.7, 0, width*0.3, height);

  time += 0.005; // slow movement
  requestAnimationFrame(drawRGBGlow);
}

drawRGBGlow();

