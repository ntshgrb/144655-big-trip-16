import TripSortView from '../view/trip-sort-view.js';
import TripPointsListView from '../view/points-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';
import {SortType, UpdateType, FilterType, UserAction} from '../const.js';
import {sortDateDown, sortDurationDown, sortPriceDown} from '../utils/point.js';
import {filter} from '../utils/filter.js';


export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #sortComponent = null;
  #noPointsComponent = null;
  #tripPointsListComponent = new TripPointsListView();

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;

  constructor(tripContainer, pointsModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#tripPointsListComponent, this.#handleViewAction);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DURATION_DOWN:
        return filteredPoints.sort(sortDurationDown);
      case SortType.PRICE_DOWN:
        return filteredPoints.sort(sortPriceDown);
      default:
        return filteredPoints.sort(sortDateDown);
    }
  }

  init = () => {
    if (this.points.length === 0) {
      this.#renderNoPoints();
    } else {
      this.#renderPointsList();
    }

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  destroy = () => {
    this.#clearPointsList({resetSortType: true});

    remove(this.#sortComponent);
    remove(this.#tripPointsListComponent);

    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  createPoint = () => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointsList();
        this.#renderPointsList();
        break;
      case UpdateType.MAJOR:
        this.#clearPointsList({resetSortType: true});
        this.#renderPointsList();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointsList();
    this.#renderPointsList();
  }

  #renderSort = () => {
    this.#sortComponent = new TripSortView();
    render(this.#tripContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((point) => point.resetView());
  }

  #renderPointsList = () => {
    const points = this.points;

    if (points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();

    render(this.#tripContainer, this.#tripPointsListComponent, RenderPosition.BEFOREEND);
    this.#renderPoints(this.#tripPointsListComponent, points);
  }

  #clearPointsList = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    this.#pointNewPresenter.destroy();

    remove(this.#sortComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderPoint = (listContainer, point) => {
    const pointPresenter = new PointPresenter(listContainer, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (listContainer, points) => {
    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(listContainer, points[i]);
    }
  }

  #renderNoPoints = () => {
    this.#noPointsComponent = new NoPointsView(this.#filterType);
    render(this.#tripContainer, this.#noPointsComponent, RenderPosition.BEFOREEND);
  }
}
