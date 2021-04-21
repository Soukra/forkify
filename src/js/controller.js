import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable'; // polyfill async / await
import 'regenerator-runtime/runtime'; // polyfill everything else

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlRecipes = async function() { // async kw makes a function asynchronous -> async -> try{ await fetch() } catch {}
  try {
    // hash URI -> /#5ed6604591c37cdc054bc886
    const id = window.location.hash.slice(1); // takes the hash uri from url from window global{} without #
    console.log(id); // 5ed6604591c37cdc054bc90b

    if (!id) return;
    recipeView.renderSpinner(recipeContainer); // run spinner function while fetching data and consuming promises

    // 1) Load recipe and store it in model.state.recipe{}
      // ALL ASYNC FUNCTIONS RETURN PROMISES -> AWAIT ALL PROMISES -> HANDLE ALL PROMISES
    await model.loadRecipe(id); // model.loadRecipe(id) doesnt return any value, only manipulates model.state.recipe{}

    // 2) Render recipe -> by passing model.state.recipe{} with fetched data
    recipeView.render(model.state.recipe); // communicate with class instance{} through its own methods
    // render() stores recipe{} insdie #data for the instance{} to use that data

  } catch (err) {
    // console.error(err);
    recipeView.renderError();
  }
}

const init = function() {
  recipeView.addHandlerRender(controlRecipes);
}
init();