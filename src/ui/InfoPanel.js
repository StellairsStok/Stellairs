import { REGIONS } from '../data/regions.js';
import { CATEGORIES } from '../data/categories.js';

export class InfoPanel {
  constructor(container) {
    this.container = container;
    this.container.className = 'info-panel';
    this._visible = false;
    this._render(null);
  }

  show(userData) {
    if (!userData) return this.hide();

    // Find region by matching colorKey and categoryId
    const region = REGIONS.find(r =>
      r.categoryId === userData.categoryId && r.colorKey === userData.colorKey
    );

    if (!region) return this.hide();

    const category = CATEGORIES.find(c => c.id === region.categoryId);
    const color = category?.palette[region.colorKey] || '#666';

    this._visible = true;
    this._render(region, color);
  }

  hide() {
    this._visible = false;
    this.container.classList.remove('visible');
  }

  _render(region, color) {
    if (!region) {
      this.container.classList.remove('visible');
      return;
    }

    this.container.innerHTML = `
      <div class="info-handle"></div>
      <div class="info-header">
        <span class="info-color-dot" style="background:${color}"></span>
        <div class="info-titles">
          <h3 class="info-name-zh">${region.nameZh}</h3>
          <span class="info-name-en">${region.nameEn}</span>
        </div>
      </div>
      <p class="info-description">${region.descZh}</p>
    `;

    // Trigger reflow then add visible class for animation
    requestAnimationFrame(() => {
      this.container.classList.add('visible');
    });
  }
}
