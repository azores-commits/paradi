// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#contact') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Hide all section h2
                document.querySelectorAll('section h2').forEach(h2 => h2.style.display = 'none');
                // Show the target section's h2
                const h2 = target.querySelector('h2');
                if (h2) {
                    h2.style.display = 'block';
                    // Show the section immediately on click
                    target.style.opacity = '1';
                    target.style.transform = 'translateY(0)';
                    // Scroll to the h2 position, accounting for fixed header
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = h2.offsetTop - headerHeight - 100; // Sufficient margin to ensure h2 is visible below header
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
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
document.querySelectorAll('.service-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s`;
    observer.observe(el);
});



// Adjust body padding-top to avoid content being hidden under fixed header
function adjustBodyPaddingForHeader() {
    // Set fixed padding to match the shrunk header height to prevent jumps
    document.body.style.paddingTop = '60px';
}

// Show home section h2 on load to match "Home" nav click behavior
function showHomeOnLoad() {
    const homeSection = document.querySelector('#home');
    if (homeSection) {
        const h2 = homeSection.querySelector('h2');
        if (h2) {
            h2.style.display = 'block';
        }
        // Also ensure the section is visible
        homeSection.style.opacity = '1';
        homeSection.style.transform = 'translateY(0)';
    }
}

// Run on load and update on resize
window.addEventListener('load', function() {
    adjustBodyPaddingForHeader();
    showHomeOnLoad();
});
window.addEventListener('resize', function() {
    // small debounce
    clearTimeout(window._headerResizeTimer);
    window._headerResizeTimer = setTimeout(adjustBodyPaddingForHeader, 80);
});

window.onscroll = function() {
  const header = document.querySelector('header');
  const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

  if (scrollTop > 50) {
    header.classList.add("header-scrolled");
  }
  // Removed the else clause to keep the header shrunk once scrolled
};
