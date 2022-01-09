import AbstractView from './abstract-view.js';

const createNewEventButtonTemplate = () => (
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
);

export default class NewEventButton extends AbstractView {
  get template() {
    return createNewEventButtonTemplate();
  }

  disableButton = () => (this.element.disabled = true);

  activateButton = () => (this.element.disabled = false);
}
