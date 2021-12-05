import {RenderPosition, renderTemplate, renderElement} from './render.js';
import TripInfoView from './view/trip-info-view.js';
import SiteMenuView from './view/site-menu-view.js';
import FilterView from './view/filter-view.js';
import TripSortView from './view/trip-sort-view.js';
import TripPointsListView from './view/points-list-view.js';
import NewPointView from './view/new-point-form-view.js';
import PointEditView from './view/point-edit-view.js';
import PointItemView from './view/point-item-view.js';

import {generatePoint} from './mock/point.js';

const TRIP_EVENT_COUNT = 4;
const POINT_COUNT = 20;

const points = Array.from({length: POINT_COUNT}, generatePoint);

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const tripFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

renderElement(tripMainElement, new TripInfoView(points).element, RenderPosition.AFTERBEGIN);
renderElement(tripControlsElement, new SiteMenuView().element, RenderPosition.BEFOREEND);
renderElement(tripFilterElement, new FilterView().element, RenderPosition.BEFOREEND);
renderElement(tripEventsElement, new TripSortView().element, RenderPosition.BEFOREEND);
renderElement(tripEventsElement, new TripPointsListView().element, RenderPosition.BEFOREEND);

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

renderElement(tripEventsListElement, new PointEditView(points[0]).element, RenderPosition.BEFOREEND);
renderElement(tripEventsListElement, new NewPointView().element, RenderPosition.BEFOREEND);

for (let i = 1; i < TRIP_EVENT_COUNT; i++) {
  renderElement(tripEventsListElement, new PointItemView(points[i]).element, RenderPosition.BEFOREEND);
}
