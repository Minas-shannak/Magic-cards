import { CardList } from '../../organisms/CardList/index.js';
import { Button } from '../../atoms/Button/index.js';
import { INITIAL_COUNTER, CARD_TEXT } from '../../../constants/index.js';
import { Counter, cardStorage, createElement } from '../../../utils/index.js';

export class HomePage {
    constructor() {
        this.counter = new Counter(INITIAL_COUNTER);
        this.cardList = new CardList(this.counter);
    }

    async init(pageContent) {
        await this.cardList.loadCards();
        this.draw(pageContent);
    }

    draw(existingPageContent) {
        const counterWrapper = createElement('div', { className: 'counter-wrapper' });

        const counterBtnContainer = createElement('div', { className: 'counter-btn-container' });

        const selectAllButton = new Button(CARD_TEXT.SELECT_ALL, () => this.cardList.selectAll());
        const deselectAllButton = new Button(
            CARD_TEXT.DESELECT_ALL,
            () => this.handleDeselectAll(),
            'secondary'
        );
        counterBtnContainer.append(selectAllButton.element, deselectAllButton.element);
        counterWrapper.appendChild(this.counter.element);
        counterWrapper.appendChild(counterBtnContainer);

        existingPageContent.append(counterWrapper);
        existingPageContent.append(this.cardList.cardsWrapper);

        return existingPageContent;
    }

    handleDeselectAll() {
        this.cardList.deselectAll();
        this.counter.reset();
        cardStorage.save([]);
    }
}
