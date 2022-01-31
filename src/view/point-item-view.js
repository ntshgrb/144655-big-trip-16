import AbstractView from './abstract-view.js';
import dayjs from 'dayjs';
import {Time} from '../const.js';
import {getDelta} from '../utils/point.js';

const createOffersListTemplate = (offers) => {
  if (offers.length === 0) {
    return '';
  }

  const offersItemsTemplate = offers.map((offer) => (
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`)).join('');

  return `<h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${offersItemsTemplate}
          </ul>`;
};

const createPointItemTemplate = (point) => {
  const {type, destination, price, isFavorite, dateFrom, dateTo, offers} = point;

  const dateForUser = (dayjs(dateFrom).format('MMM D')).toUpperCase();
  const dateForattribute = dayjs(dateFrom).format('YYYY-MM-DD');

  const startTimeForUser = dayjs(dateFrom).format('HH:mm');
  const startTimeForAttribute = dayjs(dateFrom).format('YYYY-MM-DDThh:mm');

  const endTimeForUser = dayjs(dateTo).format('HH:mm');
  const endtTimeForAttribute = dayjs(dateTo).format('YYYY-MM-DDThh:mm');

  const pointDuration = getDelta(dateTo, dateFrom);

  const renderDuration = (duration) => {
    const formatValue = (value) => value < 10 ? `0${value}` : value;

    const minutes = Math.floor(duration % 60);
    const hours = Math.floor(duration / 60 % 24);
    const days =  Math.floor(duration / 60 / 24);

    if (duration < Time.MIN_PER_HOUR) {
      return `${formatValue(minutes)}M`;

    } if (duration < Time.MIN_PER_DAY) {
      return `${formatValue(hours)}H ${formatValue(minutes)}M`;
    }
    return `${formatValue(days)}D ${formatValue(hours)}H ${formatValue(minutes)}M`;
  };

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn--active'
    : '';

  const offersList = createOffersListTemplate(offers);

  return  `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${dateForattribute}">${dateForUser}</time>
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${type} ${destination}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${startTimeForAttribute}">${startTimeForUser}</time>
                  &mdash;
                  <time class="event__end-time" datetime="${endtTimeForAttribute}">${endTimeForUser}</time>
                </p>
                <p class="event__duration">${renderDuration(pointDuration)}</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${price}</span>
              </p>
              ${offersList}
              <button class="event__favorite-btn ${favoriteClassName}" type="button">
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                </svg>
              </button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>`;
};

export default class PointItemView extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return createPointItemTemplate(this.#point);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
