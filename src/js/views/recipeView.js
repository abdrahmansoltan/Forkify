//-----------import icons as its location is change when Bundling-----------//
// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../img/icons.svg'; // Parcel 2
import { Fraction } from 'fractional'; // library used to convert numbers to fractions ( 0.5 => 1/2 )
import View from './view';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'No recipes found for your query. Please try again!';
  _message = '';

  _generateMarkup() {
    return `<figure class="recipe__fig">
        <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings - 1
            }">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings + 1
            }">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        
          <div class="recipe__user-generated">
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._data.ingredients
              .map(this._generateMarkupIngredient)
              .join('')}
        </div>

        <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search_#icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>`;
  }

  _generateMarkupIngredient(ing) {
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${
        // using fractional library guides from documentation
        ing.quantity ? new Fraction(ing.quantity).toString() : ''
        // we used ternary operator as if value was null => "fractional library" will return NaN
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
  `;
  }

  // pub/sub pattern
  // showing specific recipe based on hashchange event or when page loads
  addHandlerRender(handler) {
    // "hashchange" is an event when clicking on a link so the hash changes
    // "load" is an event so that the recipe shows automatically when loading the page without selecting a recipe again
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  // pub/sub pattern
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // event delegation
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;

      // from here we control the serving number as in the html code below we increase/decrease it by 1 in (data-update-to) attribute
      const { updateTo } = btn.dataset; 

      // note : if you used (+) in the line above to convert it to number it will yield an error as you are trying to convert an (object to a number)

      // (+) to convert to number here
      if (+updateTo > 0) handler(+updateTo);
    });
  }
}

// we export the "instance" and not the "class" as if we exported the class it may create multiple classes which complicate things
export default new RecipeView();
