import {getRandomInteger} from './../utils/common.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {eventsTypes, OFFERS, DESTINATIONS} from '../const.js';

//Type
const generatePointType = () => {
  const randomIndex = getRandomInteger(0, eventsTypes.length - 1);
  return eventsTypes[randomIndex];
};

//Destination
const generateDestination = () => {
  const randomIndex = getRandomInteger(0, DESTINATIONS.length - 1);
  return DESTINATIONS[randomIndex];
};

//Offers
const generateOffers = () => {
  const randomIndex = getRandomInteger(0, 1);

  if (!randomIndex) {
    return '';
  }

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
  const minuteGap = getRandomInteger(1, 2880);
  return dayjs(initialDate).add(minuteGap, 'minute').toDate();
};

//Main
const generatePoint = () => {
  const type = generatePointType();
  const destination = generateDestination();
  const dateFrom = generateDate();
  const dateTo = generateDateTo(dateFrom);

  return {
    id: nanoid(),
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

export {generatePoint, generateDescription, generatePhotos};
