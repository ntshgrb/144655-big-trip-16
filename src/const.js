const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const eventsTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const time = {
  MIN_PER_HOUR: 60,
  MIN_PER_DAY: 1440,
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const MenuItem = {
  POINTS: 'POINTS',
  STATS: 'STATS'
};

const citiesCount = {
  ONE_CITY: 1,
  TWO_CITIES: 2,
  THREE_CITIES: 3,
};

export {SortType, eventsTypes, time, UpdateType, FilterType, UserAction, MenuItem, citiesCount};
