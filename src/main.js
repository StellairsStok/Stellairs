import './style.css';
import { App } from './ui/App.js';

const app = new App(document.getElementById('app'));

window.addEventListener('beforeunload', () => app.dispose());
