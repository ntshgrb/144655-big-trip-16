import TripSortView from '../view/trip-sort-view.js';
import TripInfoView from '../view/trip-info-view.js';
import TripPointsListView from '../view/points-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import PointPresenter, {State as PointPresenterViewState} from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';
import {SortType, UpdateType, FilterType, UserAction} from '../const.js';
import {sortDateDown, sortDurationDown, sortPriceDown} from '../utils/point.js';
import {filter} from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';


export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #sortComponent = null;
  #tripInfoComponent = null;
  #noPointsComponent = null;
  #tripPointsListComponent = new TripPointsListView();
  #loadingComponent = new LoadingView();

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  #newEventButtonComponent = null;
  #tripMainElement = null;

  constructor(tripContainer, pointsModel, filterModel, newEventButtonComponent, tripMainElement) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newEventButtonComponent = newEventButtonComponent;
    this.#tripMainElement = tripMainElement;

    this.#pointNewPresenter = new PointNewPresenter(
      this.#tripPointsListComponent,
      this.#handleViewAction,
      this.#newEventButtonComponent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortDurationDown);
      case SortType.PRICE:
        return filteredPoints.sort(sortPriceDown);
      default:
        return filteredPoints.sort(sortDateDown);
    }
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init = () => {
    this.#renderPointsList();

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
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(this.#pointsModel.offers, this.#pointsModel.destinations);
  }

  #renderNewEventButtonComponent = () => {
    render(this.#tripMainElement, this.#newEventButtonComponent, RenderPosition.BEFOREEND);
  }

  #renderLoading = () => {
    render(this.#tripContainer, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #renderSort = () => {
    this.#sortComponent = new TripSortView(this.#currentSortType);
    render(this.#tripContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderTripInfo = () => {
    if (!this.#tripInfoComponent) {
      return;
    }
    this.#tripInfoComponent = new TripInfoView(this.points);
    render(this.#tripMainElement, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  #renderPointsList = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;

    this.#renderNewEventButtonComponent();

    if (this.offers.length === 0 || this.destinations.length === 0) {
      this.#newEventButtonComponent.disableButton();
    }

    if (points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderTripInfo();

    render(this.#tripContainer, this.#tripPointsListComponent, RenderPosition.BEFOREEND);
    this.#renderPoints(this.#tripPointsListComponent, points);
  }

  #clearPointsList = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    this.#pointNewPresenter.destroy();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderPoint = (listContainer, point) => {
    const pointPresenter = new PointPresenter(
      listContainer,
      this.#handleViewAction,
      this.#handleModeChange);
    pointPresenter.init(point, this.#pointsModel.offers, this.#pointsModel.destinations);
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

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
        }
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((point) => point.resetView());
  }
}
