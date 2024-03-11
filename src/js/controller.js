import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable'; // polyfilling everything else
import 'regenerator-runtime/runtime'; // polyfilling async/await

/* if (module.hot) {
  module.hot.accept();
} */

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1) LOADING RECIPE
    await model.loadRecipe(id);

    // 2) RENDERING RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderMessage();
  }
};

// SEARCH RESULTS //
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // GET SEARCH QUERY
    const query = searchView.getQuery();
    if (!query) return;

    // LOAD SEARCH RESULTS
    await model.loadSearchResults(query);

    // RENDER RESULTS
    resultsView.render(model.getSearchResultsPage());

    // RENDER INITIAL PAGINATION BUTTONS
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // RENDER NEW RESULTS
  resultsView.render(model.getSearchResultsPage(goToPage));

  // RENDER NEW PAGINATION BUTTONS
  paginationView.render(model.state.search);
};

// SUBSCRIBER - PUBLISHER PATTERN //
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
