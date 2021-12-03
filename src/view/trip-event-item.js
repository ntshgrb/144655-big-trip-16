import dayjs from 'dayjs';

const createOffersListTemplate = (offers) => {
  if (!offers) {
    return '';
  }

  const {offer} = offers;

  return `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    <li class="event__offer">
      <span class="event__offer-title">${offer[0].title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer[0].price}</span>
    </li>
  </ul>`;
};

const createTripEventItemTemplate = (point) => {
  const {type, destination, price, isFavorite, dateFrom, dateTo, offers} = point;

  const dateForUser = (dayjs(dateFrom).format('MMM D')).toUpperCase();
  const dateForattribute = dayjs(dateFrom).format('YYYY-MM-DD');

  const startTimeForUser = dayjs(dateFrom).format('h:mm');
  const startTimeForAttribute = dayjs(dateFrom).format('YYYY-MM-DDThh:mm');

  const endTimeForUser = dayjs(dateTo).format('h:mm');
  const endtTimeForAttribute = dayjs(dateTo).format('YYYY-MM-DDThh:mm');

  const duration = dayjs(dateTo - dateFrom).format('h:m');

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn--active'
    : '';

  const offersList = createOffersListTemplate(offers);

  return  `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateForattribute}">${dateForUser}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startTimeForAttribute}">${startTimeForUser}</time>
            &mdash;
            <time class="event__end-time" datetime="${endtTimeForAttribute}">${endTimeForUser}</time>
          </p>
          <p class="event__duration">${duration}M</p>
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

export {createTripEventItemTemplate};