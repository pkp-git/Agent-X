// Export as default for dynamic import
export default function getPageSchema() {
  const schema = [];
  const seen = new Set();
  document.querySelectorAll('input, textarea, select, button, a').forEach(el => {
    // Skip button if it's inside a link (to avoid duplicate actionable for same label)
    if (el.tagName.toLowerCase() === 'button' && el.closest('a')) return;

    let type = el.type || el.tagName.toLowerCase();
    let label =
      (el.labels && el.labels[0] && el.labels[0].innerText) ||
      el.getAttribute('aria-label') ||
      el.getAttribute('title') ||
      el.name ||
      el.id ||
      (el.tagName.toLowerCase() === 'button' || el.tagName.toLowerCase() === 'a' ? el.textContent.trim() : '') ||
      el.innerText?.trim() ||
      '';
    let selector = '';
    if (el.id) {
      selector = `#${el.id}`;
    } else if (el.name) {
      selector = `[name='${el.name}']`;
    } else if (el.tagName.toLowerCase() === 'button' || el.tagName.toLowerCase() === 'a') {
      const text = el.textContent.trim();
      if (text) {
        selector = `${el.tagName.toLowerCase()}:contains('${text}')`;
      } else {
        const parent = el.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(child => child.tagName === el.tagName);
          const idx = siblings.indexOf(el) + 1;
          selector = `${el.tagName.toLowerCase()}:nth-of-type(${idx})`;
        }
      }
    }
    let options = null;
    if (el.tagName.toLowerCase() === 'select') {
      options = Array.from(el.options).map(opt => ({
        value: opt.value,
        label: opt.label || opt.text
      }));
    }
    if (type === 'radio' || type === 'checkbox') {
      selector = `[name='${el.name}']`;
    }
    // Deduplicate by type+label+selector
    const key = `${type}|${label}|${selector}`;
    if (label && selector && !seen.has(key)) {
      schema.push({ type, label, selector, options });
      seen.add(key);
    }
  });
  return schema;
}
