/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-gallery
 * Base block: carousel
 * Source: https://www.asianpaints.com/
 * Selector: .colorslickgallery
 * Generated: 2026-04-28
 *
 * Colour of the Year gallery carousel from Asian Paints homepage.
 * Source structure: left panel with heading/description/CTA + right panel
 * with slick slider containing colour slides (room image + swatch image each).
 *
 * UE Model (carousel-item): media_image (reference), content_text (richtext)
 * Collapsed fields (skipped for hinting): media_imageAlt
 *
 * Each .color-slick-item slide becomes one row:
 *   Col 1 (media_image): room/scene image
 *   Col 2 (content_text): colour swatch image (richtext can contain images)
 *
 * The left-container introductory content (heading, description, CTA) is
 * included as text content in the first slide's second cell.
 */
export default function parse(element, { document }) {
  // Extract introductory content from the left container
  const leftContainer = element.querySelector('.left-container');
  const heading = leftContainer ? leftContainer.querySelector('h2') : null;
  const description = leftContainer ? leftContainer.querySelector('p') : null;
  const ctaLink = leftContainer ? leftContainer.querySelector('.cta a, a.view-all-button') : null;

  // Extract all slide items from the slick slider
  const slideItems = Array.from(element.querySelectorAll('.color-slick-item'));

  const cells = [];

  slideItems.forEach((slide, index) => {
    const pictures = Array.from(slide.querySelectorAll(':scope > picture'));
    const roomImage = pictures[0] || null;
    const swatchImage = pictures[1] || null;

    // Column 1: room/scene image with field hint
    const col1 = document.createDocumentFragment();
    col1.appendChild(document.createComment(' field:media_image '));
    if (roomImage) {
      col1.appendChild(roomImage);
    }

    // Column 2: swatch image and optional intro text (first slide only)
    // Per xwalk hinting rules: only add field hint when cell has content
    const col2 = document.createDocumentFragment();
    const hasIntroContent = index === 0 && (heading || description || ctaLink);
    const hasCol2Content = hasIntroContent || swatchImage;

    if (hasCol2Content) {
      col2.appendChild(document.createComment(' field:content_text '));
    }

    if (index === 0) {
      // First slide includes the introductory content from left panel
      if (heading) col2.appendChild(heading);
      if (description) col2.appendChild(description);
      if (ctaLink) {
        const ctaParagraph = document.createElement('p');
        ctaParagraph.appendChild(ctaLink);
        col2.appendChild(ctaParagraph);
      }
    }

    if (swatchImage) {
      col2.appendChild(swatchImage);
    }

    cells.push([col1, col2]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-gallery', cells });
  element.replaceWith(block);
}
