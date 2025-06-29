// Modern Portfolio JavaScript
// Author: Gerssivaldo Santos
// Year: 2024

class Portfolio {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupTheme();
    this.setupScrollAnimations();
    this.setupActiveNavigation();
    this.typeWriter();
  }

  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle?.addEventListener('click', () => this.toggleTheme());

    // Mobile navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger?.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
      });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.offsetTop;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    backToTop?.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Scroll events
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    // Contact form
    const contactForm = document.getElementById('contact-form');
    contactForm?.addEventListener('submit', (e) => this.handleFormSubmit(e));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu?.contains(e.target) && !hamburger?.contains(e.target)) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
      }
    });
  }

  // Theme Management
  setupTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine the theme to use
    let themeToApply;
    if (savedTheme) {
      // User has a saved preference
      themeToApply = savedTheme;
    } else {
      // Use system preference, default to light if no preference
      themeToApply = systemPrefersDark ? 'dark' : 'light';
    }
    
    // Apply the theme
    document.documentElement.setAttribute('data-theme', themeToApply);
    this.updateThemeIcon(themeToApply);
    
    // Store the system preference state
    this.systemPrefersDark = systemPrefersDark;
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      // Only auto-switch if user hasn't set a manual preference
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        this.updateThemeIcon(newTheme);
        this.systemPrefersDark = e.matches;
        
        // Show notification about automatic theme change
        this.showNotification(
          `Switched to ${newTheme} mode automatically based on your system settings`,
          'info'
        );
      }
    };
    
    // Use the newer addEventListener if available, fallback to addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);

    // Add smooth transition effect
    document.documentElement.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 300);
  }

  // Reset theme to system preference
  resetToSystemTheme() {
    // Remove saved preference
    localStorage.removeItem('theme');
    
    // Apply system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = systemPrefersDark ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', systemTheme);
    this.updateThemeIcon(systemTheme);
    
    // Show notification
    this.showNotification(
      `Theme reset to system preference (${systemTheme} mode)`,
      'success'
    );
  }

  updateThemeIcon(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // Scroll Handling
  handleScroll() {
    const scrollTop = window.pageYOffset;
    
    // Show/hide back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      if (scrollTop > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }

    // Add shadow to navbar on scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (scrollTop > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.boxShadow = '';
      }
    }

    // Trigger scroll animations
    this.checkScrollAnimations();
  }

  // Scroll Animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.stat, .timeline-item, .skill-category, .contact-item');
    animatedElements.forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
    });
  }

  checkScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in:not(.visible)');
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('visible');
      }
    });
  }

  // Active Navigation
  setupActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          
          // Remove active class from all links
          navLinks.forEach(link => link.classList.remove('active'));
          
          // Add active class to current link
          const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // Typewriter Effect for Hero Section
  typeWriter() {
    const texts = [
      'Software Engineer',
      'React Specialist',
      'Full Stack Developer',
      'AI Integration Expert',
      'Performance Optimizer'
    ];
    
    const typewriterElement = document.querySelector('.hero-subtitle');
    if (!typewriterElement) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    const baseText = 'Software Engineer | React Specialist | ReactNative | MCP | Node';
    
    function type() {
      if (textIndex === 0) {
        // Show the base text first
        typewriterElement.textContent = baseText;
        setTimeout(() => {
          textIndex = 1;
          type();
        }, 3000);
        return;
      }

      const fullText = texts[textIndex % texts.length];
      
      if (isDeleting) {
        currentText = fullText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        currentText = fullText.substring(0, charIndex + 1);
        charIndex++;
      }

      typewriterElement.textContent = currentText;

      let typeSpeed = isDeleting ? 100 : 150;

      if (!isDeleting && charIndex === fullText.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex++;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }

    // Start typing effect after a delay
    setTimeout(type, 2000);
  }

  // Form Handling
  async handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    form.classList.add('loading');

    try {
      // Simulate form submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success feedback
      this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      form.reset();
      
    } catch (error) {
      // Error feedback
      this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      form.classList.remove('loading');
    }
  }

  // Notification System
  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification__content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="notification__close" aria-label="Close notification">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: var(--bg-primary);
      color: var(--text-primary);
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px var(--shadow-heavy);
      z-index: 10000;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      max-width: 400px;
      border-left: 4px solid ${type === 'success' ? 'var(--success-color)' : type === 'error' ? '#ef4444' : 'var(--primary-color)'};
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  // Keyboard Navigation
  handleKeydown(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
      const hamburger = document.getElementById('hamburger');
      const navMenu = document.getElementById('nav-menu');
      
      if (navMenu?.classList.contains('active')) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
      }
    }

    // Ctrl/Cmd + D toggles theme
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      this.toggleTheme();
    }

    // Ctrl/Cmd + Shift + D resets theme to system preference
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      this.resetToSystemTheme();
    }
  }

  // Utility Functions
  debounce(func, wait) {
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

  throttle(func, limit) {
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

// Performance Monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      domContentLoaded: 0,
      firstPaint: 0,
      firstContentfulPaint: 0
    };
    this.init();
  }

  init() {
    // Monitor load time
    window.addEventListener('load', () => {
      this.metrics.loadTime = performance.now();
      this.logMetrics();
    });

    // Monitor DOM content loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.metrics.domContentLoaded = performance.now();
    });

    // Monitor paint metrics
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint') {
            this.metrics.firstPaint = entry.startTime;
          }
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
    }
  }

  logMetrics() {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Performance Metrics:', this.metrics);
    }
  }
}

// Accessibility Enhancements
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupSkipLinks();
    this.setupFocusManagement();
    this.setupAriaLabels();
    this.setupReducedMotion();
  }

  setupSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  setupFocusManagement() {
    // Focus management for mobile menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger?.addEventListener('click', () => {
      if (navMenu?.classList.contains('active')) {
        const firstLink = navMenu.querySelector('.nav-link');
        firstLink?.focus();
      }
    });
  }

  setupAriaLabels() {
    // Add aria-current to active navigation items
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const element = mutation.target;
          if (element.classList.contains('nav-link')) {
            if (element.classList.contains('active')) {
              element.setAttribute('aria-current', 'page');
            } else {
              element.removeAttribute('aria-current');
            }
          }
        }
      });
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      observer.observe(link, { attributes: true });
    });
  }

  setupReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition', 'none');
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main portfolio functionality
  new Portfolio();
  
  // Initialize performance monitoring
  new PerformanceMonitor();
  
  // Initialize accessibility enhancements
  new AccessibilityManager();
  
  // Add main content id for skip link
  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.id = 'main-content';
  }
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Portfolio, PerformanceMonitor, AccessibilityManager };
}
