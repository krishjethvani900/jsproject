import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
// import recipeView from './recipeview';

class booksMarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No Bookmarks yet. Find a nice recipe and bookmark it:)';
  _message = '';

  addHandlerRender(hendler) {
    window.addEventListener('load', hendler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
  renderError(message) {
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
}

export default new booksMarkView();
