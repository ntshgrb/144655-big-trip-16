import dayjs from 'dayjs';
import {time} from '../const.js';

const getDelta = (dateTo, dateFrom) => dayjs(dateTo).diff(dayjs(dateFrom), 'm');

const renderDuration = (duration) => {
  const minutes = Math.floor(duration % 60);
  const hours = Math.floor(duration / 60 % 24);
  const days =  Math.floor(duration / 60 / 24);

  if (duration < time.MIN_PER_HOUR) {
    return minutes < 10 ? `0${minutes}M` : `${minutes}M`;
  } if (duration < time.MIN_PER_DAY) {
    return `${hours}H ${minutes}M`;
  }
  return `${days}D ${hours}H ${minutes}M`;
};

const sortDateDown = (pointA, pointB) => pointA.dateFrom - pointB.dateFrom;

const sortDurationDown = (pointA, pointB) => {
  const durationPointA = getDelta(pointA.dateTo, pointA.dateFrom);
  const durationPointB = getDelta(pointB.dateTo, pointB.dateFrom);
  if (durationPointA > durationPointB) {
    return -1;
  }
  if (durationPointA < durationPointB) {
    return 1;
  }
  return 0;
};

const sortPriceDown = (pointA, pointB) => pointB.price - pointA.price ;

const isFutureEvent = (dateFrom) => dateFrom >= new Date();
const isCurrentEvent = (dateFrom, dateTo) => dateFrom < new Date() && dateTo > new Date();

const createSortedArray = (eventsTypesTitles, eventsTypesTotalCosts) => {
  const arrayOfObj = eventsTypesTitles.map( (d, i) => ({label: d, data: eventsTypesTotalCosts[i]}));

  return arrayOfObj.sort((a, b) => b.data - a.data);
};

const sumTotalCostByType = (type, points) => points.filter((point) => point.type === type)
  .reduce((totalPrice, point) => totalPrice + point.price, 0);

const countEventsByType = (type, points) => points.filter((point) => point.type === type).length;

const sumTotalTimeByType = (type, points) => points.filter((point) => point.type === type)
  .reduce( (totatTime, point) => totatTime + getDelta(point.dateTo, point.dateFrom), 0);

export {sortDateDown, sortDurationDown, sortPriceDown, getDelta, renderDuration, isFutureEvent, isCurrentEvent, createSortedArray, sumTotalCostByType, countEventsByType, sumTotalTimeByType};
