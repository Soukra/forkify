import View from './View.js'
import previewView from './previewView.js';

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query! Please try again';
    _message = '';

    _generateMarkup() {
        // console.log(this._data); // (59) [{}, {}, ..., {}] -> map over it
        return this._data.map(result => previewView.render(result, false)).join('')
        // bookmark => previewView.render(bookmark, false) -> if(!render) return markup; [markup1, markup2, ...]
        // [markup1, markup2, ...].join('') -> join array of markups strings into one single 'string' to return it
    }
};

export default new ResultsView();
