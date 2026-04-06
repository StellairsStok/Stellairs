import './style.css';
import { App } from './ui/App.js';

const app = new App(document.getElementById('app'));

// Cleanup on page unload
window.addEventListener('beforeunload', () => app.dispose());
