/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-shorts variant.
 * Base block: carousel
 * Source: https://www.asianpaints.com/
 * Selector: .saleassist-video-shorts-root-container
 * Generated: 2026-04-28
 *
 * Source structure:
 *   div.saleassist-video-shorts-root-container
 *     div.swiper.sa_shorts_parentSwiper
 *       div.swiper-wrapper.sa-shorts-parent-video-container
 *         div.swiper-slide.sa_shorts_video-wrapper (repeated per slide)
 *           div#video > video > source[src] (video mp4 URL)
 *           div.sa_shorts_parentVideo-caption > p (caption text, may be empty)
 *           div.carousel-video-count-wrapper > p.carousel-video-views-count (views)
 *           div.sa_shorts_products-wrapper a.cta-link (CTA link with text e.g. "Explore shade")
 *
 * Target: carousel block table with 2 columns per row.
 *   Row per slide: [video link as image placeholder] [text content with CTA]
 *
 * UE Model (carousel-shorts-item):
 *   - media_image (reference) -> image/video cell
 *   - media_imageAlt (text, collapsed, no hint needed)
 *   - content_text (richtext) -> text cell
 *
 * xwalk field hints: media_image, content_text
 *
 * Note: The saleassist widget is lazy-loaded via IntersectionObserver.
 * The container div exists in the initial DOM but is empty and classless
 * until the viewport scrolls to it. The import script must ensure the
 * page is fully scrolled before parser execution to trigger widget hydration.
 * Validated manually: produces correct 10-slide output with video URLs, view counts, and CTAs.
 */
export default function parse(element, { document }) {
  // Select all video slide wrappers
  const slides = element.querySelectorAll(
    '.swiper-slide.sa_shorts_video-wrapper, .sa_shorts_video-wrapper'
  );

  const cells = [];

  slides.forEach((slide) => {
    // --- Column 1: Video / Image ---
    // Extract the video source URL to represent the video content.
    // In AEM, this becomes a reference to the video asset.
    const videoSource = slide.querySelector('video source[src], video[src]');
    const videoUrl = videoSource
      ? videoSource.getAttribute('src')
      : null;

    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));

    if (videoUrl) {
      // Create a link to the video URL so the import framework captures it
      const videoLink = document.createElement('a');
      videoLink.setAttribute('href', videoUrl);
      videoLink.textContent = videoUrl;
      imageCell.appendChild(videoLink);
    }

    // --- Column 2: Text content (caption + views + CTA) ---
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:content_text '));

    // Extract caption text if present
    const captionP = slide.querySelector('.sa_shorts_parentVideo-caption > p, .sa_shorts_parentVideo-caption p');
    const captionText = captionP ? captionP.textContent.trim() : '';

    // Extract view count
    const viewsP = slide.querySelector(
      'p.carousel-video-views-count, .carousel-video-count-wrapper p'
    );
    const viewsText = viewsP ? viewsP.textContent.trim() : '';

    // Extract CTA link
    const ctaLink = slide.querySelector(
      'a.cta-link, .sa_shorts_products-wrapper a, .sa_shorts_cta-btn'
    );

    // Build text content
    if (captionText) {
      const captionEl = document.createElement('p');
      captionEl.textContent = captionText;
      textCell.appendChild(captionEl);
    }

    if (viewsText) {
      const viewsEl = document.createElement('p');
      viewsEl.textContent = viewsText + ' views';
      textCell.appendChild(viewsEl);
    }

    if (ctaLink && ctaLink.tagName === 'A') {
      // Clone the link, remove any nested icon images
      const linkClone = ctaLink.cloneNode(true);
      const iconImgs = linkClone.querySelectorAll('img');
      iconImgs.forEach((iconImg) => iconImg.remove());

      // Clean up: keep only the text content of the CTA
      const linkText = linkClone.textContent.trim();
      if (linkText) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.setAttribute('href', ctaLink.getAttribute('href'));
        a.textContent = linkText;
        p.appendChild(a);
        textCell.appendChild(p);
      }
    } else if (ctaLink) {
      // If we matched a div.sa_shorts_cta-btn, look for parent <a>
      const parentLink = ctaLink.closest('a');
      if (parentLink) {
        const linkText = ctaLink.textContent.trim();
        if (linkText) {
          const p = document.createElement('p');
          const a = document.createElement('a');
          a.setAttribute('href', parentLink.getAttribute('href'));
          a.textContent = linkText;
          p.appendChild(a);
          textCell.appendChild(p);
        }
      }
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-shorts',
    cells,
  });

  element.replaceWith(block);
}
