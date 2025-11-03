/**
 * Accessible Lightbox Implementation
 * Handles photo gallery lightbox with keyboard navigation and ARIA support
 */

(function() {
    'use strict';

    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');

    // State
    let currentIndex = 0;
    let photos = [];
    let previousActiveElement = null;

    // Initialize lightbox
    function initLightbox() {
        if (!lightbox) return;

        // Get all photo links
        const photoLinks = document.querySelectorAll('.photo-link[data-lightbox]');
        photos = Array.from(photoLinks).map(link => ({
            src: link.getAttribute('href'),
            title: link.getAttribute('data-title') || link.querySelector('img').getAttribute('alt') || '',
            alt: link.querySelector('img').getAttribute('alt') || ''
        }));

        if (photos.length === 0) return;

        // Set total count
        lightboxTotal.textContent = photos.length;

        // Attach event listeners to photo links
        photoLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        // Close button
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // Previous button
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
        }

        // Next button
        if (lightboxNext) {
            lightboxNext.addEventListener('click', () => navigateLightbox(1));
        }

        // Overlay click to close
        if (lightboxOverlay) {
            lightboxOverlay.addEventListener('click', closeLightbox);
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);

        // Initialize button states
        updateButtonStates();
    }

    // Update navigation button states
    function updateButtonStates() {
        if (!lightboxPrev || !lightboxNext) return;

        if (photos.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
            lightboxPrev.setAttribute('aria-disabled', 'true');
            lightboxNext.setAttribute('aria-disabled', 'true');
        } else {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        }
    }

    // Open lightbox
    function openLightbox(index) {
        if (index < 0 || index >= photos.length) return;

        currentIndex = index;
        previousActiveElement = document.activeElement;

        // Update lightbox content
        const photo = photos[index];
        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;
        lightboxTitle.textContent = photo.title;
        lightboxCurrent.textContent = index + 1;

        // Show lightbox
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');

        // Update navigation buttons visibility
        if (lightboxPrev) {
            lightboxPrev.style.display = index === 0 ? 'none' : 'flex';
            lightboxPrev.setAttribute('aria-disabled', index === 0 ? 'true' : 'false');
        }
        if (lightboxNext) {
            lightboxNext.style.display = index === photos.length - 1 ? 'none' : 'flex';
            lightboxNext.setAttribute('aria-disabled', index === photos.length - 1 ? 'true' : 'false');
        }

        // Trap focus in lightbox
        setTimeout(() => {
            lightboxClose.focus();
        }, 100);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');

        // Restore body scroll
        document.body.style.overflow = '';

        // Return focus to previous element
        if (previousActiveElement) {
            previousActiveElement.focus();
            previousActiveElement = null;
        }
    }

    // Navigate lightbox
    function navigateLightbox(direction) {
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < photos.length) {
            openLightbox(newIndex);
        }
    }

    // Handle keyboard navigation
    function handleKeydown(e) {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    navigateLightbox(-1);
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    navigateLightbox(1);
                    e.preventDefault();
                    break;
            }
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLightbox);
    } else {
        initLightbox();
    }

})();

