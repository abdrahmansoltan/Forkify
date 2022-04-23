import * as model from './model';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView';

import 'core-js/stable'; // to ensure that most browsers support this app
import 'regenerator-runtime/runtime'; // to ensure that most browsers support this app

const controlRecipes = async function () {
  try {
    // getting the id of recipe = hash of the url
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Display rotating spinner until results arrive
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // (1) loading the recipe
    await model.loadRecipe(id); // (it's an async function so it'll return a promise so we must await it)
    // now we can use the "state"
    const { recipe } = model.state;
    // (2) Render Recipe
    recipeView.render(recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    // this is an async function so we use "await" and this will allow us to create connection to the "state" in the model
    await model.loadSearchResults(query);

    // 3) Render results => (state.search.results)
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in the state)
  model.updateServings(newServings);

  // Update the recipe view (render it again but just rendering a part not the hole page)
  recipeView.update(model.state.recipe);
};

// pub/sub pattern
const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// this runs at first so that the publisher notify the subscribersw
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);

  // pub/sub pattern
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
recipeView.addHandlerAddBookmark(controlAddBookmark);

init();
