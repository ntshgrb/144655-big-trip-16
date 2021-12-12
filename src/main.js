import {RenderPosition, render, replace} from './utils/render.js';
import TripInfoView from './view/trip-info-view.js';
import SiteMenuView from './view/site-menu-view.js';
import FilterView from './view/filter-view.js';
import TripSortView from './view/trip-sort-view.js';
import TripPointsListView from './view/points-list-view.js';
import NewPointView from './view/new-point-form-view.js';
import PointEditView from './view/point-edit-view.js';
import PointItemView from './view/point-item-view.js';
import NoPointsView from './view/no-points-view.js';

import {generatePoint} from './mock/point.js';

const TRIP_EVENT_COUNT = 3;
const POINT_COUNT = 20;

const points = Array.from({length: POINT_COUNT}, generatePoint);

const renderPoint = (pointListElement, point) => {
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

  render(pointListElement, pointComponent, RenderPosition.BEFOREEND);
};

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const tripFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

render(tripControlsElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(tripFilterElement, new FilterView(), RenderPosition.BEFOREEND);
render(tripEventsElement, new TripSortView(), RenderPosition.BEFOREEND);


if (points.length === 0) {
  render(tripEventsElement, new NoPointsView(), RenderPosition.BEFOREEND);
} else {
  render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);

  const pointListComponent =  new TripPointsListView();
  render(tripEventsElement, pointListComponent, RenderPosition.BEFOREEND);
  render(pointListComponent, new NewPointView(), RenderPosition.BEFOREEND);

  for (let i = 0; i < TRIP_EVENT_COUNT; i++) {
    renderPoint(pointListComponent.element, points[i]);
  }
}
