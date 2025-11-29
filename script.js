// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#contact') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Team bubbles interaction
const bubbles = document.querySelectorAll('.bubble');

bubbles.forEach(bubble => {
    bubble.addEventListener('mouseenter', function() {
        this.querySelector('.name').style.opacity = '1';
    });

    bubble.addEventListener('mouseleave', function() {
        this.querySelector('.name').style.opacity = '0';
    });
});

// Contact Us handler
document.querySelector('.contact-btn a').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Contact form would open here or redirect to contact page.\n\nEmail: contact@paradi.com\nPhone: +1 (555) 123-4567');
});

// Add scroll animation for sections - fade in and slide up on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Stop observing after animation triggers
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Animate sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Animate service cards
document.querySelectorAll('.service-card').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
});

// Animate all text elements and list items individually in About section
document.querySelectorAll('.about-content > p, .about-content > h3, .about-content > h4, .about-content > h5, .about-content > ul > li').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(15px)';
    el.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(el);
});

// Adjust body padding-top to avoid content being hidden under fixed header
function adjustBodyPaddingForHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    // get computed height including margins
    const rect = header.getBoundingClientRect();
    // use offsetHeight which includes padding and borders
    const headerHeight = header.offsetHeight;
    document.body.style.paddingTop = headerHeight + 'px';
}

// Run on load and update on resize
window.addEventListener('load', adjustBodyPaddingForHeader);
window.addEventListener('resize', function() {
    // small debounce
    clearTimeout(window._headerResizeTimer);
    window._headerResizeTimer = setTimeout(adjustBodyPaddingForHeader, 80);
});

