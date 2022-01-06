import AbstractView from './abstract-view.js';
import {FilterType} from '../const.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE] : 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createNoPointsTemplate = (filterType) => {
  const NoPointsTextValue = NoPointsTextType[filterType];

  return (`<p class="trip-events__msg">${NoPointsTextValue}</p>`);
};

export default class NoPointsView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoPointsTemplate(this._data);
  }
}
