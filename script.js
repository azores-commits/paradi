let currentSectionId = null; // Track the currently active section

// Adjust body padding for fixed header (fixed to max height to prevent position shifts)
function adjustBodyPaddingForHeader() {
    document.body.style.paddingTop = 'calc(60px + 2cm)';
}

window.addEventListener('load', adjustBodyPaddingForHeader);
window.addEventListener('resize', function() {
    clearTimeout(window._headerResizeTimer);
    window._headerResizeTimer = setTimeout(adjustBodyPaddingForHeader, 80);
});



// Track scroll direction for fade-out-on-top logic
let lastScrollY = window.scrollY || window.pageYOffset;
let scrollDirection = 'down';

window.addEventListener('scroll', () => {
    const currentY = window.scrollY || window.pageYOffset;
    scrollDirection = currentY > lastScrollY ? 'down' : 'up';
    lastScrollY = currentY;
});

// Smooth scrolling and show h2 on navigation click (nav menu only)
document.querySelectorAll('.nav-menu a[href^="#"], .contact-btn a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Handle contact button separately
        if (href === '#contact') {
            e.preventDefault();
            alert('Contact form would open here or redirect to contact page.\n\nEmail: contact@paradi.com\nPhone: +1 (555) 123-4567');
            return;
        }

        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const targetId = href.slice(1); // e.g., 'services'

                // Ensure header is at max height to prevent shifting
                const header = document.querySelector('header');
                header.classList.remove('header-scrolled');

                // If clicking the same section, just scroll without resetting
                if (currentSectionId === targetId) {
                    const headerHeight = header.offsetHeight; // Get current header height
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    return;
                }

                // Update current section
                currentSectionId = targetId;

                // Hide all h2 headings
                document.querySelectorAll('section h2').forEach(h2 => {
                    h2.classList.remove('visible');
                });

                // Show the target section's h2
                const h2 = target.querySelector('h2');
                if (h2) {
                    h2.classList.add('visible');
                }

                // Reset fade classes on all sections and cards, but keep manually set ones
                document.querySelectorAll('.fade-section').forEach(el => {
                    if (el.id !== currentSectionId) {
                        el.classList.remove('in-view', 'leaving-up', 'manually-visible');
                    }
                });

                // Make target section visible immediately (will still animate)
                target.classList.add('fade-section', 'in-view', 'manually-visible');

                // For About section, also make the blocks visible immediately
                if (target.id === 'about') {
                    document.querySelectorAll('.about-content .about-block').forEach(block => {
                        block.classList.add('in-view');
                    });
                }

                // Smooth scroll to section
                const headerHeight = header.offsetHeight; // Get current header height
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px 0px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        const el = entry.target;

        if (entry.isIntersecting) {
            el.classList.add('in-view');
            el.classList.remove('leaving-up');

            // Show the current section's h2 when it fades in
            if (el.tagName === 'SECTION') {
                const h2 = el.querySelector('h2');
                if (h2) {
                    h2.classList.add('visible');
                }
            }
        } else {
            // When scrolling down and element leaves at the top, fade it out upwards
            const rect = entry.boundingClientRect;
            if (scrollDirection === 'down' && rect.top < 0) {
                el.classList.remove('in-view');
                el.classList.add('leaving-up');
            }
        }
    });
}, observerOptions);

// Animate sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-section');
    observer.observe(section);
});

// Animate service cards with slight stagger
document.querySelectorAll('.service-card').forEach((el) => {
    el.classList.add('fade-section');
    el.style.transitionDelay = '0.1s';
    observer.observe(el);
});

// Animate project cards with the same fade effect for consistency
document.querySelectorAll('.project-card').forEach((el) => {
    el.classList.add('fade-section');
    el.style.transitionDelay = '0.1s';
    observer.observe(el);
});

// Animate each about block individually instead of the whole container
document.querySelectorAll('.about-content .about-block').forEach((el) => {
    el.classList.add('fade-section');
    observer.observe(el);
});

// 3D Projects carousel with flip-on-click
const projectCards = Array.from(document.querySelectorAll('.projects-carousel .project-card-3d'));
let currentProjectIndex = 0;

function updateProjectCarousel() {
    if (!projectCards.length) return;
    const lastIndex = projectCards.length - 1;

    projectCards.forEach((card, index) => {
        card.classList.remove('active', 'left', 'right', 'inactive');

        if (index === currentProjectIndex) {
            card.classList.add('active');
        } else if (index === (currentProjectIndex - 1 + projectCards.length) % projectCards.length) {
            card.classList.add('left');
        } else if (index === (currentProjectIndex + 1) % projectCards.length) {
            card.classList.add('right');
        } else {
            card.classList.add('inactive');
        }
    });
}

projectCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        // If this card is not active, bring it to the front
        if (index !== currentProjectIndex) {
            currentProjectIndex = index;
            projectCards.forEach(c => c.classList.remove('flipped'));
            updateProjectCarousel();
        } else {
            // If already active, flip to show/hide details
            card.classList.toggle('flipped');
        }
    });
});

updateProjectCarousel();

// Swipe and drag functionality for carousel
let startX = 0;
let isDragging = false;

const carousel = document.querySelector('.projects-carousel');

// Touch events for mobile
carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
}, { passive: false });

carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
}, { passive: false });

carousel.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) { // swipe threshold
        if (diff > 0) {
            // swipe left, next project
            currentProjectIndex = (currentProjectIndex + 1) % projectCards.length;
        } else {
            // swipe right, prev project
            currentProjectIndex = (currentProjectIndex - 1 + projectCards.length) % projectCards.length;
        }
        updateProjectCarousel();
    }
});

// Mouse events for desktop drag
carousel.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    e.preventDefault(); // Prevent text selection
});

carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
});

carousel.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) { // drag threshold
        if (diff > 0) {
            // drag left, next project
            currentProjectIndex = (currentProjectIndex + 1) % projectCards.length;
        } else {
            // drag right, prev project
            currentProjectIndex = (currentProjectIndex - 1 + projectCards.length) % projectCards.length;
        }
        updateProjectCarousel();
    }
});

// Mobile menu toggle functions
function toggleMenu() {
    const menuContent = document.querySelector('.mobile-menu-content');
    const toggleButton = document.querySelector('.menu-toggle');
    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
    toggleButton.setAttribute('aria-expanded', !isExpanded);
    menuContent.classList.toggle('active');
}

function closeMenu() {
    const menuContent = document.querySelector('.mobile-menu-content');
    const toggleButton = document.querySelector('.menu-toggle');
    menuContent.classList.remove('active');
    toggleButton.setAttribute('aria-expanded', 'false');
}
