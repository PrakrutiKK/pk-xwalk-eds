/* eslint-disable */
/* global WebImporter */

/**
 * Parser for form variant.
 * Base block: form
 * Source: https://www.asianpaints.com/
 * Selector: .ccforms.aem-GridColumn
 *
 * Source HTML structure:
 *   .ccforms.aem-GridColumn
 *     .ccFormScheduler
 *       .enquire-form.enquire-form__container
 *         .formVerticalVariant
 *           .formVerticalLeft (heading + description)
 *           .formVerticalRight (actual form with Name, Email, Mobile, PIN Code)
 *
 * UE Model fields (from blocks/form/_form.json):
 *   - reference (aem-content): link to form JSON definition
 *   - action (text): action/submit URL
 *
 * Target block table structure (from library example):
 *   | Form |
 *   | [Form Link](/path/to/form.json) |
 *
 * For xwalk, we produce two rows:
 *   Row 1: reference - link to form JSON definition
 *   Row 2: action - the form submit/action URL
 *
 * Generated: 2026-04-28
 */
export default function parse(element, { document }) {
  // Extract the form action URL from the source form element
  // The main visible form is inside .formVerticalRight or .enquire-form__step-1
  const formEl = element.querySelector('form.form-revamp-vertical')
    || element.querySelector('form.form-group-global__enquire-form')
    || element.querySelector('form');

  const formAction = formEl && formEl.getAttribute('action')
    ? formEl.getAttribute('action')
    : '';

  // Build the form JSON reference link
  // During import, forms are migrated to a JSON definition; use a placeholder path
  // that will be resolved by the form migration step
  const formRefLink = document.createElement('a');
  formRefLink.href = '/forms/painting-service-form.json';
  formRefLink.textContent = 'Painting Service Form';

  // Build the action URL link
  // If the source form had an action, preserve it; otherwise use a placeholder
  const actionLink = document.createElement('a');
  actionLink.href = formAction || '/forms/submit';
  actionLink.textContent = formAction || '/forms/submit';

  // Build cells array matching the UE model:
  // Row 1: reference (aem-content) - link to form JSON
  // Row 2: action (text) - submit URL
  const cells = [];

  // Row 1: form reference with field hint
  const refFrag = document.createDocumentFragment();
  refFrag.appendChild(document.createComment(' field:reference '));
  refFrag.appendChild(formRefLink);
  cells.push([refFrag]);

  // Row 2: action URL with field hint
  const actionFrag = document.createDocumentFragment();
  actionFrag.appendChild(document.createComment(' field:action '));
  actionFrag.appendChild(actionLink);
  cells.push([actionFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
