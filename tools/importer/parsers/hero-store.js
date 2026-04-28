/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-store variant.
 * Base block: hero
 * Source selector: .imageBanner-fullwidth
 * Source: https://www.asianpaints.com/
 * Generated: 2026-04-28
 *
 * Source HTML structure:
 *   div.imageBanner-fullwidth
 *     span.cmp-image
 *       a.cmp-image__link[href="...store-locator..."]
 *         div > picture > img[alt="find a store banner"]
 *
 * Target block structure (hero, 2 data rows):
 *   Row 1: Background image (field: image / imageAlt)
 *   Row 2: Text content with CTA link (field: text)
 *
 * UE Model fields: image (reference), imageAlt (text), text (richtext)
 */
export default function parse(element, { document }) {
  // Extract the banner image from the source
  const img = element.querySelector('img');
  const link = element.querySelector('a.cmp-image__link, a[href]');

  const cells = [];

  // Row 1: Background image (maps to image + imageAlt fields)
  if (img) {
    const imageComment = document.createComment(' field: image ');
    const imgClone = img.cloneNode(true);
    cells.push([imageComment, imgClone]);
  } else {
    // Empty row required for xwalk even if no image found
    cells.push(['']);
  }

  // Row 2: Text content with CTA (maps to text field)
  const textComment = document.createComment(' field: text ');
  const contentCell = [textComment];

  if (link) {
    const href = link.getAttribute('href') || '';
    // Create a CTA link element for the store locator
    const ctaLink = document.createElement('a');
    ctaLink.setAttribute('href', href);
    // Use the image alt text or a sensible label for the link text
    const altText = img ? img.getAttribute('alt') || '' : '';
    ctaLink.textContent = altText || 'Find a Store';
    // Wrap in a paragraph for proper richtext rendering
    const p = document.createElement('p');
    p.appendChild(ctaLink);
    contentCell.push(p);
  }

  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-store', cells });
  element.replaceWith(block);
}
