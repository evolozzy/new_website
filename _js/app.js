

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

/* Menu Actions */
const root = getComputedStyle(document.documentElement);
const smallScreenSize = parseInt(root.getPropertyValue('--small-screen'), 10);
const rootFontSize = parseFloat(root.fontSize);
const smallScreenSizePx = smallScreenSize * rootFontSize;

const breakpoints =  {
  small: smallScreenSizePx,
};

window.addEventListener('resize', function() {
  var menuBtn = document.getElementById("menu-btn"); 
  var menuBox = document.getElementById("menu-box");
  if (window.innerWidth >= breakpoints.small) { 
    menuBox.style.display = 'flex'; 
    menuBox.classList.add("show"); 
    menuBtn.classList.remove("active"); 
  } else { 
    if (!menuBox.classList.contains("show")) { 
      menuBox.style.display = 'none'; 
    } 
    menuBtn.classList.remove("active"); 
  } 
});

document.addEventListener('DOMContentLoaded', function() {
  var menuBtn = document.getElementById('menu-btn');
  var menuBox = document.getElementById('menu-box');
  const menuItems = document.querySelectorAll('.menu__item'); 

  if (!menuBtn || !menuBox) {
    console.error('The menu button or box is not found!');
    return;  
  }
  
  function manageMenuDisplay() {
    if (window.innerWidth >= breakpoints.small) {
      menuBox.style.display = 'flex'; 
      menuBox.classList.add("show"); 
      menuBox.style.height = 'auto'; 
      menuBtn.classList.remove("active"); 
    } else {
      menuBox.style.display = 'none'; //
      menuBox.classList.remove("show"); //
      menuBtn.classList.remove("active"); //
    }
  }

  function toggleMenu() {
    const isShown = menuBox.classList.contains("show");
    if (window.innerWidth < breakpoints.small) {
      if (isShown) {
        menuBtn.classList.remove("active");
        menuBox.classList.add('fadeInSlideUp'); 
        menuBox.classList.remove('fadeInSlideDown'); 
        menuBox.addEventListener('animationend', function handler() {
          menuBox.classList.remove("show", 'fadeInSlideUp'); 
          menuBox.style.display = 'none'; 
          menuBox.removeEventListener('animationend', handler);
        });
      } else {
        menuBtn.classList.add("active");
        menuBox.style.display = 'flex'; 
        menuBox.classList.add('show', 'fadeInSlideDown'); 
        menuBox.classList.remove('fadeInSlideUp'); 
      }
    }
  }

  menuBtn.addEventListener("click", toggleMenu);
  menuBox.addEventListener("click",toggleMenu);
  window.addEventListener('resize', manageMenuDisplay);
  window.addEventListener('orientationchange', manageMenuDisplay);  //
  manageMenuDisplay();

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
      if (window.innerWidth <= breakpoints.small) {
        toggleMenu();  
      }
    });
  });
});

