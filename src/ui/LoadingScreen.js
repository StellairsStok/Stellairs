export class LoadingScreen {
  constructor(container) {
    this.container = container;
    this.el = document.createElement('div');
    this.el.className = 'loading-screen';
    this.el.innerHTML = `
      <div class="loading-content">
        <div class="loading-brain">
          <svg viewBox="0 0 64 64" width="64" height="64">
            <ellipse cx="32" cy="30" rx="26" ry="24" fill="none" stroke="#4A90D9" stroke-width="2" opacity="0.6">
              <animate attributeName="stroke-dasharray" values="0 160;80 80;160 0;80 80;0 160" dur="2s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="32" cy="52" rx="8" ry="6" fill="#50C878" opacity="0.5"/>
          </svg>
        </div>
        <div class="loading-text">正在构建大脑模型...</div>
        <div class="loading-bar-track">
          <div class="loading-bar-fill"></div>
        </div>
      </div>
    `;
    this.container.appendChild(this.el);
    this._bar = this.el.querySelector('.loading-bar-fill');
  }

  setProgress(value) {
    this._bar.style.width = `${Math.round(value * 100)}%`;
  }

  hide() {
    this.el.classList.add('fade-out');
    setTimeout(() => {
      this.el.remove();
    }, 400);
  }
}
