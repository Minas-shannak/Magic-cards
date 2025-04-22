import { Button } from '../../atoms/Button/index.js';
import { cardStorage, createElement } from '../../../utils/index.js';
import { CARD_TEXT, FALLBACK_IMAGE } from '../../../constants/index.js';

export class Card {
    constructor(data, counter) {
        this.artist = data.artist;
        this.button = null;
        this.counter = counter;
        this.id = data.id;
        this.imageUrl = data.imageUrl || FALLBACK_IMAGE;
        this.isSelected = false;
        this.manaCost = data.manaCost;
        this.name = data.name;
        this.power = data.power;
        this.rarity = data.rarity;
        this.setName = data.setName;
        this.toughness = data.toughness;
        this.type = data.type;
        this._wrapper = this.draw();
        this._wrapper.dataset.id = this.id;

        const savedSelectedIds = cardStorage.load();
        if (savedSelectedIds.includes(this.id)) {
            this.isSelected = true;
            this.updateCardVisualState();
            this.counter.increment();
        }
    }

    draw() {
        const _wrapper = createElement('div', { className: 'wrapper'});

        const img = createElement('img', {className: 'card-image'});
        img.src = this.imageUrl || FALLBACK_IMAGE;
        img.loading = "lazy";

        const content = createElement('div', { className: 'card-content'});

        const title = createElement('h3');
        title.textContent = this.name;

        const details = createElement('div', { className: 'card-details'});
        details.style.display = 'none';

        details.innerHTML = `
            <p><span class="card-details-title">Type:</span> ${this.type}</p>
            <p><span class="card-details-title">Rarity: </span> ${this.rarity}</p>
            <p><span class="card-details-title">Set:</span> ${this.setName}</p>
            <p><span class="card-details-title">Artist: </span> ${this.artist}</p>
        `;

        const manaCost = createElement('p', {}, `Mana Cost: ${this.manaCost || 'N/A'}`);
        const powerToughness = createElement('p', {}, `P/T: ${this.power || 'N/A'} / ${this.toughness || 'N/A'}`);
        const showMoreButton = new Button(CARD_TEXT.SHOW_MORE, () => {
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
            showMoreButton.text = details.style.display === 'none' ? CARD_TEXT.SHOW_MORE : CARD_TEXT.SHOW_LESS;
        }, "secondary");

        const selectButton = new Button(CARD_TEXT.SELECT, () => this.handleSelectDeselectCardClick());
        content.append(title, manaCost, powerToughness, selectButton.element, showMoreButton.element, details);

        _wrapper.append(img, content);

        this.button = selectButton;
        return _wrapper;
    }

    toggleSelection() {
        this.isSelected = !this.isSelected;
        this.updateCardVisualState();

        const selectedIds = cardStorage.load();
        if (this.isSelected) {
            this.counter.increment();
            if (!selectedIds.includes(this.id)) {
                selectedIds.push(this.id);
            }
        } else {
            this.counter.decrement();
            const index = selectedIds.indexOf(this.id);
            if (index !== -1) selectedIds.splice(index, 1);
        }
        cardStorage.save(selectedIds);
    }

    handleSelectDeselectCardClick (){
        this.toggleSelection();
    }

    updateCardVisualState() {
        this._wrapper.style.backgroundColor = this.isSelected
            ? 'var(--color-white-green)'
            : 'var(--color-white)';
        this.button.text = this.isSelected
            ? CARD_TEXT.DE_SELECT
            : CARD_TEXT.SELECTED;
    }

    get element () {
        return this._wrapper
    }
}
