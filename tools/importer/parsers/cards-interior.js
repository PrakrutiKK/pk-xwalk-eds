/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-interior
 * Base block: cards
 * Source: https://www.asianpaints.com/
 * Selector: .shopforinteriors-div
 * Generated: 2026-04-28
 *
 * Extracts interior product category cards from the "One-stop shop for all
 * things interiors" section. Each card contains an image, title, description,
 * and CTA link. The section heading/description (.txt-div) is default content
 * and is NOT included in the block table.
 *
 * UE Model: cards-interior-card (container block)
 *   - image (reference) — card image
 *   - text (richtext) — title + description + CTA
 *
 * Source structure:
 *   .shopforinteriors-div > .black-container > .three-img-div > .img-div[]
 *   Each .img-div: picture.title-image, h5, p, .cta > a
 */
export default function parse(element, { document }) {
  // Select all card items — each .img-div is one card
  const cards = element.querySelectorAll('.three-img-div > .img-div, .three-img-div .img-div');
  const cells = [];

  cards.forEach((card) => {
    // Column 1: Image with field hint
    const picture = card.querySelector('picture.title-image, picture');
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    if (picture) {
      imageFrag.appendChild(picture);
    }

    // Column 2: Text content (title + description + CTA) with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    const heading = card.querySelector('h5, h4, h3, h2, [class*="title"]:not(picture)');
    if (heading) {
      textFrag.appendChild(heading);
    }

    const description = card.querySelector('p, [class*="description"]');
    if (description) {
      textFrag.appendChild(description);
    }

    const ctaLink = card.querySelector('.cta a, a.animated-arrow-button, a[href]');
    if (ctaLink) {
      // Clean the link text — remove arrow span artifacts
      const arrowSpan = ctaLink.querySelector('span.arrow, span');
      if (arrowSpan) {
        arrowSpan.remove();
      }
      textFrag.appendChild(ctaLink);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-interior',
    cells,
  });

  element.replaceWith(block);
}
