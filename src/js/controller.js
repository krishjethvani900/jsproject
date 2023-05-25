import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeview';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const constrolRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 0) Update ResultsView to mark selected serch result
    resultsView.update(model.getSerchResultsPage());

    // 3) Updating bookmarks View
    bookmarkView.update(model.state.bookmark);

    // 1) loading recipe
    await model.loadRecipe(id);

    // 2) Randering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(`${err} 🎆🎆🎆🎆`);
  }
};
const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSerchResults(query);

    // 3) Render
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSerchResultsPage());

    // 4) Render initioal pagination Buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    // resultsView.renderError(`${err} 🎆🎆🎆🎆`);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render new results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSerchResultsPage(goToPage));

  // 4) Render initioal New pagination Buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Upsate the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddbookmark = function () {
  // 1) Add/Remove Bookmark
  if (!model.state.recipe.bookmark) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  bookmarkView.render(model.state.bookmark);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  // Shoe loding spiner
  addRecipeView.renderSpinner();
  try {
    //
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarkView.render(model.state.bookmark);

    // Change Id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close from window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderMessage(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(constrolRecipes);
  searchView.addHandlerSearch(controlSearchResult);
  recipeView.addHandlerAddBookmark(controlAddbookmark);
  recipeView.addHandlerUpdateServings(controlServings);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHaandlerUpload(controlAddRecipe);
};
init();
