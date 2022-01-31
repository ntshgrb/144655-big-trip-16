const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const EVENTS_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const Time = {
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

const СitiesCount = {
  ONE_CITY: 1,
  TWO_CITIES: 2,
  THREE_CITIES: 3,
};

export {SortType, EVENTS_TYPES, Time, UpdateType, FilterType, UserAction, MenuItem, СitiesCount};
