import AbstractView from './abstract-view.js';
import {SortType} from '../const.js';

const createTripSortTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.values(SortType).map((item) => `<div class="trip-sort__item  trip-sort__item--${item}">
    <input
      id="sort-${item}"
      class="trip-sort__input visually-hidden"
      type="radio"
      name="trip-sort"
      value="${item}"
      ${currentSortType === item ? 'checked' : ''}
      ${SortType.EVENT === item || SortType.OFFERS === item ? 'disabled' : ''}>
    <label class="trip-sort__btn" for="sort-${item}">${item}</label>
  </div>`).join('')}
  </form>`
);

export default class TripSortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createTripSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._callback.sortTypeChange(evt.target.value);
  }
}
