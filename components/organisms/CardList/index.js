import { Card } from '../../molecules/Card/index.js';
import { cardStorage, createElement } from '../../../utils/index.js';
import { API_URL, DEFAULT_CARD_FETCH_SIZE } from '../../../constants/index.js';
import { LoadingSpinner } from '../../atoms/LoadingSpinner/index.js';

export class CardList {
    constructor(counter) {
        this.cards = [];
        this.counter = counter;
        this.spinner = new LoadingSpinner();
        this._cardsWrapper = createElement('div', { id: 'card-container', className: 'grid-container' });
    }

    async loadCards() {
        this.spinner.show();

        const response = await fetch(API_URL);
        const data = await response.json();
        this.cards = data.cards.slice(0, DEFAULT_CARD_FETCH_SIZE).map(card => new Card(card, this.counter));

        this.renderCards();

        this.spinner.hide();
    }

    renderCards() {
        this._cardsWrapper.innerHTML = '';

        this.cards.forEach(card => {
            this._cardsWrapper.appendChild(card.element);
        });
    }

    selectAll() {
        const selectedIds = cardStorage.load();

        this.cards.forEach(card => {
            if (!card.isSelected) {
                card.toggleSelection();
            }
            if (!selectedIds.includes(card.id)) {
                selectedIds.push(card.id);
            }
        });

        cardStorage.save(selectedIds);
    }

    deselectAll() {
        this.cards.forEach(card => {
            if (card.isSelected) {
                card.toggleSelection();
            }
        });
        cardStorage.save([]);
    }

    get cardsWrapper() {
        return this._cardsWrapper;
    }
}
