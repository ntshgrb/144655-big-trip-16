import {sortDateDown} from '../utils/point.js';
import AbstractView from './abstract-view.js';
import {СitiesCount} from '../const.js';
import dayjs from 'dayjs';

const createCitiesList = (points) => {
  const pointsCount = points.length;

  switch (pointsCount) {
    case СitiesCount.ONE_CITY:
      return `${points[0].destination}`;
    case СitiesCount.TWO_CITIES:
      return `${points[0].destination}&mdash;${points[1].destination}`;
    case СitiesCount.THREE_CITIES:
      return `${points[0].destination}&mdash;${points[1].destination}&mdash;${points[2].destination}`;
    default:
      return `${points[0].destination}&mdash;...&mdash;${points[points.length - 1].destination}`;
  }
};

const createTripInfoTemplate = (points) => {
  if (points.length === 0 || points === null) {
    return '';
  }

  const arrangedPoints = points.sort(sortDateDown);

  const totalPrice = arrangedPoints
    .reduce( (previousValue, item) =>  previousValue + item.price + item.offers
      .reduce( (sum, offer) => sum + offer.price, 0), 0);

  const tripStartDate = dayjs(arrangedPoints[0].dateFrom).format('MMM DD');
  const tripEndDate = dayjs(arrangedPoints[arrangedPoints.length - 1].dateTo).format('DD MMM');

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${createCitiesList(points)}</h1>
    <p class="trip-info__dates">${tripStartDate}&nbsp;&mdash;&nbsp;${tripEndDate}</p>
  </div>
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>
</section>`;
};

export default class TripInfoView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createTripInfoTemplate(this.#points);
  }
}
