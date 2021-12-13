import TripSortView from '../view/trip-sort-view.js';
import TripPointsListView from '../view/points-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointItemView from '../view/point-item-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render, RenderPosition, replace} from '../utils/render.js';

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
    const pointComponent = new PointItemView(point);
    const pointEditComponent = new PointEditView(point);

    const replaceItemToForm = () => {
      replace(pointEditComponent, pointComponent);
    };

    const replaceFormToItem =() => {
      replace(pointComponent, pointEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToItem();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replaceItemToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setClickCloseEditHandler(() => {
      replaceFormToItem();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setSubmitFormHandler(() => {
      replaceFormToItem();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(listContainer, pointComponent, RenderPosition.BEFOREEND);
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
