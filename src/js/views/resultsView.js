import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
// import recipeView from './recipeview';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try again :)';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
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
}

export default new ResultsView();
