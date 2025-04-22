console.log('About us Page')
import { createElement } from '../../../utils/index.js';

export class AboutUsPage {
  init(container) {
    container.className = 'about-us-page';
    const title = createElement('h1', {}, 'About Us Page');
    container.appendChild(title);
  }
}
