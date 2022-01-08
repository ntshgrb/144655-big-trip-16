const SortType = {
  DEFAULT: 'default',
  DURATION_DOWN: 'duration-down',
  PRICE_DOWN: 'price-down',
};

const eventsTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const time = {
  MIN_PER_HOUR: 60,
  MIN_PER_DAY: 1440,
};

const OFFERS = [
  {
    type: 'flight',
    offer: [{
      title: 'Add luggage',
      price: 30,
    },
    {
      title: 'Switch to business',
      price: 150,
    }]
  },
  {
    type: 'taxi',
    offer: [{
      title: 'Switch to comfort',
      price: 100,
    }]
  },
  {
    type: 'ship',
    offer: [{
      title: 'Add meal',
      price: 15,
    }]
  },
  {
    type: 'bus',
    offer: [{
      title: 'Choose seats',
      price: 5,
    }]
  },
  {
    type: 'train',
    offer: [{
      title: 'Travel by train',
      price: 4,
    },
    {
      title: 'Rent a movie',
      price: 5,
    },]
  },
  {
    type: 'drive',
    offer: [{
      title: 'Music',
      price: 400,
    },
    {
      title: 'Window',
      price: 5,
    },]
  },
  {
    type: 'check-in',
    offer: [{
      title: 'Hot water',
      price: 400,
    },]
  },
  {
    type: 'sightseeing',
    offer: [{
      title: 'Boots',
      price: 400,
    },]
  },
  {
    type: 'restaurant',
    offer: [{
      title: 'Food',
      price: 1,
    },]
  },
];

const DESTINATIONS = ['Amsterdam', 'Berlin', 'Bruxelles', 'Nantes'];

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
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

export {SortType, eventsTypes, time, OFFERS, DESTINATIONS, UpdateType, FilterType, UserAction, MenuItem};
