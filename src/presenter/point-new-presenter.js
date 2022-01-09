import PointEditView from '../view/point-edit-view.js';
import {nanoid} from 'nanoid';
import {render, RenderPosition, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class PointNewPresenter {
  #pointListContainer = null;
  #changeData = null;
  #pointEditComponent = null;
  #newEventButtonComponent = null;

  constructor(pointListContainer, changeData, newEventButtonComponent) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#newEventButtonComponent = newEventButtonComponent;
  }

  init = () => {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView();
    this.#pointEditComponent.setSubmitFormHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
    this.#pointEditComponent.setClickCloseEditHandler(this.#handleDeleteClick);

    render(this.#pointListContainer, this.#pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    this.#newEventButtonComponent.activateButton();

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  }

  #handleDeleteClick = () => {
    this.destroy();
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
