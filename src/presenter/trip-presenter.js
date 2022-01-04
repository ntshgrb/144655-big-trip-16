import TripSortView from '../view/trip-sort-view.js';
import TripPointsListView from '../view/points-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render, RenderPosition} from '../utils/render.js';
import PointPresenter from './point-presenter.js';
import {SortType} from '../const.js';
import {sortDateDown, sortDurationDown, sortPriceDown} from '../utils/point.js';


export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;

  #sortComponent = new TripSortView();
  #noPointsComponent = new NoPointsView();
  #tripPointsListComponent = new TripPointsListView();

  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(tripContainer, pointsModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  get points() {
    return this.#pointsModel;
  }

  init = () => {
    if (this.points.length === 0) {
      this.#renderNoPoints();
    } else {
      this.#renderSort();
      this.#renderPointsList();
    }
  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DURATION_DOWN:
        this.points.sort(sortDurationDown);
        break;
      case SortType.PRICE_DOWN:
        this.poinrs.sort(sortPriceDown);
        break;
      default:
        this.points.sort(sortDateDown);
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
    this.#renderPoints(this.#tripPointsListComponent, this.points);
  }

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #renderPoint = (listContainer, point) => {
    const pointPresenter = new PointPresenter(listContainer, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (listContainer, points) => {
    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(listContainer, points[i]);
    }
  }

  #renderNoPoints = () => {
    render(this.#tripContainer, this.#noPointsComponent, RenderPosition.BEFOREEND);
  }
}
