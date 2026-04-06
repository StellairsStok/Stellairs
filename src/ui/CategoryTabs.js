import { CATEGORIES } from '../data/categories.js';

export class CategoryTabs {
  constructor(container) {
    this.container = container;
    this._onChange = null;
    this._activeId = null;
    this._render();
  }

  onChange(callback) {
    this._onChange = callback;
  }

  setActive(categoryId) {
    this._activeId = categoryId;
    const tabs = this.container.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.id === categoryId);
    });
  }

  _render() {
    this.container.innerHTML = '';
    this.container.className = 'category-tabs-container';

    const scrollWrap = document.createElement('div');
    scrollWrap.className = 'category-tabs-scroll';

    CATEGORIES.forEach(cat => {
      const tab = document.createElement('button');
      tab.className = 'category-tab';
      tab.dataset.id = cat.id;
      tab.textContent = cat.labelZh;
      tab.addEventListener('click', () => {
        this.setActive(cat.id);
        this._onChange?.(cat.id);
      });
      scrollWrap.appendChild(tab);
    });

    this.container.appendChild(scrollWrap);
  }
}
