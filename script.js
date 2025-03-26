document.addEventListener("DOMContentLoaded", function () {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');
    let currentSection = 'home';

    // Update active section based on scroll position
    function updateActiveSection() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                if (currentSection !== section.id) {
                    currentSection = section.id;
                    updateActiveLink();
                }
            }
        });
    }

    // Update active link in navigation
    function updateActiveLink() {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Handle navigation clicks with smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 120,
                    behavior: 'smooth'
                });

                // Update URL hash without scrolling
                history.pushState(null, null, `#${targetId}`);
                
                // Update active section
                currentSection = targetId;
                updateActiveLink();
            }
        });
    });

    // Update active section on scroll with throttling
    let scrollTimeout;
    let lastScrollPosition = 0;
    const scrollThreshold = 50; // Pixel distance before updating
    
    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.scrollY;
        
        // Only update if we've scrolled enough
        if (Math.abs(currentScrollPosition - lastScrollPosition) > scrollThreshold) {
            lastScrollPosition = currentScrollPosition;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateActiveSection();
            }, 100);
        }
    });

    // Header Scroll Effect with class toggle
    function updateHeaderAppearance() {
        const header = document.querySelector("header");
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeaderAppearance);

    // Initialize header appearance
    updateHeaderAppearance();
    
    // Image Lazy Loading with Intersection Observer
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px 100px 0px" // Load images when they're within 100px of viewport
    };

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                }
            });
        }, imageOptions);

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without Intersection Observer support
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }

    // Animate sections on scroll with Intersection Observer
    const sections = document.querySelectorAll('section');
    const sectionOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px" // Start animation when 100px of section is in viewport
    };

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, sectionOptions);

        sections.forEach(section => sectionObserver.observe(section));
    } else {
        // Fallback for browsers without Intersection Observer support
        sections.forEach(section => section.classList.add('visible'));
    }

    // Add animations to benefit items
    const benefitItems = document.querySelectorAll('.benefit-item');
    if (benefitItems.length) {
        benefitItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Parallax effect for hero section
    const heroSection = document.querySelector('.highlight');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            if (window.innerWidth > 768) { // Only on larger screens
                const scrolled = window.scrollY;
                const heroImage = heroSection.querySelector('.hero-image');
                
                if (heroImage && scrolled < 500) {
                    heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
                }
            }
        });
    }

    // Contact form handling with validation and feedback
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const name = this.querySelector('input[name="name"]').value.trim();
            const email = this.querySelector('input[name="email"]').value.trim();
            const message = this.querySelector('textarea[name="message"]').value.trim();
            
            // Email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Validate inputs
            let isValid = true;
            let errorMessage = '';
            
            if (!name) {
                isValid = false;
                errorMessage = 'Please enter your name.';
            } else if (!email || !emailRegex.test(email)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            } else if (!message) {
                isValid = false;
                errorMessage = 'Please enter your message.';
            }
            
            if (isValid) {
                // Simulate form submission
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                
                // Show loading state
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitButton.disabled = true;
                
                // Simulate server request
                setTimeout(() => {
                    // Success state
                    submitButton.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                    submitButton.style.backgroundColor = '#22c55e';
                    
                    // Reset form
                    this.reset();
                    
                    // Reset button after delay
                    setTimeout(() => {
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                        submitButton.style.backgroundColor = '';
                    }, 3000);
                    
                    // Show toast notification
                    showToast('Your message has been sent successfully!', 'success');
                }, 1500);
            } else {
                showToast(errorMessage, 'error');
            }
        });
    }
    
    // Toast notification function
    function showToast(message, type = 'success') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast-notification');
        existingToasts.forEach(toast => toast.remove());
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        // Set icon based on type
        let icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'info') icon = 'info-circle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 3000);
        }, 4000);
    }
    
    // Initial active section update
    updateActiveSection();
    
    // On resize event handling with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateActiveSection();
        }, 200);
    });

    // Add CSS styles for active navigation links and toast notifications
    const styles = `
        nav a.active {
            background: rgba(196, 164, 132, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }
        
        .toast-notification {
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 15px 20px;
            background: white;
            color: #333;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .toast-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast-notification i {
            font-size: 1.2em;
        }
        
        .toast-notification.success i {
            color: #22c55e;
        }
        
        .toast-notification.error i {
            color: #ef4444;
        }
        
        .toast-notification.info i {
            color: #3b82f6;
        }
        
        .section.visible {
            animation: fadeIn 0.8s ease-out forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .benefit-item {
            opacity: 0;
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    
    // Add styles to head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
});

// Add necessary styles
const styles = `
    .cart-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4a3f35;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        animation: slideIn 0.3s ease-out;
        z-index: 1000;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
    }

    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 10px;
        position: relative;
        width: 90%;
        max-width: 500px;
        animation: scaleIn 0.3s ease-out;
    }

    .close {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 24px;
        cursor: pointer;
    }

    .cart-animation {
        position: absolute;
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        animation: cartPulse 1s ease-out;
    }

    @keyframes cartPulse {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(20); opacity: 0; }
    }

    .fade-in {
        animation: fadeIn 0.5s ease-out;
    }

    /* General Styles */
    body {
        font-family: 'Poppins', sans-serif;
        font-size: 16px;
        background-color: #f8f1e4;
        color: #4a3f35;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 320px;
        overflow-x: hidden; /* Ensure no horizontal overflow */
    }

    /* Boxed Section Styles */
    .box {
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin: 20px auto;
        text-align: center;
        width: calc(100% - 40px);
        max-width: 800px;
        animation: fadeIn 0.8s ease-out;
        transition: transform 0.3s ease;
        box-sizing: border-box;
    }

    /* Mobile Responsive Improvements */
    @media (max-width: 768px) {
        header {
            padding: 10px 20px;
        }

        .logo img {
            height: 40px;
        }

        nav ul {
            gap: 15px;
        }

        nav a {
            font-size: 0.85em;
            padding: 3px 6px;
        }

        .flavor-card {
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
        }

        .cart-item {
            padding: 15px;
        }

        .cart-item-image {
            width: 80px;
            height: 80px;
        }

        .quantity-btn {
            width: 25px;
            height: 25px;
        }

        .cart-summary {
            padding: 20px;
        }

        .highlight {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 30px;
        }

        .hero-content {
            text-align: center;
        }

        .hero-features {
            justify-content: center;
            flex-wrap: wrap;
        }

        .hero-content h1 {
            font-size: 2.5em;
        }

        .hero-image {
            grid-row: 1;
            max-width: 400px;
            margin: 0 auto;
        }

        .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 30px;
        }

        .footer-section h3::after {
            left: 50%;
            transform: translateX(-50%);
        }

        .footer-section ul li a {
            justify-content: center;
        }

        .social-links {
            justify-content: center;
        }

        .newsletter-form {
            max-width: 400px;
            margin: 20px auto 0;
        }
    }

    @media (max-width: 480px) {
        .cart-notification {
            bottom: 10px;
            right: 10px;
            left: 10px;
            font-size: 0.85em;
            text-align: center;
            max-width: none;
        }

        .cart-item {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .cart-item-image {
            margin: 0 auto;
        }

        .quantity-controls {
            justify-content: center;
        }
    }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
