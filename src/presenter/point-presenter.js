import {render, RenderPosition, replace} from '../utils/render.js';
import PointEditView from '../view/point-edit-view.js';
import PointItemView from '../view/point-item-view.js';

export default class PointPresenter {
  #pointListContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;

  constructor(pointListContainer) {
    this.#pointListContainer = pointListContainer;
  }

  init (point) {
    this.#point = point;

    this.#pointComponent = new PointItemView(point);
    this.#pointEditComponent = new PointEditView(point);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointEditComponent.setClickCloseEditHandler(this.#handleCloseClickClose);
    this.#pointEditComponent.setSubmitFormHandler(this.#handleSubmitForm);

    render(this.#pointListContainer, this.#pointComponent, RenderPosition.BEFOREEND);
  }

  #replaceItemToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #replaceFormToItem =() => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToItem();
    }
  };

  #handleEditClick = () => {
    this.#replaceItemToForm();
  }

  #handleCloseClickClose = () => {
    this.#replaceFormToItem();
  };

  #handleSubmitForm = () => {
    this.#replaceFormToItem();
  };
}
