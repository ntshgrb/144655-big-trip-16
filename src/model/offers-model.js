// import {UpdateType}  from '../const.js';
import AbstractObservable from '../utils/abstract-observable.js';

export default class OffersModel extends AbstractObservable {
  #apiService = null;
  #offers = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get offers() {
    return this.#offers;
  }

  init = async () => {
    try {
      this.#offers = await this.#apiService.offers;
    } catch(err) {
      this.#offers = [];
    }

    this._notify();//???
  };
}
