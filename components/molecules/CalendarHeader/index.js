import { createElement } from "../../../utils/index.js";
import { Button } from "../../atoms/Button/index.js";

export class CalendarHeader {
  constructor(onPrev, onNext) {
    this.element = createElement('div', { className: 'calendar-header' });

    this.prevBtn = new Button('←', onPrev, 'primary').element;
    this.nextBtn = new Button('→', onNext, 'primary').element;
    this.monthYear = createElement('h2', { id: 'month-year' });

    this.element.appendChild(this.prevBtn);
    this.element.appendChild(this.monthYear);
    this.element.appendChild(this.nextBtn);
  }

  updateMonthYear(text) {
    this.monthYear.textContent = text;
  }

  render() {
    return this.element;
  }
}
