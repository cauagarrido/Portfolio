// Theme Management
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.themeIcon = this.themeToggle.querySelector('.theme-icon');
    this.body = document.body;
    
    this.init();
  }
  
  init() {
    // Check for saved theme preference or default to dark theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else if (prefersDark) {
      this.setTheme('dark');
    } else {
      this.setTheme('dark'); // Default to dark as specified
    }
    
    // Add event listener for theme toggle
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  setTheme(theme) {
    if (theme === 'dark') {
      this.body.classList.remove('light-theme');
      this.body.classList.add('dark-theme');
      this.themeIcon.textContent = '🌙';
    } else {
      this.body.classList.remove('dark-theme');
      this.body.classList.add('light-theme');
      this.themeIcon.textContent = '☀️';
    }
    
    localStorage.setItem('theme', theme);
  }
  
  toggleTheme() {
    const currentTheme = this.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}

// Smooth Scrolling for Navigation Links
class SmoothScroll {
  constructor() {
    this.init();
  }
  
  init() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        
        if (target) {
          const headerOffset = 80; // Account for fixed navbar
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Intersection Observer for Animations
class AnimationObserver {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }
  
  init() {
    // Create intersection observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          this.observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);
    
    // Observe elements for animation
    this.observeElements();
  }
  
  observeElements() {
    const elementsToAnimate = document.querySelectorAll(
      '.tech-card, .project-card, .contact-link, .section-title, .about-content'
    );
    
    elementsToAnimate.forEach(element => {
      element.classList.add('animate-ready');
      this.observer.observe(element);
    });
  }
}

// Navbar Scroll Effect
class NavbarScroll {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.lastScrollY = window.scrollY;
    
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', () => this.handleScroll());
  }
  
  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Add/remove scrolled class based on scroll position
    if (currentScrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar based on scroll direction
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      this.navbar.style.transform = 'translateY(-100%)';
    } else {
      this.navbar.style.transform = 'translateY(0)';
    }
    
    this.lastScrollY = currentScrollY;
  }
}

// Typing Animation for Hero Section
class TypingAnimation {
  constructor() {
    this.heroTitle = document.querySelector('.hero-title');
    this.originalText = this.heroTitle.textContent;
    this.init();
  }
  
  init() {
    // Only run animation on first load
    if (!sessionStorage.getItem('heroAnimationPlayed')) {
      this.startTypingAnimation();
      sessionStorage.setItem('heroAnimationPlayed', 'true');
    }
  }
  
  startTypingAnimation() {
    this.heroTitle.textContent = '';
    let i = 0;
    
    const typeWriter = () => {
      if (i < this.originalText.length) {
        this.heroTitle.textContent += this.originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };
    
    // Start typing after a short delay
    setTimeout(typeWriter, 500);
  }
}

// Performance and Accessibility Utilities
class Utils {
  static prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize core functionality
  new ThemeManager();
  new SmoothScroll();
  new NavbarScroll();
  
  // Initialize animations only if user doesn't prefer reduced motion
  if (!Utils.prefersReducedMotion()) {
    new AnimationObserver();
    new TypingAnimation();
  }
  
  // Add CSS for animation states
  const style = document.createElement('style');
  style.textContent = `
    .animate-ready {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .navbar.scrolled {
      background: rgba(10, 10, 10, 0.95);
      backdrop-filter: blur(20px);
    }
    
    .light-theme .navbar.scrolled {
      background: rgba(255, 255, 255, 0.95);
    }
    
    @media (prefers-reduced-motion: reduce) {
      .animate-ready {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }
  `;
  document.head.appendChild(style);
});

// Handle page visibility changes to pause/resume animations
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is not visible
    document.body.style.animationPlayState = 'paused';
  } else {
    // Resume animations when page becomes visible
    document.body.style.animationPlayState = 'running';
  }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
  // Allow keyboard navigation for theme toggle
  if (e.key === 'Enter' || e.key === ' ') {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.id === 'themeToggle') {
      e.preventDefault();
      activeElement.click();
    }
  }
});

