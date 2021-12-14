import TripSortView from '../view/trip-sort-view.js';
import TripPointsListView from '../view/points-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render, RenderPosition} from '../utils/render.js';
import PointPresenter from './point-presenter.js';

const TRIP_EVENT_COUNT = 3;

export default class TripPresenter {
  #tripContainer = null;

  #sortComponent = new TripSortView();
  #noPointsComponent = new NoPointsView();
  #tripPointsListComponent = new TripPointsListView();

  #tripPoints = [];

  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }

  init = (tripPoints) => {
    this.#tripPoints = [...tripPoints];

    if (this.#tripPoints.length === 0) {
      this.#renderNoPoints();
    } else {
      this.#renderSort();
      this.#renderPointsList();
    }
  }

  #renderSort = () => {
    render(this.#tripContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderPointsList = () => {
    render(this.#tripContainer, this.#tripPointsListComponent, RenderPosition.BEFOREEND);
    this.#renderPoints(this.#tripPointsListComponent, this.#tripPoints);
  }

  #renderPoint = (listContainer, point) => {
    const pointPresenter = new PointPresenter(listContainer);
    pointPresenter.init(point);
  };

  #renderPoints = (listContainer, points) => {
    for (let i = 0; i < TRIP_EVENT_COUNT; i++) {
      this.#renderPoint(listContainer, points[i]);
    }
  }

  #renderNoPoints = () => {
    render(this.#tripContainer, this.#noPointsComponent, RenderPosition.BEFOREEND);
  }
}
