window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

// Simplified Carousel Implementation for Feature Visualizations
let carouselData = [];
let currentCarouselIndex = 0;

function initSimpleCarousel() {
    // Extract data from hidden carousel items
    const items = document.querySelectorAll('#results-carousel .item');

    items.forEach(item => {
        const featureId = item.dataset.feature;
        const title = item.querySelector('.feature-title')?.textContent || `Feature ${featureId}`;
        const description = item.querySelector('.feature-description')?.textContent || '';
        const caseStudyImg = item.querySelector('.case-study-img');
        const prototypesImg = item.querySelector('.prototypes-img');

        if (featureId && caseStudyImg && prototypesImg) {
            carouselData.push({
                featureId: featureId,
                title: title,
                description: description,
                caseStudySrc: caseStudyImg.src,
                prototypesSrc: prototypesImg.src
            });
        }
    });

    // Hide layer selector (not needed for feature-based carousel)
    const layerSelector = document.querySelector('.carousel-header');
    if (layerSelector) {
        layerSelector.style.display = 'none';
    }

    // Preload all images to prevent layout shifts
    preloadCarouselImages();

    // Initialize carousel UI
    if (carouselData.length > 0) {
        updateCarouselDisplay();
        attachCarouselEventListeners();

        // Update total count
        document.getElementById('carousel-total').textContent = carouselData.length;
    }
}

function preloadCarouselImages() {
    carouselData.forEach(item => {
        // Preload case study image
        const caseStudyImg = new Image();
        caseStudyImg.src = item.caseStudySrc;

        // Preload prototypes image
        const prototypesImg = new Image();
        prototypesImg.src = item.prototypesSrc;
    });
}

function updateCarouselDisplay() {
    if (carouselData.length === 0) return;

    const item = carouselData[currentCarouselIndex];

    // Update text
    document.querySelector('.carousel-title').textContent = item.title;
    document.querySelector('.carousel-description').textContent = item.description;

    // Update image container to show both images
    const imgContainer = document.querySelector('.carousel-image-container');
    imgContainer.innerHTML = `
        <div class="feature-images">
            <div class="case-study-section">
                <h4 class="image-section-title">Case Studies</h4>
                <img src="${item.caseStudySrc}" alt="Case studies for ${item.title}"/>
            </div>
            <div class="prototypes-section">
                <h4 class="image-section-title">Prototypes</h4>
                <img src="${item.prototypesSrc}" alt="Prototypes for ${item.title}"/>
            </div>
        </div>
    `;

    // Update counter
    document.getElementById('carousel-current').textContent = currentCarouselIndex + 1;
}

function attachCarouselEventListeners() {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    prevBtn.addEventListener('click', () => {
        currentCarouselIndex = (currentCarouselIndex - 1 + carouselData.length) % carouselData.length;
        updateCarouselDisplay();
    });

    nextBtn.addEventListener('click', () => {
        currentCarouselIndex = (currentCarouselIndex + 1) % carouselData.length;
        updateCarouselDisplay();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (carouselData.length === 0) return;

        if (e.key === 'ArrowLeft') {
            currentCarouselIndex = (currentCarouselIndex - 1 + carouselData.length) % carouselData.length;
            updateCarouselDisplay();
        } else if (e.key === 'ArrowRight') {
            currentCarouselIndex = (currentCarouselIndex + 1) % carouselData.length;
            updateCarouselDisplay();
        }
    });
}

$(document).ready(function() {
    // Initialize simplified carousel
    initSimpleCarousel();

    // Initialize Bulma slider for other carousels
    bulmaSlider.attach();

    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();
})
