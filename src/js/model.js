export const state = {
  recipe: {},
};

// this function won't return anything it will just update the state
export const loadRecipe = async function (id) {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );

    const data = await res.json(); // get the body of the response in "json-format"

    // in case of error retern the error-message from the server
    if (!res.ok) throw new Error(`${data.message} (${data.status})`);

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
    alert(err);
  }
};
