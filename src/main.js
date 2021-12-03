import {RenderPosition, renderTemplate} from './render.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createFilterTemplate} from './view/filter-view.js';
import {createTripSortTemplate} from './view/trip-sort-view.js';
import {createTripEventsListElement} from './view/trip-events-list-view.js';
import {createNewPointTemplate} from './view/new-point-form-view.js';
import {createPointEditTemplate} from './view/point-edit-view.js';
import {createTripEventItemTemplate} from './view/trip-event-item';

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

renderTemplate(tripMainElement, createTripInfoTemplate(points), RenderPosition.AFTERBEGIN);
renderTemplate(tripControlsElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(tripFilterElement, createFilterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(tripEventsElement, createTripSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(tripEventsElement, createTripEventsListElement(), RenderPosition.BEFOREEND);

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

renderTemplate(tripEventsListElement, createPointEditTemplate(points[0]), RenderPosition.BEFOREEND);
renderTemplate(tripEventsListElement, createNewPointTemplate(), RenderPosition.BEFOREEND);

for (let i = 1; i < TRIP_EVENT_COUNT; i++) {
  renderTemplate(tripEventsListElement, createTripEventItemTemplate(points[i]), RenderPosition.BEFOREEND);
}
