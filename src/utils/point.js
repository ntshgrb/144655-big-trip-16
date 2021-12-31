import dayjs from 'dayjs';

const getDelta =(dateTo, dateFrom) => dayjs(dateTo).diff(dayjs(dateFrom), 'm');

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

const sortPriceDown = (pointA, pointB) => pointA.price - pointB.price;

export {sortDateDown, sortDurationDown, sortPriceDown, getDelta};
