import { Nav } from "../components/molecules/Nav/index.js";
import { HomePage } from "../components/pages/HomePage/index.js";
import { ProfilePage } from "../components/pages/ProfilePage/index.js";
import { AboutUsPage } from "../components/pages/AboutUsPage/index.js";
import { createElement } from "../utils/index.js";

const routes = {
  home: HomePage,
  profile: ProfilePage,
  'about-us': AboutUsPage,
};

export class Router {
  constructor() {
    this.nav = new Nav();
    document.body.appendChild(this.nav.element);

    this.pageContent = document.getElementById('page-content');

    if(!this.pageContent){
      this.pageContent =  createElement('div', { id: 'page-content' })
    }

    document.body.appendChild(this.pageContent);

    window.addEventListener('hashchange', () => this.render());
    window.addEventListener('load', () => this.render());
  }

  get currentPage() {
    return location.hash.replace('#', '') || 'home';
  }

  async render() {
    const pageName = this.currentPage;
    const PageClass = routes[pageName];

    this.pageContent.innerHTML = '';

    if (PageClass) {
      const page = new PageClass();
      await page.init(this.pageContent);
    } else {
      this.pageContent.innerHTML = '<h1>404 - Page Not Found</h1>';
    }

    this.nav.setActiveLink(pageName);
  }
}
