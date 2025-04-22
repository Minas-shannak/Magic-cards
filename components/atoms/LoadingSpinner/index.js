import { createElement } from '../../../utils/index.js';

export class LoadingSpinner {
    static instance = null;

    constructor() {
        if (LoadingSpinner.instance) {
            return LoadingSpinner.instance;
        }

        const existingSpinner = document.getElementById('loading-spinner');
        if (existingSpinner) {
            this._spinner = existingSpinner;
        } else {
            this._spinner = createElement('div', { id: 'loading-spinner', className: 'loading-spinner' });
            this._spinner.style.display = 'none';
            document.body.appendChild(this._spinner);
        }

        LoadingSpinner.instance = this;
    }

    show() {
        this._spinner.style.display = 'block';
    }

    hide() {
        this._spinner.style.display = 'none';
    }

    get element() {
        return this._spinner;
    }
}
