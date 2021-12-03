import {getRandomInteger} from "../utils";

const createTripInfoTemplate = (points) => {
  const destinationCities = [points[1].destination, points[2].destination, points[3].destination];

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${destinationCities[0]} &mdash; ${destinationCities[1]} &mdash; ${destinationCities[2]}</h1>

    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getRandomInteger(100, 3000)}</span>
  </p>
</section>`
};

export {createTripInfoTemplate};
