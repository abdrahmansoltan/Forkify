import View from './view.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _message = '';

  _generateMarkup() {
    return this._data.map(res => this._generateMarkupPreview(res)).join('');
  }
  _generateMarkupPreview(result) {
    // get the hash that indicate a certain recipe that would change with "hashchange" event
    // slicing to get red of "#"
    const id = window.location.hash.slice(1);

    // the <a> element has href of the hash so when we click on any recipe on the results section, the page's hash will change which will trigger the eventListener function for "hashchange" event
    return `
      <li class="preview">
        <a class="preview__link ${
          result.id === id ? 'preview__link--active' : ''
        }" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
            <div class="preview__user-generated ${result.key ? '' : 'hidden'}">
              <svg>
              <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }
}

export default new ResultsView();
