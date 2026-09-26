// Animated Background Canvas
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('canvas-background');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePos = { x: 0, y: 0 };
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.updateMouse(e));
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.init();
    }
    
    init() {
        this.particles = [];
        const particleCount = Math.min(50, Math.floor((this.canvas.width * this.canvas.height) / 50000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5 + 0.5,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.2,
                color: `hsl(${Math.random() * 60 + 240}, 70%, 60%)`
            });
        }
    }
    
    updateMouse(e) {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, 'rgba(15, 15, 30, 1)');
        gradient.addColorStop(1, 'rgba(26, 26, 46, 1)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw lines between nearby particles
            this.particles.forEach((otherParticle, otherIndex) => {
                if (index < otherIndex) {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        this.ctx.strokeStyle = `rgba(102, 126, 234, ${0.2 * (1 - distance / 150)})`;
                        this.ctx.globalAlpha = 0.2 * (1 - distance / 150);
                        this.ctx.lineWidth = 0.5;
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(otherParticle.x, otherParticle.y);
                        this.ctx.stroke();
                    }
                }
            });
        });
        
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// Smooth Scroll Observer
class SmoothScrollObserver {
    constructor() {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.options);
        
        // Observe all sections and cards
        document.querySelectorAll('section, .card-3d, .project-card').forEach(el => {
            el.classList.add('fade-in');
            this.observer.observe(el);
        });
    }
}

// Mouse Follow Effect
class MouseFollow {
    constructor() {
        this.mousePos = { x: 0, y: 0 };
        this.elements = document.querySelectorAll('.card-3d, .project-card');
        
        window.addEventListener('mousemove', (e) => this.updateMouse(e));
    }
    
    updateMouse(e) {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
        
        this.elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const angleX = (this.mousePos.y - centerY) * 0.02;
            const angleY = (this.mousePos.x - centerX) * 0.02;
            
            // Only apply transform on hover
            if (element.classList.contains('hovered')) {
                element.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            }
        });
    }
}

// Smooth Scroll to Sections
function setupSmoothScroll() {
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
}

// Text Animation
class TextAnimation {
    constructor() {
        this.titleElement = document.querySelector('.hero-title');
        this.subtitleElement = document.querySelector('.hero-subtitle');
        
        if (this.titleElement && this.subtitleElement) {
            this.animateText();
        }
    }
    
    animateText() {
        const text = this.titleElement.textContent;
        this.titleElement.textContent = '';
        
        Array.from(text).forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.animation = `fadeInUp 0.5s ease-out ${index * 0.05}s forwards`;
            this.titleElement.appendChild(span);
        });
    }
}

// Add fadeInUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .in-view {
        opacity: 1;
        transform: translateY(0);
    }
    
    .card-3d {
        transition: transform 0.3s ease-out;
    }
    
    .project-card {
        transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// Initialize hover states
function setupHoverEffects() {
    const cards = document.querySelectorAll('.card-3d, .project-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('hovered'));
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
            card.style.transform = '';
        });
    });
}

// Contact Form Handler
function setupContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! I\'ll get back to you soon.');
            form.reset();
        });
    }
}

// Active Nav Link
function setupActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground();
    new SmoothScrollObserver();
    new MouseFollow();
    new TextAnimation();
    setupSmoothScroll();
    setupHoverEffects();
    setupContactForm();
    setupActiveNavLink();
    
    // Add active nav style
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .nav-link.active {
            color: var(--primary);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(navStyle);
});

// Handle CTA button click
document.addEventListener('DOMContentLoaded', () => {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        if (button.textContent.includes('Explore')) {
            button.addEventListener('click', () => {
                document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
            });
        }
    });
});
