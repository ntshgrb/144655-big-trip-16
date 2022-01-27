import {RenderPosition, render, remove} from './utils/render.js';
import SiteMenuView from './view/site-menu-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import StatsView from './view/stats-view.js';
import {MenuItem, eventsTypes} from './const.js';
import NewEventButton from './view/new-event-button-view.js';
import ApiService from './api-service.js';
import TripPresenter from './presenter/trip-presenter.js';

const AUTHORIZATION = 'Basic jf983dfaikd';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const pointsModel = new PointsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const tripControlsElement = siteHeaderElement.querySelector('.trip-main__trip-controls');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const siteMenuComponent = new SiteMenuView();
const newEventButtonComponent = new NewEventButton();

const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel, newEventButtonComponent, tripMainElement);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, pointsModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.POINTS:
      remove(statisticsComponent);
      filterPresenter.init();
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      filterPresenter.destroy();
      tripPresenter.destroy();
      statisticsComponent = new StatsView(pointsModel.points, eventsTypes);
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

tripPresenter.init();

newEventButtonComponent.element.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
  newEventButtonComponent.disableButton();
});

pointsModel.init().finally(() => {
  filterPresenter.init();
  render(tripControlsNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
});
