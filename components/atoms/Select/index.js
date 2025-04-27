import { createElement } from '../../../utils/index.js';

export class Select {
    constructor({ id = '', options = [], onChange = () => {} }) {
        this.id = id;
        this.options = options;
        this.onChange = onChange;
        
        this._element = this._createSelectElement();
    }
    
    _createSelectElement() {
        const select = createElement('select', { id: this.id });
        
        this.options.forEach(option => {
            const optionElement = createElement('option', {
                value: option.value,
                textContent: option.text
            });
            select.appendChild(optionElement);
        });
        
        select.addEventListener('change', (e) => {
            this.onChange(e.target.value);
        });
        
        return select;
    }
    
    get element() {
        return this._element;
    }
    
    get value() {
        return this._element.value;
    }
    
    set value(newValue) {
        this._element.value = newValue;
    }
}