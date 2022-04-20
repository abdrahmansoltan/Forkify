import * as model from './model';
import recipeView from './views/recipeView.js';

import 'core-js/stable'; // to ensure that most browsers support this app
import 'regenerator-runtime/runtime'; // to ensure that most browsers support this app

// const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // getting the id of recipe = hash of the url
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Display rotating spinner until results arrive
    recipeView.renderSpinner();

    // (1) loading the recipe
    await model.loadRecipe(id); // (it's an async function so it'll return a promise so we must await it)
    // now we can use the "state"
    const { recipe } = model.state;
    // (2) Render Recipe
    recipeView.render(recipe);
  } catch (error) {
    alert(error);
  }
};

// showing specific recipe based on hashchange event or when page loads
['hashchange', 'load'].forEach(event => {
  window.addEventListener(event, controlRecipes);
});
