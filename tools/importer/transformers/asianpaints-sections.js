/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Asian Paints section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for styled sections.
 * Runs in afterTransform only. Uses payload.template.sections from page-templates.json.
 *
 * Template has 11 sections. Section breaks (hr): 10 expected.
 * Sections with style: section-8 (dark), section-10 (dark) = 2 Section Metadata blocks expected.
 *
 * Section selectors (all verified against migration-work/cleaned.html):
 *   section-1:  .bannerwithslider.aem-GridColumn
 *   section-2:  .colorslickgallery.aem-GridColumn
 *   section-3:  .ccforms.aem-GridColumn
 *   section-4:  .responsivegrid.padding45.baseCTSpace50
 *   section-5:  .responsivegrid.baseCTSpace50:has(.whychooseus)
 *   section-6:  .responsivegrid.mob-margin-top-40:has(.color-slick-container) or .color-slick-container.variant-two
 *   section-7:  .responsivegrid.baseCTSpace50:has(.shade-tool-designer-collection) or .shade-tool-designer-collection
 *   section-8:  .shopforinteriors-div (style: dark)
 *   section-9:  .multi-video-column-container
 *   section-10: .responsivegrid.background-color-black (style: dark)
 *   section-11: .imageBanner-fullwidth
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const doc = element.ownerDocument || document;
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid shifting DOM positions
    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section, reverseIndex) => {
      const isFirst = reverseIndex === sections.length - 1; // first section in original order
      const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];

      // Find the first matching element for this section
      let sectionEl = null;
      for (const sel of selectorList) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) return;

      // Add Section Metadata block after the section element if it has a style
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Insert the Section Metadata after the section element
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(metadataBlock);
        }
      }

      // Insert <hr> before the section element (except for the first section)
      if (!isFirst) {
        const hr = doc.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    });
  }
}
