import dayjs from 'dayjs';
import {OFFERS, DESTINATIONS} from '../const.js';
import SmartView from './smart-view.js';
import {generateDescription, generatePhotos} from '../mock/point.js';

const createAvailableCitiesList = () => {
  const dataList = DESTINATIONS.map((city) => (
    `<option value="${city}"></option>`
  ));

  return dataList.join('');
};

const createEventOffers = ({offer}) => {
  if (!offer) {
    return '';
  }

  const eventOffers = offer.map( ({ title, price }) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage">
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`)
  );

  const availableOffers = ['<section class="event__section  event__section--offers"><h3 class="event__section-title  event__section-title--offers">Offers</h3><div class="event__available-offers">'].concat(eventOffers, ['</div></section>']);

  return availableOffers.join('');
};

const createEventDestination = (information) => {
  if (!information) {
    return '';
  }

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${information.description ? `<p class="event__destination-description">${information.description}.</p>` : ''}
            ${information.photos ?  `<div class="event__photos-container">
                                      <div class="event__photos-tape">
                                        ${information.photos.map((photo) => (`<img class="event__photo" src="${photo}" alt="Event photo">`))}
                                      </div>
                                    </div>` : ''}
          </section>`;
};

const createEventDetails = (offers, information) => {
  if (!offers && !information) {
    return '';
  }
  return (`<section class="event__details">
            ${createEventOffers(offers)}
            ${createEventDestination(information)}
          </section>`);
};

const createPointEditTemplate = (data) => {

  const {type, destination, offers, information, price, dateFrom, dateTo} = data;

  const eventStartTime = dayjs(dateFrom).format('DD/MM/YY hh:mm');
  const eventEndTime = dayjs(dateTo).format('DD/MM/YY hh:mm');

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>

                      <div class="event__type-item">
                        <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                        <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                      </div>

                      <div class="event__type-item">
                        <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                        <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                      </div>

                      <div class="event__type-item">
                        <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                        <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                      </div>

                      <div class="event__type-item">
                        <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                        <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                      </div>

                      <div class="event__type-item">
                        <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                        <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                      </div>

                      <div class="event__type-item">
                        <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                        <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                      </div>

                      <div class="event__type-item">
                        <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                        <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                      </div>

                      <div class="event__type-item">
                        <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                        <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                      </div>

                      <div class="event__type-item">
                        <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                        <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                      </div>
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
                  <datalist id="destination-list-1">
                    ${createAvailableCitiesList()}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventStartTime}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventEndTime}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Delete</button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>
              ${createEventDetails(offers, information)}
            </form>
          </li>`;
};

export default class PointEditView extends SmartView {
  constructor(point) {
    super();
    this._data = point;

    this.#setInnerHandlers();
  }

  get template() {
    return createPointEditTemplate(this._data);
  }

  setClickCloseEditHandler = (callback) => {
    this._callback.closeEditForm = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickCloseEditHandler);
  }

  #clickCloseEditHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeEditForm();
  }

  setSubmitFormHandler = (callback) => {
    this._callback.submitForm = callback;
    this.element.querySelector('form').addEventListener('submit', this.#submitFormHandler);
  }

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this._callback.submitForm(this._data);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
  }

  reset = (point) => {
    this.updateData(point);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitFormHandler(this._callback.submitForm );
    this.setClickCloseEditHandler(this._callback.closeEditForm);
  }

  #eventTypeChangeHandler = (evt) => {
    this.updateData({
      type: evt.target.value,
      offers: OFFERS.find((item) => item.type === evt.target.value),
    });
  }

  #destinationChangeHandler = (evt) => {
    this.updateData({
      destination: evt.target.value,
      information: {
        description: generateDescription(),
        photos: generatePhotos(),
      }
    });
  }
}
