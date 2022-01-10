import AbstractView from './abstract-view.js';
import {MenuItem} from '../const.js';

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.POINTS}">Table</a>
    <a class="trip-tabs__btn" data-menu-item="${MenuItem.STATS}" href="#">Stats</a>
  </nav>`
);

export default class SiteMenuView extends AbstractView {
  get template() {
    return createSiteMenuTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    const menuButtons = this.element.querySelectorAll('.trip-tabs__btn');
    const activeButton = evt.target;

    if (activeButton.classList.contains('trip-tabs__btn--active')) {
      return;
    }

    menuButtons.forEach((item) => item.classList.remove('trip-tabs__btn--active'));
    activeButton.classList.add('trip-tabs__btn--active');

    this._callback.menuClick(evt.target.dataset.menuItem);
  }
}

