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
      <div class="tabs-wrapper" id="tabs"></div>
      <div class="viewport" id="viewport"></div>
      <div id="legend"></div>
      <div id="info-panel"></div>
    `;

    this.viewportEl = document.getElementById('viewport');
    this.loadingScreen = new LoadingScreen(this.viewportEl);

    // Scene
    this.sceneManager = new SceneManager(this.viewportEl);

    // Tabs
    this.tabs = new CategoryTabs(document.getElementById('tabs'));

    // Legend
    this.legend = new ColorLegend(document.getElementById('legend'));

    // Info panel
    this.infoPanel = new InfoPanel(document.getElementById('info-panel'));

    // Brain model
    this.brainModel = new BrainModel(this.sceneManager.scene);

    // Initialize
    this._init();
  }

  async _init() {
    // Build all brain geometry
    await this.brainModel.build((progress) => {
      this.loadingScreen.setProgress(progress);
    });

    this.loadingScreen.hide();

    // Setup raycaster
    this.raycaster = new BrainRaycaster(
      this.sceneManager.camera,
      this.sceneManager.renderer,
      this.brainModel
    );

    this.raycaster.onRegionSelected((userData) => {
      this.infoPanel.show(userData);
      this.sceneManager.stopAutoRotate();
    });

    this.raycaster.onRegionDeselected(() => {
      this.infoPanel.hide();
    });

    // Tab switching
    this.tabs.onChange((categoryId) => {
      this.brainModel.switchCategory(categoryId);
      this.legend.update(categoryId);
      this.infoPanel.hide();
    });

    // Start with lobes category
    this.tabs.setActive('lobes');
    this.brainModel.switchCategory('lobes');
    this.legend.update('lobes');
  }

  dispose() {
    this.raycaster?.dispose();
    this.brainModel?.dispose();
    this.sceneManager?.dispose();
  }
}
