import { createElement } from "../../../utils/index.js";

export class Button {
    constructor(text, onClick, type = "primary") {
        this._button = createElement('button', { className: 'button-container' });
        this._button.textContent = text;
        this._button.setAttribute('aria-label', text);
        this._button.style = `
                background-color: ${type === "primary" ? 'var(--color-primary)' : 'var(--color-secondary)'};
        `;
        this._button.addEventListener('click', onClick);
    }

    get element() {
        return this._button;
    }

    get text() {
        return this._button.textContent;
    }

    set text(value) {
        this._button.textContent = value;
    }

}
