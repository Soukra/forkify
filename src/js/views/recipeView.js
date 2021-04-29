import View from './View.js'

// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../img/icons.svg'; // Parcel 2
import { Fraction } from 'fractional'; // npm packs dont need to specify path, only pack name

// * We create a class for each view in order export the instance{} to use its methods in the controller and interact with the data from the model

/* Parcel problems with classPrivateProperties/Methods

1. Install the corresponding packages with NPM:
    npm i @babel/plugin-proposal-private-methods @babel/plugin-proposal-class-properties

2. Create the '.babelrc' file at the root folder of your project with this:
    { "plugins": [ "@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-private-methods" ] }

3. Run Parser

*/

class RecipeView extends View { // each view is a class cause later they will inherit general methods from parent View class
    _parentElement = document.querySelector('.recipe');
    _errorMessage = 'We could not find that recipe. Please try another one!';
    _message = '';

    addHandlerRender(handler) { // publisher(subscriber){} = addEventListener(controllerFunction)// it is public so it can be part of the public API
        ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
        // window.addEventListener('hashchange', controlRecipes); // - listen for the uri changes /#5ed6604591c37cdc054bc886
        // window.addEventListener('load', controlRecipes); // - when window global{} loads -> run controlRecipes according to the uri #id
    }

    addHandlerUpdateServings(handler) { // event delegation -> addEvLstnr on parent and use e.target
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--update-servings');
            if(!btn) return;

            const { updateTo } = btn.dataset; // btn.dataset.updateTo{} -> data-update-to
            if (+updateTo > 0) handler(+updateTo); // run controller only if updateTo > 0
        })
    }

    addHandlerAddBookmark(handler) { // event delegation -> publisher(subscriber) subcriber -> controller
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--bookmark');
            if (!btn) return;
            handler();
        });
    }

    _generateMarkup() { // using this._data comming from render(model.state.recipe)
        return `
            <figure class="recipe__fig">
                <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
                <h1 class="recipe__title">
                    <span>${this._data.title}</span>
                </h1>
            </figure>

            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="${icons}#icon-clock"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
                    <span class="recipe__info-text">minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="${icons}#icon-users"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
                    <span class="recipe__info-text">servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn--tiny btn--update-servings" data-update-to="${
                            this._data.servings - 1
                        }">
                            <svg>
                                <use href="${icons}#icon-minus-circle"></use>
                            </svg>
                        </button>
                        <button class="btn--tiny btn--update-servings" data-update-to="${
                            this._data.servings + 1
                        }">
                            <svg>
                                <use href="${icons}#icon-plus-circle"></use>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
                    <svg>
                        <use href="${icons}#icon-user"></use>
                    </svg>
                </div>
                <button class="btn--round btn--bookmark">
                    <svg class="">
                        <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
                    </svg>
                </button>
            </div>

            <div class="recipe__ingredients">
                <h2 class="heading--2">Recipe ingredients</h2>
                <ul class="recipe__ingredient-list">
                    ${
                        this._data.ingredients.map(this._generateMarkupIngredient).join('') // join the [] of strings `html` and return one string `html`
                    }
                </ul>
            </div>
            <div class="recipe__directions">
                <h2 class="heading--2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
                    directions at their website.
                </p>
                <a
                class="btn--small recipe__btn"
                href="${this._data.sourceUrl}"
                target="_blank"
                >
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </a>
            </div>
        `;
    }

    _generateMarkupIngredient(ing) {
        return `
            <li class="recipe__ingredient">
                <svg class="recipe__icon">
                    <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${ ing.quantity ? new Fraction(ing.quantity).toString() : '' }</div>
                <div class="recipe__description">
                    <span class="recipe__unit">${ing.unit}</span>
                    ${ing.description}
                </div>
            </li>
        `;
    }
}

// Instead of exporting the whole class to later create instances inside controllers - EXPORT A CLASS INSTANCE instead
export default new RecipeView(); // we dont pass any data in, therefore we dont need ay constructor either