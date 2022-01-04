import {FilterType} from '../const.js';
import {isFutureEvent} from './point.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureEvent(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => !isFutureEvent(point.dateFrom)),
};

export {filter};

