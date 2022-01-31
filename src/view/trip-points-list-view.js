import AbstractView from './abstract-view.js';

const createTripEventsListElement = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class TripPointsListView extends AbstractView {
  get template() {
    return createTripEventsListElement();
  }
}
