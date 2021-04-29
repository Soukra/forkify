import { API_URL, KEY, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeObject = function(data) {
    const { recipe } = data.data; // taking .recipe{} from data
    return { // return {} to then run function and store returned {} inside state.recipe
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        // if recipe.key return {key: recipe.key} and ...{} spread single value
        ...(recipe.key && { key: recipe.key }), // and && operator // key: recipe.key
    };
}

export const loadRecipe = async function(id) { // doesnt return anything -> only changes state{} that contains the recipe
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`); // - ?key=${KEY} also get our own recipes

        state.recipe = createRecipeObject(data);

        // Adding bookmarked property to all recipes default to false -> state.recipe.bookmarked = false

        // check if in state.bookmarks[] array is any bookmark with the same id as the recipe's id
        if(state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true; // if so, set new recipe prop bookmarked to true
        } else {
            state.recipe.bookmarked = false; // otherwise set recipe new prop bookmarked to false
        }

        // catching re thrown error and throwing it back to controller
    } catch (err) { throw err; }
};

export const loadSearchResults = async function(query) { // export async function(query) to be used by controller
    try {
        state.search.query = query;

        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`); // &key=${KEY} also get our own recipes

        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }), // and && operator
            };
        });

        state.search.page = 1; // whenever we do a new search, page number resets back to one

    } catch (err) {
        console.error(err);
        throw err; // re-throw error to use it in controller
    }
};

export const getSearchResultsPage = function(page = state.search.page) { // this is not async cause at this point data is alr loaded

    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;// 0; // starting point -> 1 - 1 = 0 * 10 = 0
    const end = page * state.search.resultsPerPage;// 9; // ending point -> 10

    return state.search.results.slice(start, end);
}

export const updateServings = function(newServings) {
    // state.recipe.ingredients (6) [{}, {}, {}, {}, {}, {}]
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        // newQt = oldQt * newServings / oldServings // (2 * 8) / 4 = 4
    });

    // set outside forEach so we can preserve old servings throughout the loop and at the end re-assign it
    state.recipe.servings = newServings;
}

// Adding/Removing bookmark from localStorage -> no need to export this function
const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); // storing array of {} -> [{}, {}, ...]
}

export const addBookmark = function(recipe) { // when adding we get entire data
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    // if the id of recipe we pass in equals id of current loaded recipe -> state.recipe.bookmarked = true; new prop
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
}

export const deleteBookmark = function(id) { // when deleting we just need id to identify which to delete
    // Delete bookmark
    // state.bookmarks[]
    const index = state.bookmarks.findIndex(el => el.id === id); // if els condition true -> return el's arr index
    state.bookmarks.splice(index, 1); // splice removes from indexPoint and, number of elements to delete from there

    if (id === state.recipe.id) state.recipe.bookmarked = false; // set bookmarked prop as false

    persistBookmarks();
}

const init = function() { // init function to run functionality right away -> taking data from localstorage
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage); // if theres bookmarks in l.s parse the string->object
}
init();

const clearBookmarks = function() { // just a handy function for development
    localStorage.clear('bookmarks');
}
// clearBookmarks();

//                                         {key:"", key1:"", ...}
export const uploadRecipe = async function(newRecipe) { // async function req for API goes inside model.js
    try { // 1) Turning object to array and filter the (12) [(2)["", ""], (2)["", ""], ...]
        const ingredients = Object.entries(newRecipe).filter( // each entry -> ["", ""]
            entry => entry[0].startsWith('ingredient') && entry[1] !== ''
        ).map(ing => { // map() on (3) [["",""], ["",""], ["",""]] -> replace ' ' and split elements by commas
            const ingArr = ing[1].split(',').map(el => el.trim());//on each arr el trim spaces from start and end
            if (ingArr.length !== 3) throw new Error('Wrong ingredient format!') // if arr.length is dif than 3
            const [ quantity, unit, description ] = ingArr;
            return { quantity: quantity ? +quantity : null, unit, description }; // (3) [{...}, {...}, {...}]
            /*
            -BEFORE
            (3) [[], [], []]
                0: ["ingredient-1", "0.5,kg,Rice"]
                1: ["ingredient-2", "1,,Avocado"]
                2: ["ingredient-3", ",,salt"]

            - AFTER
            (3) [{…}, {…}, {…}]
                0: {quantity: "0.5", unit: "kg", description: "Rice"}
                1: {quantity: "1", unit: "", description: "Avocado"}
                2: {quantity: "", unit: "", description: "salt"}
            */
        });
        console.log(ingredients); // [{...}, {...}, {...}]

        // creating recipe{} ready to be uploaded based on form data
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients, // [{...}, {...}, {...}]
        }
        console.log(recipe); // {...}

        // storing result promise value in data from sendJSON(url, recipe{}) promise POST Request - in model.js
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        // console.log(data); // {status: "success", data: {…}}

        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe); // adding bookmark to new recipe

    } catch (err) {
        throw err;
    }
}