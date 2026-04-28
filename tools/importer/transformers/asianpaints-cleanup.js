/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Asian Paints site-wide cleanup.
 * Removes non-authorable content (header, footer, modals, popups, widgets).
 * All selectors verified against migration-work/cleaned.html.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove modals and popups that block parsing
    // Found: <div class="modal fade-scale" id="visual-search-browse-image-modal"> (line 629, 1304)
    // Found: <div class="modal search-modal fade-scale" id="unified-search-popup"> (line 1285)
    // Found: <div class="modal fade modal__variant-otpValidation fade-scale" id="otpValidatePopup"> (line 1955)
    // Found: <div class="modal exit-modal exit-intent-aem fade-scale" id="exitPopupmodal"> (line 1991)
    // Found: <div class="modal splash-modal seventy-percent-popup fade-scale in" id="splash-popup"> (line 4904)
    // Found: <div class="fullwidthpopup"> (line 4900)
    // Found: <div class="keycloak-configs"> (line 49)
    // Found: <div class="unbxdScript"> (line 2)
    // Found: <div class="chatboxScript"> (line 4895)
    // Found: <div class="hello-user-popup-container"> (line 776)
    // Found: <div id="stickyFormBtnHeader" class="exit-intent-header-cta ..."> (line 803, 1276)
    WebImporter.DOMUtils.remove(element, [
      '#visual-search-browse-image-modal',
      '#unified-search-popup',
      '#otpValidatePopup',
      '#exitPopupmodal',
      '#splash-popup',
      '.fullwidthpopup',
      '.keycloak-configs',
      '.unbxdScript',
      '.chatboxScript',
      '.hello-user-popup-container',
      '#stickyFormBtnHeader',
      '.modal',
    ]);
  }

  if (hookName === H.after) {
    // Remove header: <div class="headerUnification aem-GridColumn ..."> (line 15)
    // Remove footer: <div class="footerUnification aem-GridColumn ..."> (line 4327)
    // Remove screen-reader-only h1 (not authored): <h1 class="sr-only"> (line 10)
    // Remove link elements (non-authorable): various <link> tags throughout
    // Remove noscript tags (non-authorable): Google Tag Manager noscript comments
    // Remove source elements (orphaned media sources)
    WebImporter.DOMUtils.remove(element, [
      '.headerUnification',
      '.footerUnification',
      'h1.sr-only',
      'link',
      'noscript',
    ]);

    // Clean tracking and interaction attributes from all elements
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-sly-test');
      el.removeAttribute('data-sly-use');
    });
  }
}
