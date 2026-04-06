import { SceneManager } from '../interaction/SceneManager.js';
import { BrainModel } from '../brain/BrainModel.js';
import { BrainRaycaster } from '../interaction/Raycaster.js';
import { CategoryTabs } from './CategoryTabs.js';
import { ColorLegend } from './ColorLegend.js';
import { InfoPanel } from './InfoPanel.js';
import { LoadingScreen } from './LoadingScreen.js';

export class App {
  constructor(root) {
    this.root = root;
    this._build();
  }

  _build() {
    this.root.innerHTML = `
      <header class="app-header">
        <h1 class="app-title">BrainAtlas</h1>
        <span class="app-subtitle">3D 大脑解剖</span>
      </header>
      <div id="category-tabs"></div>
      <div class="viewport" id="viewport"></div>
      <div id="color-legend"></div>
      <div id="info-panel"></div>
    `;

    this.viewportEl = document.getElementById('viewport');

    // Loading screen
    this.loadingScreen = new LoadingScreen(this.viewportEl);

    // Scene
    this.sceneManager = new SceneManager(this.viewportEl);

    // UI components
    this.categoryTabs = new CategoryTabs(document.getElementById('category-tabs'));
    this.colorLegend = new ColorLegend(document.getElementById('color-legend'));
    this.infoPanel = new InfoPanel(document.getElementById('info-panel'));

    // Build brain
    this._initBrain();
  }

  async _initBrain() {
    try {
      this.brainModel = new BrainModel(this.sceneManager.scene);

      await this.brainModel.build((progress) => {
        this.loadingScreen.setProgress(progress);
      });

      // Set up raycaster for interaction
      this.raycaster = new BrainRaycaster(
        this.sceneManager.camera,
        this.sceneManager.renderer,
        this.brainModel
      );

      this.raycaster.onRegionSelected((userData) => {
        this.infoPanel.show(userData);
      });

      this.raycaster.onRegionDeselected(() => {
        this.infoPanel.hide();
      });

      // Category tab switching
      this.categoryTabs.onChange((categoryId) => {
        this.brainModel.switchCategory(categoryId);
        this.colorLegend.update(categoryId);
        this.infoPanel.hide();
        // Stop auto-rotate when user picks a category
        this.sceneManager.controls.autoRotate = true;
      });

      // Default to lobes
      this.categoryTabs.setActive('lobes');
      this.brainModel.switchCategory('lobes');
      this.colorLegend.update('lobes');

      // Hide loading
      this.loadingScreen.hide();

    } catch (err) {
      console.error('Failed to build brain model:', err);
      const loadingText = this.viewportEl.querySelector('.loading-text');
      if (loadingText) {
        loadingText.textContent = '模型构建失败，请刷新重试';
      }
    }
  }

  dispose() {
    this.raycaster?.dispose();
    this.brainModel?.dispose();
    this.sceneManager?.dispose();
  }
}
