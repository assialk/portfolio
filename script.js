// Initialize Lucide icons
lucide.createIcons();

// Experience tabs functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const company = button.dataset.company;
        document.getElementById(company).classList.add('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-out');
    observer.observe(section);
});

// Add scroll-based navbar background
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scrolled');
    } else {
        navbar.classList.add('scrolled');
    }
    
    lastScroll = currentScroll;
});

const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Fractal parameters
let angle = 0;
let angleSpeed = 0.005;
let maxDepth = 9;
let lengthFactor = 0.7;
let initialLength;

function drawFractalBranch(x, y, length, angle, depth, hue) {
    if (depth === 0) return;

    const endX = x + length * Math.cos(angle);
    const endY = y + length * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    // Use the accent color (#64ffda) with varying opacity
    ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
    ctx.lineWidth = depth * 0.5;
    ctx.stroke();

    const newLength = length * lengthFactor;
    const newDepth = depth - 1;
    const angleOffset = Math.PI / 4 + Math.sin(Date.now() * 0.001) * 0.2;

    drawFractalBranch(endX, endY, newLength, angle - angleOffset, newDepth, hue + 20);
    drawFractalBranch(endX, endY, newLength, angle + angleOffset, newDepth, hue - 20);
}

function animate() {
    // Clear the canvas completely instead of using a semi-transparent fill
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    initialLength = Math.min(canvas.width, canvas.height) * 0.2;

    const startX = canvas.width / 2;
    const startY = canvas.height * 0.8;

    angle += angleSpeed;

    drawFractalBranch(
        startX,
        startY,
        initialLength,
        -Math.PI / 2 + Math.sin(angle) * 0.5,
        maxDepth,
        180 + Math.sin(angle) * 30
    );

    requestAnimationFrame(animate);
}

// Start animation
animate();

// Add mouse interaction
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    angleSpeed = (x / canvas.width - 0.5) * 0.01;
    lengthFactor = 0.6 + (y / canvas.height) * 0.2;
});

// Add touch interaction
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    angleSpeed = (x / canvas.width - 0.5) * 0.01;
    lengthFactor = 0.6 + (y / canvas.height) * 0.2;
});