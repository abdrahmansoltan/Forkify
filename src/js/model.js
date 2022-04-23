import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1, // which page is displayed in recipes-results section on the left
    resultsPerPage: RES_PER_PAGE,
  },
};

// this function won't return anything it will just update the state
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;

    // update the state
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    throw err;
  }
};

// here we pass a query which is the (search-keyword) like "pizza"
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    // ex : https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);

    // data.data.recipes is an (array of recipes' data)
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

// this isn't an async-function because the data (state) is already here
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  // each page has certain number of results so that we can divide the results so that the page doesn't be too long => this is "pagination"

  const start = (page - 1) * state.search.resultsPerPage; // 0 * 10
  const end = page * state.search.resultsPerPage; // 1 * 10

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // changing the ingredients' quantity will change the serving by this formula :
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings    // ex : (2 * 8 / 4) = 4
  });

  // we do this after the formula so that we can first use the old serving value in the formula
  state.recipe.servings = newServings;
};
