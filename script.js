 document.addEventListener('DOMContentLoaded', function() {
            // Initialize GSAP
            gsap.registerPlugin(ScrollTrigger, TextPlugin);
            
           
// Custom cursor functionality
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

// Speed of follower (lower = smoother but slower)
const speed = 0.15;

// Animate cursor follower
function animate() {
    // Calculate distance to move
    const distX = mouseX - followerX;
    const distY = mouseY - followerY;
    
    // Move the follower
    followerX += distX * speed;
    followerY += distY * speed;
    
    // Update position
    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;
    
    // Continue animation
    requestAnimationFrame(animate);
}

// Start animation
animate();

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
});

// Interactive cursor effects
document.querySelectorAll('a, button, .btn, .floating-btn, .contact-item, .skill-category, .project-card, .part-time-card, .experience-item, .education-item').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursorFollower.classList.add('active');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorFollower.classList.remove('active');
    });
});

// Click animation for cursor
document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
    cursorFollower.classList.add('click');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('click');
    cursorFollower.classList.remove('click');
});

// Hide cursor when not moving
let cursorTimeout;
function hideCursor() {
    cursor.classList.add('hidden');
    cursorFollower.classList.add('hidden');
}

document.addEventListener('mousemove', () => {
    cursor.classList.remove('hidden');
    cursorFollower.classList.remove('hidden');
    
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(hideCursor, 3000);
});

            
            // Create particle background
            function createParticles() {
                const particlesContainer = document.getElementById('particles');
                const particleCount = 30;
                
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.classList.add('particle');
                    
                    // Random size between 5 and 15px
                    const size = Math.random() * 10 + 5;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    
                    // Random position
                    const posX = Math.random() * 100;
                    const posY = Math.random() * 100;
                    particle.style.left = `${posX}%`;
                    particle.style.top = `${posY}%`;
                    
                    // Random animation delay
                    particle.style.animationDelay = `${Math.random() * 15}s`;
                    
                    particlesContainer.appendChild(particle);
                }
            }
            
            createParticles();
            
            // Welcome notification functionality
            const welcomeNotification = document.getElementById('welcomeNotification');
            const closeWelcomeBtn = document.getElementById('closeWelcome');
            
            // Show welcome notification after a short delay
            setTimeout(function() {
                welcomeNotification.classList.add('active');
            }, 1500);
            
            closeWelcomeBtn.addEventListener('click', function() {
                welcomeNotification.classList.remove('active');
            });
            
            // Auto-hide notification after 8 seconds
            setTimeout(function() {
                welcomeNotification.classList.remove('active');
            }, 8000);
            
            // Mobile menu toggle
            const menuBtn = document.querySelector('.menu-btn');
            const navLinks = document.querySelector('.nav-links');
            
            menuBtn.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                
                // Change icon based on menu state
                if (navLinks.classList.contains('active')) {
                    menuBtn.innerHTML = '<i class="fas fa-times"></i>';
                } else {
                    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
            
            // Navbar scroll effect
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
            
            // Text animation for dynamic text
            const dynamicText = document.getElementById('dynamicText');
            const textOptions = ["Software Engineer", "AI Enthusiast", "Problem Solver", "Java Developer", "Web Developer"];
            let currentTextIndex = 0;
            
            function animateText() {
                const nextText = textOptions[currentTextIndex];
                
                // Animate text change with GSAP
                gsap.to(dynamicText, {
                    duration: 0.5,
                    text: nextText,
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Wait for 2 seconds before changing to next text
                        setTimeout(() => {
                            currentTextIndex = (currentTextIndex + 1) % textOptions.length;
                            animateText();
                        }, 2000);
                    }
                });
            }
            
            // Initial text animation
            animateText();
            
            // Dark mode toggle functionality
            const darkModeToggle = document.getElementById('darkModeToggle');
            const darkModeIcon = darkModeToggle.querySelector('i');
            
            // Check for saved theme preference or respect OS preference
            const savedTheme = localStorage.getItem('theme');
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Set initial theme
            if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
                document.documentElement.setAttribute('data-theme', 'dark');
                darkModeIcon.classList.remove('fa-moon');
                darkModeIcon.classList.add('fa-sun');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                darkModeIcon.classList.remove('fa-sun');
                darkModeIcon.classList.add('fa-moon');
            }
            
            // Toggle theme on button click
            darkModeToggle.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                
                if (currentTheme === 'light') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    darkModeIcon.classList.remove('fa-moon');
                    darkModeIcon.classList.add('fa-sun');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                    darkModeIcon.classList.remove('fa-sun');
                    darkModeIcon.classList.add('fa-moon');
                    localStorage.setItem('theme', 'light');
                }
            });
            
            // Add download CV functionality
            document.getElementById('downloadCv').addEventListener('click', function(e) {
                e.preventDefault();
                
                // Create a temporary link to trigger download
                const link = document.createElement('a');
                link.href = 'path/to/your/cv.pdf';
                link.download = 'Riflan_Mohamed_CV.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
            
            // Form submission
            document.getElementById('contactForm').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your message! I will get back to you soon.');
                this.reset();
            });
            
            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Close mobile menu if open
                        navLinks.classList.remove('active');
                        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                        
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // GSAP Animations
            gsap.from('.hero-badge', {
                duration: 1,
                y: -50,
                opacity: 0,
                ease: 'power3.out'
            });
            
            gsap.from('.hero h1', {
                duration: 1,
                y: 50,
                opacity: 0,
                delay: 0.3,
                ease: 'power3.out'
            });
            
            gsap.from('.hero p', {
                duration: 1,
                y: 50,
                opacity: 0,
                delay: 0.6,
                ease: 'power3.out'
            });
            
            gsap.from('.btn-container', {
                duration: 1,
                y: 50,
                opacity: 0,
                delay: 0.9,
                ease: 'power3.out'
            });
            
            // Animate sections on scroll
            gsap.utils.toArray('section').forEach(section => {
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                });
            });
            
            // Animate cards on scroll
            gsap.utils.toArray('.skill-category, .project-card, .part-time-card, .experience-item, .education-item').forEach(item => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            });
        });