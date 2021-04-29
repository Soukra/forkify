import View from './View.js'
import previewView from './previewView.js';

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. FInd a nice recipe and bookmark it';
    _message = '';

    addHandlerRender(handler){ window.addEventListener('load', handler) }

    _generateMarkup() {
        // console.log(this._data); // (59) [{}, {}, ..., {}] -> map over it
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('')
        // bookmark => previewView.render(bookmark, false) -> if(!render) return markup; [markup1, markup2, ...]
        // [markup1, markup2, ...].join('') -> join array of markups strings into one single 'string' to return it
    }

};

export default new BookmarksView();
