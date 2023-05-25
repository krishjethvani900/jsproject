import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
export const state = {
  recipe: {},
  page: 1,
  search: {
    query: '',
    results: [],
    resultsParPage: RES_PER_PAGE,
  },
  bookmark: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmark.some(bookmark => bookmark.id === id))
      state.recipe.bookmark = true;
    else state.recipe.bookmark = false;
    // console.log(state.recipe);
  } catch (err) {
    // console.error(`${err} 🎆🎆🎆🎆`);
    throw err;
  }
};

export const loadSerchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // console.log(state.search.results);
  } catch (err) {
    console.error(`${err} 🎆🎆🎆🎆`);
    throw err;
  }
};

export const getSerchResultsPage = function (page = state.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsParPage; // 0
  const end = page * state.search.resultsParPage; // 9
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt=oldQt*newServings/oldServings//2*8/4=4
  });
  state.recipe.servings = newServings;
};

export const persisBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmark));
};

export const addBookmark = function (recipe) {
  state.bookmark.push(recipe);
  // mark current recipe as bookmarks
  if (recipe.id === state.recipe.id) state.recipe.bookmark = true;

  persisBookmark();
};

export const deleteBookmark = function (id) {
  const index = state.bookmark.findIndex(el => el.id === id);
  state.bookmark.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmark = false;
  persisBookmark();
};

const init = function () {
  const storeage = localStorage.getItem('bookmarks');
  if (storeage) state.bookmark = JSON.parse(storeage);
};
init();

const clearBookmarks = function () {
  localStorage.clear();
  ('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el=>el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! please use the corrent format :)'
          );
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
