/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-banner
 * Base block: carousel
 * Source: https://www.asianpaints.com/
 * Selector: .banner-carousel-home-essentials-container
 * Generated: 2026-04-28
 *
 * Extracts hero banner carousel slides from the Asian Paints homepage.
 * Each slide has a background image (some with video fallback) and a CTA button.
 * Maps to carousel block library format: 2-column rows (image | text content).
 *
 * UE Model: carousel-banner-item
 *   - media_image (reference) + media_imageAlt (collapsed)
 *   - content_text (richtext)
 */
export default function parse(element, { document }) {
  // Select only the slick slides within the carousel track
  // Excludes .slick-cloned duplicates that slick.js creates for infinite loop
  const slides = Array.from(
    element.querySelectorAll('.slick-track > .slick-slide:not(.slick-cloned)')
  );

  // Fallback: if slick structure not found, try direct slide containers
  const slideElements = slides.length
    ? slides
    : Array.from(element.querySelectorAll('.slick-slide'));

  const cells = [];

  slideElements.forEach((slide) => {
    // --- Column 1: Image ---
    // Each slide has a banner-image-item link wrapping a <picture> with the banner image.
    // Slide 1 also has video elements and a secondary text overlay image;
    // we take the primary banner image (first <picture> or .default-image-section).
    const bannerLink = slide.querySelector('a.banner-image-item');
    const picture =
      slide.querySelector('picture.default-image-section') ||
      (bannerLink ? bannerLink.querySelector('picture') : null) ||
      slide.querySelector('picture');

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));
    if (picture) {
      imageCell.appendChild(picture);
    }

    // --- Column 2: Text content (CTA link) ---
    // The CTA sits in a .cta div as a sibling after the banner link inside each slide.
    // Source slides don't have headings/descriptions in the HTML; the overlay text
    // is baked into the banner image itself. The CTA button text is the actionable content.
    const ctaContainer = slide.querySelector('.cta');
    const ctaLink = ctaContainer
      ? ctaContainer.querySelector('a.animated-arrow-button, a')
      : null;

    const contentCell = document.createDocumentFragment();
    contentCell.appendChild(document.createComment(' field:content_text '));

    if (ctaLink) {
      // Clean the CTA link: remove the arrow span, keep text and href
      const arrowSpan = ctaLink.querySelector('span.arrow');
      if (arrowSpan) {
        arrowSpan.remove();
      }
      // Wrap CTA in a paragraph for proper richtext structure
      const p = document.createElement('p');
      const cleanLink = document.createElement('a');
      cleanLink.href = ctaLink.href;
      cleanLink.textContent = ctaLink.textContent.trim();
      p.appendChild(cleanLink);
      contentCell.appendChild(p);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-banner',
    cells,
  });

  element.replaceWith(block);
}
