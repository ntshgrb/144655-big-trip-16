import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import {EVENTS_TYPES} from '../const.js';
import SmartView from './smart-view.js';

const BLANK_POINT = {
  type: 'flight',
  destination: '',
  offers: [],
  isFavorite: false,
  dateFrom: '',
  dateTo: '',
};

const createAvailableCitiesList = (destinations) => {
  const dataList = destinations.map((city) => (
    `<option value="${city.name}"></option>`
  ));

  return dataList.join('');
};

const createEventOffers = (type, pointOffers, offersList, isDisabled) => {
  const currentOffersList = offersList.find((offer) => offer.type === type);

  if (currentOffersList.offers.length === 0) {
    return '';
  }

  const isSelectedOffer = (id) => pointOffers.some((pointOffer) => pointOffer.id === id);

  const eventOffers = currentOffersList.offers.map( ({id, title, price}) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}${id}" type="checkbox" name="event-offer-${type}${id}" ${isSelectedOffer(id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${type}${id}">
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
                                        ${information.photos.map((photo) => (`<img class="event__photo" src="${photo.src}" alt="${photo.description}">`))}
                                      </div>
                                    </div>` : ''}
          </section>`;
};

const createEventDetails = (type, offers, information, offersList, isDisabled) => {
  if (!offers && !information) {
    return '';
  }

  return (`<section class="event__details">
            ${createEventOffers(type, offers, offersList, isDisabled)}
            ${createEventDestination(information)}
          </section>`);
};

const createEventTypeItems = (type, isDisabled) => {
  const eventsList = EVENTS_TYPES
    .map((eventType) => (`<div class="event__type-item">
                                <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${type === eventType ? 'checked="true"' : ''} ${isDisabled ? 'disabled' : ''}>
                                <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${(eventType)[0].toUpperCase() + (eventType).slice(1)}</label>
                              </div>`));
  return eventsList.join('');
};

const createPointEditTemplate = (data, destinations, offersList) => {

  const {type, destination, offers, information, price, dateFrom, dateTo, isDisabled, isSaving, isDeleting,} = data;


  const eventStartTime = dateFrom ? dayjs(dateFrom).format('DD/MM/YY hh:mm') : '';
  const eventEndTime = dateTo ? dayjs(dateTo).format('DD/MM/YY hh:mm') : '';

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${createEventTypeItems(type, isDisabled)}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1" ${isDisabled ? 'disabled' : ''} required>
                  <datalist id="destination-list-1">
                    ${createAvailableCitiesList(destinations)}
                  </datalist>
                </div>
                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventStartTime}" ${isDisabled ? 'disabled' : ''}>
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventEndTime}" ${isDisabled ? 'disabled' : ''}>
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price ? price : ''}" ${isDisabled ? 'disabled' : ''} required>
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
                <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>
              ${createEventDetails(type, offers, information, offersList)}
            </form>
          </li>`;
};

export default class PointEditView extends SmartView {
  #datepicker = new Map();

  constructor(offers, destinations, point = BLANK_POINT) {
    super();
    this._data = PointEditView.parsePointToData(point);
    this._offers = offers;
    this._destinations = destinations;

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createPointEditTemplate(this._data, this._destinations, this._offers);
  }

  removeElement = () => {
    super.removeElement();
    this.#datepicker.get('dateFrom').destroy();
    this.#datepicker.get('dateTo').destroy();
    this.#datepicker.clear();
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

  setClickCloseEditHandler = (callback) => {
    this._callback.closeEditForm = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickCloseEditHandler);
  }

  setSubmitFormHandler = (callback) => {
    this._callback.submitForm = callback;
    this.element.querySelector('form').addEventListener('submit', this.#submitFormHandler);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  }

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this._callback.submitForm(PointEditView.parseDataToPoint(this._data));
  }

  #setDatepicker = () => {
    this.#datepicker.set('dateFrom', flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        maxDate: this._data.dateTo,
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
        minDate: this._data.dateFrom,
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
    if(this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerChangeHandler);
    }
  }

  #clickCloseEditHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeEditForm();
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PointEditView.parseDataToPoint(this._data));
  }

  #eventTypeChangeHandler = (evt) => {
    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }

  #destinationChangeHandler = (evt) => {
    const destinationInputElement = this.element.querySelector('#event-destination-1');
    const destinationsListElement = this.element.querySelector('#destination-list-1');
    let optionFound = false;

    for (const option of destinationsListElement.options) {
      if (destinationInputElement.value === option.value) {
        optionFound = true;
        break;
      }
    }

    const getNewDestination = () => this._destinations.find((item) => item.name === destinationInputElement.value);
    const newDestination = getNewDestination();

    if (optionFound) {
      this.updateData({
        destination: evt.target.value,
        information: {
          description: newDestination.description,
          photos: newDestination.pictures,
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

    if (evt.target.value < 0) {
      evt.target.setCustomValidity('Value must be a positive integer');
      evt.target.reportValidity();
      return;
    }

    this.updateData({
      price: evt.target.value
    });
  }

  #offerChangeHandler = (evt) => {
    const currentOffersList = this._offers.find((offer) => offer.type === this._data.type);
    const targetOfferTitle = evt.target.nextElementSibling.querySelector('.event__offer-title').textContent;
    const selectedOffer = currentOffersList.offers.find((offer) => offer.title === targetOfferTitle);

    if (evt.target.checked) {
      this._data.offers.push(selectedOffer);
    } else {
      const selectedOfferIndex = this._data.offers.findIndex((offer) => offer.title === selectedOffer.title);

      this._data.offers = [
        ...this._data.offers.slice(0, selectedOfferIndex),
        ...this._data.offers.slice(selectedOfferIndex + 1),
      ];
    }
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

  static parsePointToData = (point) => ({...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseDataToPoint = (data) => {
    const point = {...data};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
