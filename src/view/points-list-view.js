import {createElement} from '../render.js';

const createTripEventsListElement = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class TripPointsListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createTripEventsListElement();
  }

  removeElement() {
    this.#element = null;
  }
}
