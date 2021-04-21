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

class RecipeView { // each view is a class cause later they will inherit general methods from parent View class
    #parentElement = document.querySelector('.recipe');
    #data;
    #errorMessage = 'We could not find that recipe. Please try another one!';
    #message = '';

    render(data){
        this.#data = data; // storing from render(model.state.recipe)
        const markup = this.#generateMarkup();

        // Rendering HTML
        this.#clear(); // running method that clears parentElement inner html code // 1) empty parent
        this.#parentElement.insertAdjacentHTML('afterbegin', markup); // inserting html code inside empty container // 2) fill parent
    }

    #clear() { // clears html contained in parent elements in order to fill it up with other rendered html
        this.#parentElement.innerHTML = '';
    }

    renderSpinner(){ // Method that inserts html with spinning infinite loop animation w/ css
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
        this.#clear();
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    renderError(message = this.#errorMessage) {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this.#clear();
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this.#message) {
        const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this.#clear();
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    addHandlerRender(handler) { // publisher(subscriber){} = addEventListener(controllerFunction)// it is public so it can be part of the public API
        ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
        // window.addEventListener('hashchange', controlRecipes); // - listen for the uri changes /#5ed6604591c37cdc054bc886
        // window.addEventListener('load', controlRecipes); // - when window global{} loads -> run controlRecipes according to the uri #id
    }

    #generateMarkup() { // using this.#data comming from render(model.state.recipe)
        return `
            <figure class="recipe__fig">
                <img src="${this.#data.image}" alt="${this.#data.title}" class="recipe__img" />
                <h1 class="recipe__title">
                <span>${this.#data.title}</span>
                </h1>
            </figure>

            <div class="recipe__details">
                <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="${icons}#icon-clock"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${this.#data.cookingTime}</span>
                <span class="recipe__info-text">minutes</span>
                </div>
                <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="${icons}#icon-users"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${this.#data.servings}</span>
                <span class="recipe__info-text">servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn--tiny btn--increase-servings">
                    <svg>
                        <use href="${icons}#icon-minus-circle"></use>
                    </svg>
                    </button>
                    <button class="btn--tiny btn--increase-servings">
                    <svg>
                        <use href="${icons}#icon-plus-circle"></use>
                    </svg>
                    </button>
                </div>
                </div>

                <div class="recipe__user-generated">
                <svg>
                    <use href="${icons}#icon-user"></use>
                </svg>
                </div>
                <button class="btn--round">
                <svg class="">
                    <use href="${icons}#icon-bookmark-fill"></use>
                </svg>
                </button>
            </div>

            <div class="recipe__ingredients">
                <h2 class="heading--2">Recipe ingredients</h2>
                <ul class="recipe__ingredient-list">
                    ${
                        this.#data.ingredients.map(this.#generateMarkupIngredient).join('') // join the [] of strings `html` and return one string `html`
                    }
                </ul>
            </div>
            <div class="recipe__directions">
                <h2 class="heading--2">How to cook it</h2>
                <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${this.#data.publisher}</span>. Please check out
                directions at their website.
                </p>
                <a
                class="btn--small recipe__btn"
                href="${this.#data.sourceUrl}"
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

    #generateMarkupIngredient(ing) {
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