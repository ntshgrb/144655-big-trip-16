// import {UpdateType}  from '../const.js';
import AbstractObservable from '../utils/abstract-observable.js';

export default class DestinationsModel extends AbstractObservable {
  #apiService = null;
  #destinations = ['fdfds', 'fdsfsd'];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      this.#destinations = await this.#apiService.destinations;
      // console.log(this.#destinations);
    } catch(err) {
      // console.log(err);
    }

    this._notify();
  };
}
