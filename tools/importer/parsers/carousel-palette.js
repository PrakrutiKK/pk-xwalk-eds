/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-palette
 * Base block: carousel
 * Source selector: .color-slick-container.variant-two
 * Source: https://www.asianpaints.com/
 * Generated: 2026-04-28
 *
 * Extracts colour tool slides from the Asian Paints homepage "Colour Tools"
 * section. Each slide has an image and a title. The heading ("Colour Tools")
 * is not part of the carousel block itself (it lives outside the slide data)
 * but is included as the first slide's text prefix when present.
 *
 * UE Model: carousel-palette-item
 *   - media_image  (reference)  -> col 1: image
 *   - media_imageAlt (text, collapsed)
 *   - content_text (richtext)   -> col 2: text content
 */
export default function parse(element, { document }) {
  // --- Extract slides from source DOM ---
  // Each slide is a .color-slick-item inside the slick track
  const slides = Array.from(
    element.querySelectorAll('.color-slick-item.track-variant-two')
  );

  // Build cells: one row per slide, two columns (image | text)
  const cells = [];

  slides.forEach((slide) => {
    // Column 1: image with field hint
    const picture = slide.querySelector('picture');
    const imgCell = document.createDocumentFragment();
    if (picture) {
      imgCell.appendChild(document.createComment(' field:media_image '));
      imgCell.appendChild(picture);
    }

    // Column 2: text content with field hint
    const titleEl = slide.querySelector('.item-title');
    const textCell = document.createDocumentFragment();
    if (titleEl) {
      textCell.appendChild(document.createComment(' field:content_text '));
      // Wrap in a paragraph to preserve richtext semantics
      const p = document.createElement('p');
      p.textContent = titleEl.textContent.trim();
      textCell.appendChild(p);
    }

    cells.push([imgCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-palette',
    cells,
  });

  element.replaceWith(block);
}
