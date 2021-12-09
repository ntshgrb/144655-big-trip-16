import {RenderPosition, render} from './render.js';
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
    pointListElement.replaceChild(pointEditComponent.element, pointComponent.element);
  };

  const replaceFormToItem =() => {
    pointListElement.replaceChild(pointComponent.element, pointEditComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToItem();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceItemToForm();
    document.addEventListener('keydown', onEscKeyDown);

    // ???
    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToItem();
      document.removeEventListener('keydown', onEscKeyDown);
    });
  });

  pointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToItem();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointListElement, pointComponent.element, RenderPosition.BEFOREEND);
};

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const tripFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

render(tripControlsElement, new SiteMenuView().element, RenderPosition.BEFOREEND);
render(tripFilterElement, new FilterView().element, RenderPosition.BEFOREEND);
render(tripEventsElement, new TripSortView().element, RenderPosition.BEFOREEND);


if (points.length === 0) {
  render(tripEventsElement, new NoPointsView().element, RenderPosition.BEFOREEND);
} else {
  render(tripMainElement, new TripInfoView(points).element, RenderPosition.AFTERBEGIN);

  const pointListComponent =  new TripPointsListView();
  render(tripEventsElement, pointListComponent.element, RenderPosition.BEFOREEND);
  render(pointListComponent.element, new NewPointView().element, RenderPosition.BEFOREEND);

  for (let i = 0; i < TRIP_EVENT_COUNT; i++) {
    renderPoint(pointListComponent.element, points[i]);
  }
}
