import {RenderPosition, render, remove} from './utils/render.js';
import TripInfoView from './view/trip-info-view.js';
import SiteMenuView from './view/site-menu-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import StatsView from './view/stats-view.js';
import {MenuItem, eventsTypes} from './const.js';

import TripPresenter from './presenter/trip-presenter.js';

import {generatePoint} from './mock/point.js';

const POINT_COUNT = 20;

const points = Array.from({length: POINT_COUNT}, generatePoint);

const pointsModel = new PointsModel();
pointsModel.points = points;

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const tripControlsElement = siteHeaderElement.querySelector('.trip-main__trip-controls');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const siteMenuComponent = new SiteMenuView();

render(tripControlsNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);

const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.POINTS:
      remove(statisticsComponent);
      filterPresenter.init();
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      filterPresenter.destroy(); //доделать
      tripPresenter.destroy();
      statisticsComponent = new StatsView(pointsModel.points, eventsTypes);
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
