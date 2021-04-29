import View from './View.js'

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded';

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        // run as soon as instance object is created - as soon a instance{} is imported
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow() { // not adding method to controllerFunction -> run method on constructor
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); // setting correct this kw
    }

    _addHandlerHideWindow() { // not adding method to controllerFunction -> run method on constructor
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this)); // setting correct this kw
        this._overlay.addEventListener('click', this.toggleWindow.bind(this)); // setting correct this kw
    }

    addHandlerUpload(handler) { // publisher(subscriber) pattern
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault(); // prevent default when submitting or events that reload page to prevent re-load

            // FormData - browser API -> API Calls happen only in the model
            const dataArr = [...new FormData(this)]; // we need to pass data to model through controller
            const data = Object.fromEntries(dataArr); // transform [["", ""],] to {"":"",}
            handler(data); // replaced by controlAddRecipe(newRecipe)
        });
    }
}
export default new AddRecipeView(); // import object in controller