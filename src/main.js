import {RenderPosition, render, remove} from './utils/render.js';
import TripInfoView from './view/trip-info-view.js';
import SiteMenuView from './view/site-menu-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import StatsView from './view/stats-view.js';
import {MenuItem, eventsTypes} from './const.js';
import NewEventButton from './view/new-event-button-view.js';
import ApiService from './api-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import TripPresenter from './presenter/trip-presenter.js';

const AUTHORIZATION = 'Basic jf983dfaikd';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const pointsModel = new PointsModel(new ApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new ApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const tripControlsElement = siteHeaderElement.querySelector('.trip-main__trip-controls');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const siteMenuComponent = new SiteMenuView();
const newEventButtonComponent = new NewEventButton();

const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel, newEventButtonComponent, destinationsModel, offersModel);
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
      filterPresenter.destroy();
      tripPresenter.destroy();
      statisticsComponent = new StatsView(pointsModel.points, eventsTypes);
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

// siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();

newEventButtonComponent.element.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
  newEventButtonComponent.disableButton();
});


const getRequiredData = async () => await Promise.all([
  destinationsModel.init(),
  offersModel.init(),
]);

getRequiredData().then(pointsModel.init())
  // .catch((err) => console.log(err))
  .finally(() => {
    render(tripMainElement, new TripInfoView(pointsModel.points), RenderPosition.AFTERBEGIN);
    render(tripControlsNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    render(tripMainElement, newEventButtonComponent, RenderPosition.BEFOREEND);
  });
