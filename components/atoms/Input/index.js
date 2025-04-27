import { createElement } from '../../../utils/index.js';

export class Input {
    constructor({ placeholder = '', type = 'text', id = '', onChange = () => {} }) {
        this.placeholder = placeholder;
        this.type = type;
        this.id = id;
        this.onChange = onChange;
        
        this._element = this._createInputElement();
    }
    
    _createInputElement() {
        const input = createElement('input', {
            type: this.type,
            placeholder: this.placeholder,
            id: this.id
        });
        
        input.addEventListener('input', (e) => {
            this.onChange(e.target.value);
        });
        
        return input;
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