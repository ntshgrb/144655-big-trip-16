import TripSortView from '../view/trip-sort-view.js';
import TripPointsListView from '../view/points-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render, RenderPosition} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import PointPresenter from './point-presenter.js';
import {SortType} from '../const.js';
import {sortDateDown, sortDurationDown, sortPriceDown} from '../utils/point.js';

const TRIP_EVENT_COUNT = 3;

export default class TripPresenter {
  #tripContainer = null;

  #sortComponent = new TripSortView();
  #noPointsComponent = new NoPointsView();
  #tripPointsListComponent = new TripPointsListView();

  #tripPoints = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }

  init = (tripPoints) => {
    this.#tripPoints = [...tripPoints].sort(sortDateDown);


    if (this.#tripPoints.length === 0) {
      this.#renderNoPoints();
    } else {
      this.#renderSort();
      this.#renderPointsList();
    }
  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DURATION_DOWN:
        this.#tripPoints.sort(sortDurationDown);
        break;
      case SortType.PRICE_DOWN:
        this.#tripPoints.sort(sortPriceDown);
        break;
      default:
        this.#tripPoints.sort(sortDateDown);
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
  }

  #renderSort = () => {
    render(this.#tripContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((point) => point.resetView());
  }

  #renderPointsList = () => {
    render(this.#tripContainer, this.#tripPointsListComponent, RenderPosition.BEFOREEND);
    this.#renderPoints(this.#tripPointsListComponent, this.#tripPoints);
  }

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #renderPoint = (listContainer, point) => {
    const pointPresenter = new PointPresenter(listContainer, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
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
