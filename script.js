// Removed conflicting smooth scrolling logic to prevent display errors on nav menu clicks

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
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    document.body.style.paddingTop = headerHeight + 'px';
}

// Show home section h2 on load to match "Home" nav click behavior
function showHomeOnLoad() {
    const homeSection = document.querySelector('#home');
    if (homeSection) {
        // Hide all section h2
        document.querySelectorAll('section h2').forEach(h2 => h2.style.display = 'none');
        // Show the home section's h2
        const h2 = homeSection.querySelector('h2');
        if (h2) {
            h2.style.display = 'block';
            h2.classList.add('visible');
        }
        // Reset fade classes on all sections and cards
        document.querySelectorAll('.fade-section').forEach(el => {
            el.classList.remove('in-view', 'leaving-up');
        });
        // Make home section visible immediately
        homeSection.classList.add('fade-section', 'in-view');
        // Also ensure the section is visible
        homeSection.style.opacity = '1';
        homeSection.style.transform = 'translateY(0)';
    }
}

// Run on load and update on resize
window.addEventListener('load', function() {
    // Ensure header is not shrunk on page load
    const header = document.querySelector('header');
    header.classList.remove("header-scrolled");
    adjustBodyPaddingForHeader();
    showHomeOnLoad();
    // Scroll to top to show the highest part of the page
    window.scrollTo(0, 0);
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
  } else {
    header.classList.remove("header-scrolled");
  }
  adjustBodyPaddingForHeader();
};
