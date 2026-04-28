/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-service variant.
 * Base block: cards
 * Source: https://www.asianpaints.com/
 * Selector: .icons-container
 * Generated: 2026-04-28
 *
 * Transforms the "Transform your space" icon links row into a Cards block.
 * Each icon-item link becomes a card row with image (col 1) and linked text (col 2).
 * Field hinting for xwalk: image and text fields per UE model.
 */
export default function parse(element, { document }) {
  // Extract all icon-item links from the icons-section
  const iconItems = element.querySelectorAll('.icons-section a.icon-item, .icons-section a.banner-icon');

  const cells = [];

  iconItems.forEach((item) => {
    // Column 1: Image with field hint
    const img = item.querySelector('.icon-wrapper img, figure img');
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      const picture = img.closest('picture');
      if (picture) {
        imageCell.appendChild(picture);
      } else {
        imageCell.appendChild(img);
      }
    }

    // Column 2: Text content with field hint (linked text preserving the CTA)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    const figcaption = item.querySelector('figcaption');
    const linkHref = item.getAttribute('href');
    const linkTitle = item.getAttribute('title');

    if (figcaption && linkHref) {
      // Create a paragraph with a link containing the caption text
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', linkHref);
      if (linkTitle) {
        a.setAttribute('title', linkTitle);
      }
      a.textContent = figcaption.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    } else if (figcaption) {
      const p = document.createElement('p');
      p.textContent = figcaption.textContent.trim();
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-service', cells });
  element.replaceWith(block);
}
