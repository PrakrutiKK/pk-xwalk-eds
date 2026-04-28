/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tabs-wall
 * Base block: tabs
 * Source: https://www.asianpaints.com/
 * Selector: .whychooseus
 * Generated: 2026-04-28
 *
 * Maps the "Everything a home needs" service cards grid into a tabs block.
 * Each .our-services-card becomes one tab row with:
 *   - Cell 1 (tab label): card title text
 *   - Cell 2 (tab content): heading + image + rich text description
 *
 * xwalk model: tabs-wall-item fields: title, content_heading, content_headingType (skip), content_image, content_richtext
 * Collapsed fields (skipped): content_headingType (ends with Type)
 * Grouped fields (content_ prefix): content_heading, content_image, content_richtext -> single cell
 */
export default function parse(element, { document }) {
  // Extract all service cards from the source
  // Validated selectors against source.html:
  //   .our-services-card (lines 12, 26, 40, 54)
  //   .card-title (lines 21, 35, 49, 63)
  //   a.our-services-link (lines 13, 27, 41, 55)
  //   picture img (lines 19, 33, 47, 61)
  const cards = element.querySelectorAll('.our-services-card');

  const cells = [];

  cards.forEach((card) => {
    const link = card.querySelector('a.our-services-link, a.whyChooseCTA');
    const img = card.querySelector('picture');
    const titleSpan = card.querySelector('.card-title');
    const titleText = titleSpan ? titleSpan.textContent.trim() : '';

    // Cell 1: Tab label (title field)
    // Field hint for title
    const titleFrag = document.createDocumentFragment();
    titleFrag.appendChild(document.createComment(' field:title '));
    const titleEl = document.createElement('p');
    titleEl.textContent = titleText;
    titleFrag.appendChild(titleEl);

    // Cell 2: Tab content (grouped content_ fields: content_heading, content_image, content_richtext)
    const contentFrag = document.createDocumentFragment();

    // content_heading: use card title as a heading within the tab content
    contentFrag.appendChild(document.createComment(' field:content_heading '));
    const heading = document.createElement('h3');
    heading.textContent = titleText;
    contentFrag.appendChild(heading);

    // content_image: the card image
    if (img) {
      contentFrag.appendChild(document.createComment(' field:content_image '));
      contentFrag.appendChild(img);
    }

    // content_richtext: build a link with the card title and URL
    if (link) {
      contentFrag.appendChild(document.createComment(' field:content_richtext '));
      const richLink = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = titleText;
      richLink.appendChild(a);
      contentFrag.appendChild(richLink);
    }

    cells.push([titleFrag, contentFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'tabs-wall',
    cells,
  });

  element.replaceWith(block);
}
