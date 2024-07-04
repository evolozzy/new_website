setTimeout(function() {
  fadeOutPreloader(document.getElementById('preloader'), 69);
}, 1500);

$(document).ready(function() {
  $(window).on('beforeunload', function() {
    window.scrollTo(0, 0);
  });

  /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
  particlesJS.load('landing', 'assets/particles.json', function() {});

  // Typing Text
  var element = document.getElementById('txt-rotate');
  var toRotate = element.getAttribute('data-rotate');
  var period = element.getAttribute('data-period');
  setTimeout(function() {
    new TxtRotate(element, JSON.parse(toRotate), period);
  }, 1500);

  // INJECT CSS
  var css = document.createElement('style');
  css.type = 'text/css';
  css.innerHTML = '#txt-rotate > .wrap { border-right: 0.08em solid #666 }';
  document.body.appendChild(css);

  // Initialize AOS
  AOS.init({
    disable: 'mobile',
    offset: 200,
    duration: 600,
    easing: 'ease-in-sine',
    delay: 100,
    once: true
  });

  randomizeOrder();
});

/* FUNCTIONS */
/* Preloader */

function fadeOutPreloader(element, duration) {
  opacity = 1;

  interval = setInterval(function() {
    if (opacity <= 0) {
      element.style.zIndex = 0;
      element.style.opacity = 0;
      element.style.filter = 'alpha(opacity = 0)';

      // Allow horizontal scroll
      document.documentElement.style.overflowY = 'auto';

      // Remove preloader div
      document.getElementById('preloader').remove();

      clearInterval(interval);
    } else {
      opacity -= 0.1;
      element.style.opacity = opacity;
      element.style.filter = 'alpha(opacity = ' + opacity * 100 + ')';
    }
  }, duration);
}

/* Typing Text */

var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }
  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 5;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

/* Word Cloud */

function randomizeOrder() {
  var parent = document.getElementById('skills');
  var divs = parent.getElementsByTagName('div');
  var frag = document.createDocumentFragment();

  // Randomize order of skills
  while (divs.length) {
    frag.appendChild(divs[Math.floor(Math.random() * divs.length)]);
  }
  parent.appendChild(frag);
};

// Menu Actions

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');

  const smallScreenSize = getComputedStyle(document.documentElement).getPropertyValue('--small-screen').trim();
  const smallScreenSizeNum = parseInt(smallScreenSize, 10);
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const smallScreenSizePx = smallScreenSizeNum * rootFontSize;
  const minHeightPx = 800; 

  const menuBtn = document.getElementById('menu-btn');
  const menuBox = document.getElementById('menu-box');
  const menuItems = document.querySelectorAll('.menu__item'); // All menu items

  console.log('Menu Button:', menuBtn);  // Check if the button is found
  console.log('Menu Box:', menuBox);    // Check if the menu is found

  if (!menuBtn || !menuBox) {
    console.error('The menu button or box is not found!');
    return;  // Stop further execution if elements are not found
  }

  function toggleMenu() {
    menuBox.classList.toggle('show');
    menuBtn.classList.toggle('active');
  }

  menuBtn.addEventListener('click', toggleMenu);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const elementPosition = targetElement.offsetTop;
        const offset = window.innerHeight / 4 - targetElement.offsetHeight / 4;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      } else {
        console.error('Target element not found:', targetId);
      }
    });
  });
    
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      // Check if the current window width is below a certain threshold, e.g., 768px
      if (window.innerWidth <= smallScreenSizePx || window.innerHeight <= minHeightPx) {
        toggleMenu();  
      }
    });
  });
});

