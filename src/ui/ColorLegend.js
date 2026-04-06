import { CATEGORIES } from '../data/categories.js';
import { REGIONS } from '../data/regions.js';

export class ColorLegend {
  constructor(container) {
    this.container = container;
    this.container.className = 'color-legend';
    this._collapsed = false;
    this._render(null);
  }

  update(categoryId) {
    this._render(categoryId);
  }

  _render(categoryId) {
    this.container.innerHTML = '';

    if (!categoryId) {
      this.container.style.display = 'none';
      return;
    }
    this.container.style.display = '';

    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    // Header with collapse toggle
    const header = document.createElement('div');
    header.className = 'legend-header';
    header.innerHTML = `
      <span class="legend-title">${category.labelZh}</span>
      <button class="legend-toggle">${this._collapsed ? '+' : '−'}</button>
    `;
    header.querySelector('.legend-toggle').addEventListener('click', (e) => {
      e.stopPropagation();
      this._collapsed = !this._collapsed;
      this._render(categoryId);
    });
    this.container.appendChild(header);

    if (this._collapsed) return;

    // Legend items
    const list = document.createElement('div');
    list.className = 'legend-list';

    const regions = REGIONS.filter(r => r.categoryId === categoryId);
    // Deduplicate by colorKey
    const seen = new Set();
    for (const region of regions) {
      if (seen.has(region.colorKey)) continue;
      seen.add(region.colorKey);

      const color = category.palette[region.colorKey];
      if (!color) continue;

      const item = document.createElement('div');
      item.className = 'legend-item';
      item.innerHTML = `
        <span class="legend-swatch" style="background:${color}"></span>
        <span class="legend-label">${region.nameZh}</span>
      `;
      list.appendChild(item);
    }

    this.container.appendChild(list);
  }
}
