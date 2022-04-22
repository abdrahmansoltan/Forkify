import icons from 'url:../../img/icons.svg'; // Parcel 2
/*
Notes: 
- for each view subclass :
  - there's different [(parentElement) and (errorMessage)] private-properties
  - there is a different (generateMarkup()) private-method
*/

// here we export the class itself as we arn't going to create instancses from it
export default class View {
  _data;

  render(data) {
    // Gaurd claus : if (no data) or (data is an empty array) => render error message from error-function
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // get the data and make it belong to the (view-class) so that we can use it outside of this function
    this._data = data;
    
    const markup = this._generateMarkup();
    // 1- empty the content of the recipe container
    this._clear();
    // 2- display markup
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
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
        </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // default error message if none was passed as a message
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // success message
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
}
