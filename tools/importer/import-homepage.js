/* eslint-disable */
/* global WebImporter */

import carouselBannerParser from './parsers/carousel-banner.js';
import cardsServiceParser from './parsers/cards-service.js';
import carouselGalleryParser from './parsers/carousel-gallery.js';
import formParser from './parsers/form.js';
import carouselProductParser from './parsers/carousel-product.js';
import tabsWallParser from './parsers/tabs-wall.js';
import carouselPaletteParser from './parsers/carousel-palette.js';
import carouselCollectionParser from './parsers/carousel-collection.js';
import cardsInteriorParser from './parsers/cards-interior.js';
import columnsVideoParser from './parsers/columns-video.js';
import carouselShortsParser from './parsers/carousel-shorts.js';
import heroStoreParser from './parsers/hero-store.js';

import cleanupTransformer from './transformers/asianpaints-cleanup.js';
import sectionsTransformer from './transformers/asianpaints-sections.js';

const parsers = {
  'carousel-banner': carouselBannerParser,
  'cards-service': cardsServiceParser,
  'carousel-gallery': carouselGalleryParser,
  'form': formParser,
  'carousel-product': carouselProductParser,
  'tabs-wall': tabsWallParser,
  'carousel-palette': carouselPaletteParser,
  'carousel-collection': carouselCollectionParser,
  'cards-interior': cardsInteriorParser,
  'columns-video': columnsVideoParser,
  'carousel-shorts': carouselShortsParser,
  'hero-store': heroStoreParser,
};

const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Asian Paints homepage with hero banners, product categories, color exploration, and promotional content',
  urls: [
    'https://www.asianpaints.com/'
  ],
  blocks: [
    { name: 'carousel-banner', instances: ['.banner-carousel-home-essentials-container'] },
    { name: 'cards-service', instances: ['.icons-container'] },
    { name: 'carousel-gallery', instances: ['.colorslickgallery'] },
    { name: 'form', instances: ['.ccforms.aem-GridColumn'] },
    { name: 'carousel-product', instances: ['.banner-carousel-featured-products-container'] },
    { name: 'tabs-wall', instances: ['.whychooseus'] },
    { name: 'carousel-palette', instances: ['.color-slick-container.variant-two'] },
    { name: 'carousel-collection', instances: ['.shade-tool-designer-collection'] },
    { name: 'cards-interior', instances: ['.shopforinteriors-div'] },
    { name: 'columns-video', instances: ['.multi-video-column-container'] },
    { name: 'carousel-shorts', instances: ['.saleassist-video-shorts-root-container'] },
    { name: 'hero-store', instances: ['.imageBanner-fullwidth'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero Banner with Service Icons', selector: '.bannerwithslider.aem-GridColumn', style: null, blocks: ['carousel-banner', 'cards-service'], defaultContent: [] },
    { id: 'section-2', name: 'Colour of the Year Gallery', selector: '.colorslickgallery.aem-GridColumn', style: null, blocks: ['carousel-gallery'], defaultContent: [] },
    { id: 'section-3', name: 'Painting Service Form', selector: '.ccforms.aem-GridColumn', style: null, blocks: ['form'], defaultContent: [] },
    { id: 'section-4', name: 'Featured Products', selector: '.responsivegrid.padding45.baseCTSpace50', style: null, blocks: ['carousel-product'], defaultContent: ['.featured-products-title'] },
    { id: 'section-5', name: 'Everything For Your Walls', selector: '.responsivegrid.baseCTSpace50:has(.whychooseus)', style: null, blocks: ['tabs-wall'], defaultContent: ['.our-services-text'] },
    { id: 'section-6', name: 'Colour Fade Tool', selector: ['.responsivegrid.mob-margin-top-40:has(.color-slick-container)', '.color-slick-container.variant-two'], style: null, blocks: ['carousel-palette'], defaultContent: [] },
    { id: 'section-7', name: 'Designer Collections', selector: ['.responsivegrid.baseCTSpace50:has(.shade-tool-designer-collection)', '.shade-tool-designer-collection'], style: null, blocks: ['carousel-collection'], defaultContent: ['.multiCarousalComponent-title'] },
    { id: 'section-8', name: 'One-Stop Shop Interiors', selector: '.shopforinteriors-div', style: 'dark', blocks: ['cards-interior'], defaultContent: ['.shopforinteriors-div .txt-div h4'] },
    { id: 'section-9', name: 'Client Testimonial Videos', selector: '.multi-video-column-container', style: null, blocks: ['columns-video'], defaultContent: [] },
    { id: 'section-10', name: 'Inspiring Ideas Video Shorts', selector: '.responsivegrid.background-color-black', style: 'dark', blocks: ['carousel-shorts'], defaultContent: ['.rte.text.whiteColorText h2'] },
    { id: 'section-11', name: 'Find a Store Banner', selector: '.imageBanner-fullwidth', style: null, blocks: ['hero-store'], defaultContent: [] },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
