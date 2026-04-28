/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-video variant.
 * Base block: columns
 * Source: https://www.asianpaints.com/
 * Selector: .multi-video-column-container
 * Generated: 2026-04-28
 *
 * Extracts client testimonial video columns from the Asian Paints homepage.
 * Each testimonial slide becomes one row with two columns:
 *   - Column 1: video thumbnail image (extracted from CSS custom property
 *     --slick-image-url on .carousel-image) linked to the YouTube video URL
 *     (from data-id on the picture element)
 *   - Column 2: testimonial quote text + author name and location
 *
 * Columns blocks do NOT require field hint comments per xwalk hinting rules.
 */
export default function parse(element, { document }) {
  // Extract section heading text for use as default content before the block
  const headingSection = element.querySelector('.water-proofing-heading .first-sub-heading-section');
  if (headingSection) {
    const headingOne = element.querySelector('.sub-heading-one');
    const headingTwo = element.querySelector('.sub-heading-two');
    const headingText = [
      headingOne ? headingOne.textContent.trim() : '',
      headingTwo ? headingTwo.textContent.trim() : '',
    ].filter(Boolean).join(' ');

    if (headingText) {
      const h2 = document.createElement('h2');
      h2.textContent = headingText;
      element.before(h2);
    }
  }

  // Select all testimonial slides, excluding slick-cloned duplicates
  const testimonials = Array.from(
    element.querySelectorAll('.slick-track > .testimonial-image-section.slick-slide:not(.slick-cloned)')
  );

  const cells = [];

  testimonials.forEach((testimonial) => {
    // Column 1: Video thumbnail image + YouTube link
    const carouselImage = testimonial.querySelector('.carousel-image');
    const col1 = [];

    if (carouselImage) {
      // Thumbnail is a CSS custom property --slick-image-url in inline style
      const inlineStyle = carouselImage.getAttribute('style') || '';
      const thumbMatch = inlineStyle.match(/--slick-image-url:\s*url\(['"]?([^'")\s]+)['"]?\)/);
      const thumbUrl = thumbMatch ? thumbMatch[1] : '';

      // YouTube video URL stored as data-id on the picture element
      const pictureEl = carouselImage.querySelector('picture[data-id]');
      const videoUrl = pictureEl ? pictureEl.getAttribute('data-id') || '' : '';

      if (thumbUrl) {
        // Resolve relative URL to absolute
        const absoluteThumbUrl = thumbUrl.startsWith('//')
          ? `https:${thumbUrl}`
          : thumbUrl.startsWith('/')
            ? `https://www.asianpaints.com${thumbUrl}`
            : thumbUrl;

        const img = document.createElement('img');
        img.setAttribute('src', absoluteThumbUrl);
        img.setAttribute('alt', 'testimonial video thumbnail');

        if (videoUrl) {
          // Wrap the image in a link to the YouTube video
          const link = document.createElement('a');
          link.setAttribute('href', videoUrl);
          link.appendChild(img);
          col1.push(link);
        } else {
          col1.push(img);
        }
      }
    }

    // Column 2: Quote text + author name and location
    const col2 = [];

    const descriptionEl = testimonial.querySelector('.image-description');
    if (descriptionEl) {
      const p = document.createElement('p');
      p.textContent = descriptionEl.textContent.trim();
      col2.push(p);
    }

    const nameEl = testimonial.querySelector('.image-text .name');
    const placeEl = testimonial.querySelector('.image-text .place');
    if (nameEl || placeEl) {
      const authorP = document.createElement('p');
      const nameText = nameEl ? nameEl.textContent.trim().replace(/,\s*$/, '') : '';
      const placeText = placeEl ? placeEl.textContent.trim() : '';
      authorP.textContent = [nameText, placeText].filter(Boolean).join(', ');
      const strong = document.createElement('strong');
      strong.textContent = authorP.textContent;
      authorP.textContent = '';
      authorP.appendChild(strong);
      col2.push(authorP);
    }

    cells.push([col1, col2]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-video', cells });
  element.replaceWith(block);
}
