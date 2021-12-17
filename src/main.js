import {RenderPosition, render} from './utils/render.js';
import TripInfoView from './view/trip-info-view.js';
import SiteMenuView from './view/site-menu-view.js';
import FilterView from './view/filter-view.js';

import TripPresenter from './presenter/trip-presenter.js';

import {generatePoint} from './mock/point.js';

const POINT_COUNT = 20;

const points = Array.from({length: POINT_COUNT}, generatePoint);

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const tripFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

render(tripControlsElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(tripFilterElement, new FilterView(), RenderPosition.BEFOREEND);

render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);

const tripPresenter = new TripPresenter(tripEventsElement);
tripPresenter.init(points);
