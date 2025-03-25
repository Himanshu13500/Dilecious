document.addEventListener("DOMContentLoaded", function () {
    // Create menu toggle button
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    document.querySelector('header').appendChild(menuToggle);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');

    // Toggle menu function
    function toggleMenu() {
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        menuToggle.innerHTML = nav.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    }

    // Event listeners
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    overlay.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu on window resize if open
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        if (nav.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Prevent menu from closing when clicking inside nav
    nav.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Header Scroll Effect
    window.addEventListener("scroll", function() {
        const header = document.querySelector("header");
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Smooth Scroll for All Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Image Lazy Loading
    const images = document.querySelectorAll('img');
    const imageOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px 50px 0px"
    };

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

    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    const sectionOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, sectionOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Dropdown Menu Functionality
    const dropdown = document.querySelector(".dropdown");
    dropdown.addEventListener("mouseover", function () {
        this.querySelector(".dropdown-menu").style.display = "block";
    });
    dropdown.addEventListener("mouseleave", function () {
        this.querySelector(".dropdown-menu").style.display = "none";
    });

    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        item.addEventListener("click", function () {
            this.classList.toggle("active");
            const answer = this.querySelector(".faq-answer");
            answer.style.display = answer.style.display === "block" ? "none" : "block";
        });
    });

    // Newsletter Subscription Alert
    document.getElementById("subscribeBtn")?.addEventListener("click", function () {
        const email = document.getElementById("emailInput").value;
        if (email) {
            alert("Thank you for subscribing!");
        } else {
            alert("Please enter a valid email address.");
        }
    });
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
