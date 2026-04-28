/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-product variant.
 * Base block: carousel
 * Source selector: .banner-carousel-featured-products-container
 * Source: https://www.asianpaints.com/
 * Generated: 2026-04-28
 *
 * Source HTML structure:
 *   div.banner-carousel-featured-products-container
 *     div.featured-products-title (section title - extracted as default content, not part of block)
 *     div.new-slick-container (slick slider)
 *       div.slick-list > div.slick-track
 *         div.slick-slide (some have .slick-cloned for infinite scroll duplicates)
 *           a.banner-image-item (link to product page)
 *             picture > img.banner-image (product image)
 *
 * Target table (from block library):
 *   Row per slide: [ image ] [ text content (optional: heading, description, CTA) ]
 *
 * UE Model (carousel-item): media_image, media_imageAlt (collapsed), content_text
 * Field hints: media_image on image cell, content_text on text cell (when non-empty)
 */
export default function parse(element, { document }) {
  // Select only non-cloned slides to avoid duplicates from slick infinite scroll
  const slides = element.querySelectorAll('.slick-slide:not(.slick-cloned)');

  const cells = [];

  slides.forEach((slide) => {
    // Extract the product image from the slide
    const img = slide.querySelector('img.banner-image, img');
    // Extract the link wrapping the image (product page URL)
    const link = slide.querySelector('a.banner-image-item, a[href]');

    // Cell 1: Image with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));
    if (img) {
      // Clone the picture element if available, otherwise use the img
      const picture = slide.querySelector('picture');
      if (picture) {
        imageCell.appendChild(picture);
      } else {
        imageCell.appendChild(img);
      }
    }

    // Cell 2: Text content with CTA link
    // Source slides have no heading/description, only a linked image.
    // Extract the product link as a CTA in the text cell.
    const textCell = document.createDocumentFragment();
    if (link && link.href) {
      textCell.appendChild(document.createComment(' field:content_text '));
      const cta = document.createElement('a');
      cta.href = link.href;
      // Derive a readable link text from the image alt or the link title
      const altText = img ? (img.getAttribute('alt') || '') : '';
      const linkTitle = link.getAttribute('title') || '';
      cta.textContent = altText || linkTitle || 'Learn More';
      textCell.appendChild(cta);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-product',
    cells,
  });

  element.replaceWith(block);
}
