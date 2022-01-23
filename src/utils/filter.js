import {FilterType} from '../const.js';
import {isFutureEvent, isCurrentEvent} from './point.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureEvent(point.dateFrom) || isCurrentEvent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => !isFutureEvent(point.dateFrom) || isCurrentEvent(point.dateFrom, point.dateTo)),
};

export {filter};

