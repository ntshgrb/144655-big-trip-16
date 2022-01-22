import {render, RenderPosition, replace, remove} from '../utils/render.js';
import PointEditView from '../view/point-edit-view.js';
import PointItemView from '../view/point-item-view.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #changeData = null;
  #changeMode = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT

  // #offersList = null;
  // #destinationsList = null;

  constructor(pointListContainer, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;

    // this.#offersList = offers;
    // this.#destinationsList = destinations;
  }

  init = (point, offers, destinations) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointItemView(point);
    this.#pointEditComponent = new PointEditView(offers, destinations, point);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#pointEditComponent.setClickCloseEditHandler(this.#handleCloseClickClose);
    this.#pointEditComponent.setSubmitFormHandler(this.#handleSubmitForm);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointListContainer, this.#pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToItem();
    }
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replaceItemToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToItem =() => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToItem();
    }
  };

  #handleEditClick = () => {
    this.#replaceItemToForm();
  }

  #handleCloseClickClose = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToItem();
  };

  #handleSubmitForm = (data) => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      data);
    this.#replaceFormToItem();
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  }

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}
