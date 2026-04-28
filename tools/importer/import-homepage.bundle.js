var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-banner.js
  function parse(element, { document }) {
    const slides = Array.from(
      element.querySelectorAll(".slick-track > .slick-slide:not(.slick-cloned)")
    );
    const slideElements = slides.length ? slides : Array.from(element.querySelectorAll(".slick-slide"));
    const cells = [];
    slideElements.forEach((slide) => {
      const bannerLink = slide.querySelector("a.banner-image-item");
      const picture = slide.querySelector("picture.default-image-section") || (bannerLink ? bannerLink.querySelector("picture") : null) || slide.querySelector("picture");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      if (picture) {
        imageCell.appendChild(picture);
      }
      const ctaContainer = slide.querySelector(".cta");
      const ctaLink = ctaContainer ? ctaContainer.querySelector("a.animated-arrow-button, a") : null;
      const contentCell = document.createDocumentFragment();
      contentCell.appendChild(document.createComment(" field:content_text "));
      if (ctaLink) {
        const arrowSpan = ctaLink.querySelector("span.arrow");
        if (arrowSpan) {
          arrowSpan.remove();
        }
        const p = document.createElement("p");
        const cleanLink = document.createElement("a");
        cleanLink.href = ctaLink.href;
        cleanLink.textContent = ctaLink.textContent.trim();
        p.appendChild(cleanLink);
        contentCell.appendChild(p);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-banner",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-service.js
  function parse2(element, { document }) {
    const iconItems = element.querySelectorAll(".icons-section a.icon-item, .icons-section a.banner-icon");
    const cells = [];
    iconItems.forEach((item) => {
      const img = item.querySelector(".icon-wrapper img, figure img");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        const picture = img.closest("picture");
        if (picture) {
          imageCell.appendChild(picture);
        } else {
          imageCell.appendChild(img);
        }
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      const figcaption = item.querySelector("figcaption");
      const linkHref = item.getAttribute("href");
      const linkTitle = item.getAttribute("title");
      if (figcaption && linkHref) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", linkHref);
        if (linkTitle) {
          a.setAttribute("title", linkTitle);
        }
        a.textContent = figcaption.textContent.trim();
        p.appendChild(a);
        textCell.appendChild(p);
      } else if (figcaption) {
        const p = document.createElement("p");
        p.textContent = figcaption.textContent.trim();
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-service", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-gallery.js
  function parse3(element, { document }) {
    const leftContainer = element.querySelector(".left-container");
    const heading = leftContainer ? leftContainer.querySelector("h2") : null;
    const description = leftContainer ? leftContainer.querySelector("p") : null;
    const ctaLink = leftContainer ? leftContainer.querySelector(".cta a, a.view-all-button") : null;
    const slideItems = Array.from(element.querySelectorAll(".color-slick-item"));
    const cells = [];
    slideItems.forEach((slide, index) => {
      const pictures = Array.from(slide.querySelectorAll(":scope > picture"));
      const roomImage = pictures[0] || null;
      const swatchImage = pictures[1] || null;
      const col1 = document.createDocumentFragment();
      col1.appendChild(document.createComment(" field:media_image "));
      if (roomImage) {
        col1.appendChild(roomImage);
      }
      const col2 = document.createDocumentFragment();
      const hasIntroContent = index === 0 && (heading || description || ctaLink);
      const hasCol2Content = hasIntroContent || swatchImage;
      if (hasCol2Content) {
        col2.appendChild(document.createComment(" field:content_text "));
      }
      if (index === 0) {
        if (heading) col2.appendChild(heading);
        if (description) col2.appendChild(description);
        if (ctaLink) {
          const ctaParagraph = document.createElement("p");
          ctaParagraph.appendChild(ctaLink);
          col2.appendChild(ctaParagraph);
        }
      }
      if (swatchImage) {
        col2.appendChild(swatchImage);
      }
      cells.push([col1, col2]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form.js
  function parse4(element, { document }) {
    const formEl = element.querySelector("form.form-revamp-vertical") || element.querySelector("form.form-group-global__enquire-form") || element.querySelector("form");
    const formAction = formEl && formEl.getAttribute("action") ? formEl.getAttribute("action") : "";
    const formRefLink = document.createElement("a");
    formRefLink.href = "/forms/painting-service-form.json";
    formRefLink.textContent = "Painting Service Form";
    const actionLink = document.createElement("a");
    actionLink.href = formAction || "/forms/submit";
    actionLink.textContent = formAction || "/forms/submit";
    const cells = [];
    const refFrag = document.createDocumentFragment();
    refFrag.appendChild(document.createComment(" field:reference "));
    refFrag.appendChild(formRefLink);
    cells.push([refFrag]);
    const actionFrag = document.createDocumentFragment();
    actionFrag.appendChild(document.createComment(" field:action "));
    actionFrag.appendChild(actionLink);
    cells.push([actionFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "form", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product.js
  function parse5(element, { document }) {
    const slides = element.querySelectorAll(".slick-slide:not(.slick-cloned)");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("img.banner-image, img");
      const link = slide.querySelector("a.banner-image-item, a[href]");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      if (img) {
        const picture = slide.querySelector("picture");
        if (picture) {
          imageCell.appendChild(picture);
        } else {
          imageCell.appendChild(img);
        }
      }
      const textCell = document.createDocumentFragment();
      if (link && link.href) {
        textCell.appendChild(document.createComment(" field:content_text "));
        const cta = document.createElement("a");
        cta.href = link.href;
        const altText = img ? img.getAttribute("alt") || "" : "";
        const linkTitle = link.getAttribute("title") || "";
        cta.textContent = altText || linkTitle || "Learn More";
        textCell.appendChild(cta);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-product",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-wall.js
  function parse6(element, { document }) {
    const cards = element.querySelectorAll(".our-services-card");
    const cells = [];
    cards.forEach((card) => {
      const link = card.querySelector("a.our-services-link, a.whyChooseCTA");
      const img = card.querySelector("picture");
      const titleSpan = card.querySelector(".card-title");
      const titleText = titleSpan ? titleSpan.textContent.trim() : "";
      const titleFrag = document.createDocumentFragment();
      titleFrag.appendChild(document.createComment(" field:title "));
      const titleEl = document.createElement("p");
      titleEl.textContent = titleText;
      titleFrag.appendChild(titleEl);
      const contentFrag = document.createDocumentFragment();
      contentFrag.appendChild(document.createComment(" field:content_heading "));
      const heading = document.createElement("h3");
      heading.textContent = titleText;
      contentFrag.appendChild(heading);
      if (img) {
        contentFrag.appendChild(document.createComment(" field:content_image "));
        contentFrag.appendChild(img);
      }
      if (link) {
        contentFrag.appendChild(document.createComment(" field:content_richtext "));
        const richLink = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = titleText;
        richLink.appendChild(a);
        contentFrag.appendChild(richLink);
      }
      cells.push([titleFrag, contentFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "tabs-wall",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-palette.js
  function parse7(element, { document }) {
    const slides = Array.from(
      element.querySelectorAll(".color-slick-item.track-variant-two")
    );
    const cells = [];
    slides.forEach((slide) => {
      const picture = slide.querySelector("picture");
      const imgCell = document.createDocumentFragment();
      if (picture) {
        imgCell.appendChild(document.createComment(" field:media_image "));
        imgCell.appendChild(picture);
      }
      const titleEl = slide.querySelector(".item-title");
      const textCell = document.createDocumentFragment();
      if (titleEl) {
        textCell.appendChild(document.createComment(" field:content_text "));
        const p = document.createElement("p");
        p.textContent = titleEl.textContent.trim();
        textCell.appendChild(p);
      }
      cells.push([imgCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-palette",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-collection.js
  function parse8(element, { document }) {
    const cards = element.querySelectorAll(".multiCarousalComponent-card");
    const cells = [];
    cards.forEach((card) => {
      const picture = card.querySelector("picture.multiCarousalComponent-logo, :scope > picture");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      if (picture) {
        const img = picture.querySelector("img");
        if (img && !img.getAttribute("src")) {
          const desktopSource = picture.querySelector('source[media*="min-width:992px"]');
          const anySource = picture.querySelector("source[srcset]");
          const srcset = desktopSource ? desktopSource.getAttribute("srcset") : anySource ? anySource.getAttribute("srcset") : null;
          if (srcset) {
            const normalizedSrc = srcset.startsWith("//") ? `https:${srcset}` : srcset;
            img.setAttribute("src", normalizedSrc);
          }
        }
        imageCell.appendChild(picture);
      } else {
        const fallbackImg = card.querySelector(".multiCarousalComponent-img-wraper img, img");
        if (fallbackImg) {
          imageCell.appendChild(fallbackImg);
        }
      }
      const title = card.querySelector(
        "h3.multiCarousalComponent-content-title, .multiCarousalComponent-content h3, .multiCarousalComponent-content h2"
      );
      const description = card.querySelector(
        "p.multiCarousalComponent-desk, .multiCarousalComponent-content p"
      );
      const ctaLink = card.querySelector(".download-btn a, .multiCarousalComponent-content a");
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:content_text "));
      if (title) {
        textCell.appendChild(title);
      }
      if (description) {
        textCell.appendChild(description);
      }
      if (ctaLink) {
        const iconImgs = ctaLink.querySelectorAll("img");
        iconImgs.forEach((iconImg) => iconImg.remove());
        const p = document.createElement("p");
        p.appendChild(ctaLink);
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-collection",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-interior.js
  function parse9(element, { document }) {
    const cards = element.querySelectorAll(".three-img-div > .img-div, .three-img-div .img-div");
    const cells = [];
    cards.forEach((card) => {
      const picture = card.querySelector("picture.title-image, picture");
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      if (picture) {
        imageFrag.appendChild(picture);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const heading = card.querySelector('h5, h4, h3, h2, [class*="title"]:not(picture)');
      if (heading) {
        textFrag.appendChild(heading);
      }
      const description = card.querySelector('p, [class*="description"]');
      if (description) {
        textFrag.appendChild(description);
      }
      const ctaLink = card.querySelector(".cta a, a.animated-arrow-button, a[href]");
      if (ctaLink) {
        const arrowSpan = ctaLink.querySelector("span.arrow, span");
        if (arrowSpan) {
          arrowSpan.remove();
        }
        textFrag.appendChild(ctaLink);
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-interior",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-video.js
  function parse10(element, { document }) {
    const headingSection = element.querySelector(".water-proofing-heading .first-sub-heading-section");
    if (headingSection) {
      const headingOne = element.querySelector(".sub-heading-one");
      const headingTwo = element.querySelector(".sub-heading-two");
      const headingText = [
        headingOne ? headingOne.textContent.trim() : "",
        headingTwo ? headingTwo.textContent.trim() : ""
      ].filter(Boolean).join(" ");
      if (headingText) {
        const h2 = document.createElement("h2");
        h2.textContent = headingText;
        element.before(h2);
      }
    }
    const testimonials = Array.from(
      element.querySelectorAll(".slick-track > .testimonial-image-section.slick-slide:not(.slick-cloned)")
    );
    const cells = [];
    testimonials.forEach((testimonial) => {
      const carouselImage = testimonial.querySelector(".carousel-image");
      const col1 = [];
      if (carouselImage) {
        const inlineStyle = carouselImage.getAttribute("style") || "";
        const thumbMatch = inlineStyle.match(/--slick-image-url:\s*url\(['"]?([^'")\s]+)['"]?\)/);
        const thumbUrl = thumbMatch ? thumbMatch[1] : "";
        const pictureEl = carouselImage.querySelector("picture[data-id]");
        const videoUrl = pictureEl ? pictureEl.getAttribute("data-id") || "" : "";
        if (thumbUrl) {
          const absoluteThumbUrl = thumbUrl.startsWith("//") ? `https:${thumbUrl}` : thumbUrl.startsWith("/") ? `https://www.asianpaints.com${thumbUrl}` : thumbUrl;
          const img = document.createElement("img");
          img.setAttribute("src", absoluteThumbUrl);
          img.setAttribute("alt", "testimonial video thumbnail");
          if (videoUrl) {
            const link = document.createElement("a");
            link.setAttribute("href", videoUrl);
            link.appendChild(img);
            col1.push(link);
          } else {
            col1.push(img);
          }
        }
      }
      const col2 = [];
      const descriptionEl = testimonial.querySelector(".image-description");
      if (descriptionEl) {
        const p = document.createElement("p");
        p.textContent = descriptionEl.textContent.trim();
        col2.push(p);
      }
      const nameEl = testimonial.querySelector(".image-text .name");
      const placeEl = testimonial.querySelector(".image-text .place");
      if (nameEl || placeEl) {
        const authorP = document.createElement("p");
        const nameText = nameEl ? nameEl.textContent.trim().replace(/,\s*$/, "") : "";
        const placeText = placeEl ? placeEl.textContent.trim() : "";
        authorP.textContent = [nameText, placeText].filter(Boolean).join(", ");
        const strong = document.createElement("strong");
        strong.textContent = authorP.textContent;
        authorP.textContent = "";
        authorP.appendChild(strong);
        col2.push(authorP);
      }
      cells.push([col1, col2]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-shorts.js
  function parse11(element, { document }) {
    const slides = element.querySelectorAll(
      ".swiper-slide.sa_shorts_video-wrapper, .sa_shorts_video-wrapper"
    );
    const cells = [];
    slides.forEach((slide) => {
      const videoSource = slide.querySelector("video source[src], video[src]");
      const videoUrl = videoSource ? videoSource.getAttribute("src") : null;
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      if (videoUrl) {
        const videoLink = document.createElement("a");
        videoLink.setAttribute("href", videoUrl);
        videoLink.textContent = videoUrl;
        imageCell.appendChild(videoLink);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:content_text "));
      const captionP = slide.querySelector(".sa_shorts_parentVideo-caption > p, .sa_shorts_parentVideo-caption p");
      const captionText = captionP ? captionP.textContent.trim() : "";
      const viewsP = slide.querySelector(
        "p.carousel-video-views-count, .carousel-video-count-wrapper p"
      );
      const viewsText = viewsP ? viewsP.textContent.trim() : "";
      const ctaLink = slide.querySelector(
        "a.cta-link, .sa_shorts_products-wrapper a, .sa_shorts_cta-btn"
      );
      if (captionText) {
        const captionEl = document.createElement("p");
        captionEl.textContent = captionText;
        textCell.appendChild(captionEl);
      }
      if (viewsText) {
        const viewsEl = document.createElement("p");
        viewsEl.textContent = viewsText + " views";
        textCell.appendChild(viewsEl);
      }
      if (ctaLink && ctaLink.tagName === "A") {
        const linkClone = ctaLink.cloneNode(true);
        const iconImgs = linkClone.querySelectorAll("img");
        iconImgs.forEach((iconImg) => iconImg.remove());
        const linkText = linkClone.textContent.trim();
        if (linkText) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.setAttribute("href", ctaLink.getAttribute("href"));
          a.textContent = linkText;
          p.appendChild(a);
          textCell.appendChild(p);
        }
      } else if (ctaLink) {
        const parentLink = ctaLink.closest("a");
        if (parentLink) {
          const linkText = ctaLink.textContent.trim();
          if (linkText) {
            const p = document.createElement("p");
            const a = document.createElement("a");
            a.setAttribute("href", parentLink.getAttribute("href"));
            a.textContent = linkText;
            p.appendChild(a);
            textCell.appendChild(p);
          }
        }
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-shorts",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-store.js
  function parse12(element, { document }) {
    const img = element.querySelector("img");
    const link = element.querySelector("a.cmp-image__link, a[href]");
    const cells = [];
    if (img) {
      const imageComment = document.createComment(" field: image ");
      const imgClone = img.cloneNode(true);
      cells.push([imageComment, imgClone]);
    } else {
      cells.push([""]);
    }
    const textComment = document.createComment(" field: text ");
    const contentCell = [textComment];
    if (link) {
      const href = link.getAttribute("href") || "";
      const ctaLink = document.createElement("a");
      ctaLink.setAttribute("href", href);
      const altText = img ? img.getAttribute("alt") || "" : "";
      ctaLink.textContent = altText || "Find a Store";
      const p = document.createElement("p");
      p.appendChild(ctaLink);
      contentCell.push(p);
    }
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-store", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/asianpaints-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#visual-search-browse-image-modal",
        "#unified-search-popup",
        "#otpValidatePopup",
        "#exitPopupmodal",
        "#splash-popup",
        ".fullwidthpopup",
        ".keycloak-configs",
        ".unbxdScript",
        ".chatboxScript",
        ".hello-user-popup-container",
        "#stickyFormBtnHeader",
        ".modal"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".headerUnification",
        ".footerUnification",
        "h1.sr-only",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
        el.removeAttribute("data-sly-test");
        el.removeAttribute("data-sly-use");
      });
    }
  }

  // tools/importer/transformers/asianpaints-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const doc = element.ownerDocument || document;
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section, reverseIndex) => {
        const isFirst = reverseIndex === sections.length - 1;
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(metadataBlock);
          }
        }
        if (!isFirst) {
          const hr = doc.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-banner": parse,
    "cards-service": parse2,
    "carousel-gallery": parse3,
    "form": parse4,
    "carousel-product": parse5,
    "tabs-wall": parse6,
    "carousel-palette": parse7,
    "carousel-collection": parse8,
    "cards-interior": parse9,
    "columns-video": parse10,
    "carousel-shorts": parse11,
    "hero-store": parse12
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Asian Paints homepage with hero banners, product categories, color exploration, and promotional content",
    urls: [
      "https://www.asianpaints.com/"
    ],
    blocks: [
      { name: "carousel-banner", instances: [".banner-carousel-home-essentials-container"] },
      { name: "cards-service", instances: [".icons-container"] },
      { name: "carousel-gallery", instances: [".colorslickgallery"] },
      { name: "form", instances: [".ccforms.aem-GridColumn"] },
      { name: "carousel-product", instances: [".banner-carousel-featured-products-container"] },
      { name: "tabs-wall", instances: [".whychooseus"] },
      { name: "carousel-palette", instances: [".color-slick-container.variant-two"] },
      { name: "carousel-collection", instances: [".shade-tool-designer-collection"] },
      { name: "cards-interior", instances: [".shopforinteriors-div"] },
      { name: "columns-video", instances: [".multi-video-column-container"] },
      { name: "carousel-shorts", instances: [".saleassist-video-shorts-root-container"] },
      { name: "hero-store", instances: [".imageBanner-fullwidth"] }
    ],
    sections: [
      { id: "section-1", name: "Hero Banner with Service Icons", selector: ".bannerwithslider.aem-GridColumn", style: null, blocks: ["carousel-banner", "cards-service"], defaultContent: [] },
      { id: "section-2", name: "Colour of the Year Gallery", selector: ".colorslickgallery.aem-GridColumn", style: null, blocks: ["carousel-gallery"], defaultContent: [] },
      { id: "section-3", name: "Painting Service Form", selector: ".ccforms.aem-GridColumn", style: null, blocks: ["form"], defaultContent: [] },
      { id: "section-4", name: "Featured Products", selector: ".responsivegrid.padding45.baseCTSpace50", style: null, blocks: ["carousel-product"], defaultContent: [".featured-products-title"] },
      { id: "section-5", name: "Everything For Your Walls", selector: ".responsivegrid.baseCTSpace50:has(.whychooseus)", style: null, blocks: ["tabs-wall"], defaultContent: [".our-services-text"] },
      { id: "section-6", name: "Colour Fade Tool", selector: [".responsivegrid.mob-margin-top-40:has(.color-slick-container)", ".color-slick-container.variant-two"], style: null, blocks: ["carousel-palette"], defaultContent: [] },
      { id: "section-7", name: "Designer Collections", selector: [".responsivegrid.baseCTSpace50:has(.shade-tool-designer-collection)", ".shade-tool-designer-collection"], style: null, blocks: ["carousel-collection"], defaultContent: [".multiCarousalComponent-title"] },
      { id: "section-8", name: "One-Stop Shop Interiors", selector: ".shopforinteriors-div", style: "dark", blocks: ["cards-interior"], defaultContent: [".shopforinteriors-div .txt-div h4"] },
      { id: "section-9", name: "Client Testimonial Videos", selector: ".multi-video-column-container", style: null, blocks: ["columns-video"], defaultContent: [] },
      { id: "section-10", name: "Inspiring Ideas Video Shorts", selector: ".responsivegrid.background-color-black", style: "dark", blocks: ["carousel-shorts"], defaultContent: [".rte.text.whiteColorText h2"] },
      { id: "section-11", name: "Find a Store Banner", selector: ".imageBanner-fullwidth", style: null, blocks: ["hero-store"], defaultContent: [] }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
