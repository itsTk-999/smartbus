// ===== MOBILE NAV TOGGLE =====
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar ul');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('show');
  });
}

// ===== NAVBAR BACKGROUND CHANGE ON SCROLL =====
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== SCROLL ANIMATIONS FOR DESTINATIONS AND TESTIMONIALS =====
const animateOnScroll = (elements, className) => {
  const windowHeight = window.innerHeight;
  elements.forEach(el => {
    const position = el.getBoundingClientRect().top;
    if (position < windowHeight - 50) {
      el.classList.add(className);
    }
  });
};

window.addEventListener('scroll', () => {
  const destinations = document.querySelectorAll('.dest-card');
  const testimonials = document.querySelectorAll('.testimonial');

  animateOnScroll(destinations, 'show');
  animateOnScroll(testimonials, 'show');
});

// Trigger animation on load
window.addEventListener('load', () => {
  const destinations = document.querySelectorAll('.dest-card');
  const testimonials = document.querySelectorAll('.testimonial');

  animateOnScroll(destinations, 'show');
  animateOnScroll(testimonials, 'show');
});
