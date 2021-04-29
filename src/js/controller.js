import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';


import 'core-js/stable'; // polyfill async / await
import 'regenerator-runtime/runtime'; // polyfill everything else

// if (module.hot) { // Development only - Parcel/Webpack feature
//   module.hot.accept(); // if page reloads -> the current module state remains without parcel refreshing whole page
// }

const controlRecipes = async function() { // async kw makes a function asynchronous -> async -> try{ await fetch() } catch {}
  try {
    // hash URI -> /#5ed6604591c37cdc054bc886
    const id = window.location.hash.slice(1); // takes the hash uri from url from window global{} without #
    // console.log(id); // 5ed6604591c37cdc054bc90b

    if (!id) return;
    recipeView.renderSpinner(); // run spinner function while fetching data and consuming promises

    // 0) Update results view to mark selected search result w/ active class
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    // debugger; // running debugger on chrome dev tools to find bugs
    bookmarksView.update(model.state.bookmarks); // fix -> loading bookmarks first so theres no undefined
    // loading bookmarks with event handler on window running with a controller function down below

    // 2) Load recipe and store it in model.state.recipe{}
    // ALL ASYNC FUNCTIONS RETURN PROMISES -> AWAIT ALL PROMISES -> HANDLE ALL PROMISES
    await model.loadRecipe(id); // model.loadRecipe(id) doesnt return any value, only manipulates model.state.recipe{}

    // 3) Render recipe -> by passing model.state.recipe{} with fetched data
    recipeView.render(model.state.recipe); // communicate with class instance{} through its own methods
    // render() stores recipe{} insdie #data for the instance{} to use that data

  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
}

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if(!query) return;

    // 2) Get search query
    // async loadSearchResults(query) doesnt return promised value
    await model.loadSearchResults(query); // it just manipulates state.search.results

    // 3) Render results
    resultsView.render(model.getSearchResultsPage()); // page: 1

    // 4) Render pagination buttons
    paginationView.render(model.state.search); // we get access to this._data through View's render
    // this._data is now the entire search results object

  } catch (err) {
    console.log(err)
  }
};

const controlPagination = function(goToPage) {
  // 3) Render NEW results -> render() overwrites previous content with new content w/ clear() then setting values
  resultsView.render(model.getSearchResultsPage(goToPage)); // clear() -> state.search.page = goToPage; loads everything

  // 4) Render NEW pagination buttons
  paginationView.render(model.state.search);
  // this._data is now the entire search results object
}

const controlServings = function(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view - overwrite recipe - re render it
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {
  // 1) Add/remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() { bookmarksView.render(model.state.bookmarks) }

const controlAddRecipe = async function (newRecipe) {
  // Array of arrays w/ entries - before transforming to Object{}
  // console.log(newRecipe); // (12) [Array(2), Array(2), ... ] -> ["title," "TEST"], ["sourceUrl", "TEST"]

  // Object - after transformation from array of entries to object
  // console.log(newRecipe); // {key: "value", key1: "value", ...}
  try {
    // Load spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    // uploadRecipe({}) is an async func that returns promise -> AWAIT ALL PROMISES
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Render success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // CHange ID in URL URI -> history API {} -> .pushState(state, title, uri) -> change URI without page reload
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back() // tip - go to prev page -> MDN window.history

    // Close form window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000); // dont use magic numbers -> use constants from config.js consts

  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();