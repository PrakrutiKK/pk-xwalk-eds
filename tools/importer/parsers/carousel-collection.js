/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-collection variant.
 * Base block: carousel
 * Source: https://www.asianpaints.com/
 * Selector: .shade-tool-designer-collection
 * Generated: 2026-04-28
 *
 * Source structure:
 *   div.multiCarousalComponent.shade-tool-designer-collection
 *     h2.multiCarousalComponent-title (section default content, excluded)
 *     div.multiCarousalComponent-cards (slick slider container)
 *       div.multiCarousalComponent-card (repeated per slide)
 *         picture.multiCarousalComponent-logo > img (logo/brand image)
 *         div.multiCarousalComponent-img-wraper > video (video preview)
 *         div.multiCarousalComponent-content
 *           h3.multiCarousalComponent-content-title
 *           p.multiCarousalComponent-desk
 *           div.download-btn > a (CTA link)
 *
 * Target: carousel block table with 2 columns per row.
 *   Row per slide: [image] [text content with title + description + optional CTA]
 *
 * UE Model (carousel-item):
 *   - media_image (reference) -> image cell
 *   - media_imageAlt (collapsed, no hint)
 *   - content_text (richtext) -> text cell
 *
 * xwalk field hints: media_image, content_text
 */
export default function parse(element, { document }) {
  // Select all carousel slide cards
  const cards = element.querySelectorAll('.multiCarousalComponent-card');

  const cells = [];

  cards.forEach((card) => {
    // --- Column 1: Image ---
    // The picture.multiCarousalComponent-logo has <source srcset="..."> elements
    // but its <img> has no src attribute. We must set img.src from the best
    // available <source> srcset so the import framework can render the image.
    const picture = card.querySelector('picture.multiCarousalComponent-logo, :scope > picture');

    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));

    if (picture) {
      const img = picture.querySelector('img');
      if (img && !img.getAttribute('src')) {
        // Pick the desktop source (min-width:992px) first, then any source with srcset
        const desktopSource = picture.querySelector('source[media*="min-width:992px"]');
        const anySource = picture.querySelector('source[srcset]');
        const srcset = desktopSource
          ? desktopSource.getAttribute('srcset')
          : anySource
            ? anySource.getAttribute('srcset')
            : null;
        if (srcset) {
          // srcset may be protocol-relative; normalize to https
          const normalizedSrc = srcset.startsWith('//') ? `https:${srcset}` : srcset;
          img.setAttribute('src', normalizedSrc);
        }
      }
      imageCell.appendChild(picture);
    } else {
      // Fallback: use any img found in the card (e.g. from video wrapper)
      const fallbackImg = card.querySelector('.multiCarousalComponent-img-wraper img, img');
      if (fallbackImg) {
        imageCell.appendChild(fallbackImg);
      }
    }

    // --- Column 2: Text content (title + description + CTA) ---
    const title = card.querySelector(
      'h3.multiCarousalComponent-content-title, .multiCarousalComponent-content h3, .multiCarousalComponent-content h2'
    );
    const description = card.querySelector(
      'p.multiCarousalComponent-desk, .multiCarousalComponent-content p'
    );
    // Select CTA link from download-btn; exclude the icon img inside the link
    const ctaLink = card.querySelector('.download-btn a, .multiCarousalComponent-content a');

    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:content_text '));

    if (title) {
      textCell.appendChild(title);
    }
    if (description) {
      textCell.appendChild(description);
    }
    if (ctaLink) {
      // Remove nested icon images from the CTA link text (e.g. download icon)
      const iconImgs = ctaLink.querySelectorAll('img');
      iconImgs.forEach((iconImg) => iconImg.remove());
      // Wrap in a paragraph for proper markdown link rendering
      const p = document.createElement('p');
      p.appendChild(ctaLink);
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-collection',
    cells,
  });

  element.replaceWith(block);
}
