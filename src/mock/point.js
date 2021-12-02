import {getRandomInteger} from './../utils.js';
import dayjs from 'dayjs';

//Type
const generatePointType = () => {
  const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

  const randomIndex = getRandomInteger(0, types.length - 1);
  return types[randomIndex];
};

//Destination
const generateDestination = () => {
  const destinations = ['Amsterdam', 'Berlin', 'Bruxelles', 'Nantes'];

  const randomIndex = getRandomInteger(0, destinations.length - 1);
  return destinations[randomIndex];
};

//Offers
const generateOffers = () => {
  const randomIndex = getRandomInteger(0, 1);

  if (!randomIndex) {
    return '';
  }

  const OFFERS = [
    {
      type: 'flight',
      offer: {
        title: 'Add luggage',
        price: 30,
      }
    },
    {
      type: 'taxi',
      offer: {
        title: 'Switch to comfort',
        price: 100,
      }
    },
    {
      type: 'ship',
      offer: {
        title: 'Add meal',
        price: 15,
      }
    },
    {
      type: 'bus',
      offer: {
        title: 'Choose seats',
        price: 5,
      }
    },
    {
      type: 'train',
      offer: {
        title: 'Travel by train',
        price: 4,
      }
    },
  ];

  const randomOffer = OFFERS[getRandomInteger(0, OFFERS.length - 1)];

  return randomOffer;
};

//Description
const PLACEHOLDER_TEXT  = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const generateDescription = () => {
  const descriptionsArray = PLACEHOLDER_TEXT.split('. ');
  const randomDescriptionsCount = getRandomInteger(1, 5);
  const pointDescription = [];
  for (let i = 0; i < randomDescriptionsCount; i++) {
    pointDescription[i] = descriptionsArray[getRandomInteger(0, descriptionsArray.length - 1)];
  }
  return pointDescription.join('. ');
};

//Photos
const generatePhotos = () => {
  const randomPhotosCount = getRandomInteger(1, 3);
  const pointPhotos = [];
  for (let i = 0; i <= randomPhotosCount; i++) {
    pointPhotos[i] = `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`;
  }
  return pointPhotos;
};

//Date
const generateDate = () => {
  const maxMinGap = 43320;
  const daysGap = getRandomInteger(-maxMinGap, maxMinGap);
  return dayjs().add(daysGap, 'minute').toDate();
};

const generateDateTo = (initialDate) => {
  const minuteGap = getRandomInteger(1, 1440);
  return dayjs(initialDate).add(minuteGap, 'minute').toDate();
};

//Main
const generatePoint = () => {
  const type = generatePointType();
  const destination = generateDestination();
  const dateFrom = generateDate();
  const dateTo = generateDateTo(dateFrom);

  return {
    type,
    destination,
    offers: generateOffers(),
    information: {
      description: generateDescription(),
      photos: generatePhotos(),
    },
    price: getRandomInteger(10, 600),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    dateFrom,
    dateTo,
  };
};

export {generatePoint};
