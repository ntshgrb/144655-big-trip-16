import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import {OFFERS, DESTINATIONS, eventsTypes} from '../const.js';
import SmartView from './smart-view.js';
import {generateDescription, generatePhotos} from '../mock/point.js';

const BLANK_POINT = {
  type: 'flight',
  destination: 'Bruxelles',
  offers:
  {
    type: 'flight',
    offer: [{
      title: 'Add luggage',
      price: 30,
    },
    {
      title: 'Switch to business',
      price: 150,
    }]
  },
  information: {
    description: 'Cras aliquet varius magna, non porta ligula feugiat eget.',
    photos: ['http://picsum.photos/248/152?r=2'],
  },
  price: 600,
  isFavorite: false,
  dateFrom: '03/12/21 00:00',
  dateTo: '03/12/21 00:00',
};

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

const createEventTypeItems = (type) => {
  const eventsList = eventsTypes
    .map((eventType) => (`<div class="event__type-item">
                                <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${type === eventType ? 'checked' : ''}>
                                <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${(eventType)[0].toUpperCase() + (eventType).slice(1)}</label>
                              </div>`));
  return eventsList.join('');
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
                      ${createEventTypeItems(type)}
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
                  <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}">
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
  #datepicker = new Map();

  constructor(point = BLANK_POINT) {
    super();
    this._data = point;

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createPointEditTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();
    this.#datepicker.get('dateFrom').destroy();
    this.#datepicker.get('dateTo').destroy();
    this.#datepicker.clear();
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

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  #setDatepicker = () => {
    this.#datepicker.set('dateFrom', flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateFrom,
        onChange: this.#dateFromChangeHandler,
      }
    ));
    this.#datepicker.set('dateTo', flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateTo,
        onChange: this.#dateToChangeHandler,
      }
    ));
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('#event-price-1').addEventListener('change', this.#priceChangeHandler);
  }

  reset = (point) => {
    this.updateData(point);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitFormHandler(this._callback.submitForm );
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setClickCloseEditHandler(this._callback.closeEditForm);
    this.#setDatepicker();
  }

  #eventTypeChangeHandler = (evt) => {
    this.updateData({
      type: evt.target.value,
      offers: OFFERS.find((item) => item.type === evt.target.value),
    });
  }

  #destinationChangeHandler = (evt) => {
    const destinationInputElement = this.element.querySelector('#event-destination-1');
    const destinationsListElement = this.element.querySelector('#destination-list-1');
    let optionFound = false;

    for (let i = 0; i < destinationsListElement.options.length; i++) {
      if (destinationInputElement.value === destinationsListElement.options[i].value) {
        optionFound = true;
        break;
      }
    }

    if (optionFound) {
      this.updateData({
        destination: evt.target.value,
        information: {
          description: generateDescription(),
          photos: generatePhotos(),
        }
      });
    } else {
      destinationInputElement.setCustomValidity('Choose a destination from the list');
      destinationInputElement.reportValidity();
    }
  }

  #priceChangeHandler = (evt) => {
    if (!(Number.isInteger(+ evt.target.value))) {
      evt.target.setCustomValidity('Value must be an integer');
      evt.target.reportValidity();
      return;
    }

    this.updateData({
      price: evt.target.value
    });
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateData({
      dateFrom: userDate,
    });
  }

  #dateToChangeHandler = ([userDate]) => {
    this.updateData({
      dateTo: userDate,
    });
  }
}
