class SearchView {
    _parentElement = document.querySelector('.search');

    getQuery() {
        const query = this._parentElement.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    _clearInput() {
        this._parentElement.querySelector('.search__field').value = '';
    }

    addHandlerSearch(handler) { //publisher(subscriber){} = addEvListener(controllerFunc){}
        this._parentElement.addEventListener('submit', function(e) { // we cant call (, handler) right away
            e.preventDefault(); // we prevent page from loading
            handler(); // then call handler method -> replaced by controllerFunction()
        });
    }
}

export default new SearchView();