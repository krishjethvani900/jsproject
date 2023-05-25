import icons from 'url:../../img/icons.svg';
import recipeView from './recipeview';

export default class View {
  _errorMessage = 'No recipes found for your query. Please try again :)';
  _message = '';
  _data;

  /**
   * @param {Object || Object[]} data the data to be rendered (e.g recipe)
   * @param {boolean}[render=true] if false, creat markup string of rendering to the DOM
   * @return {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Kanaiya valvi
   * @todo Finish implimantetion
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      this.renderError(this._errorMessage);

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl))
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim('') !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      //Update changed Attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `
       <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = _errorMessage) {
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
      <svg>
      <use href="${icons}#icon-smile"></use>
      </svg>
      </div>
      <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }
}
