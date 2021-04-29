import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View { // default exporting class Parent to let its childs inherit general methods/props
    _data;

    /** JSDOC -> JS Documentation
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g recipe)
     * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
     * @returns {undefined | string} A markup string is returned if render=false
     * @this {Object} View instance
     * @author Aaron Carrasco
     * @todo Finish implementation
     */
    render(data, render = true){
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return this.renderError();
        }

        this._data = data; // storing from render(model.state.recipe)
        const markup = this._generateMarkup();

        if(!render) return markup;

        // Rendering HTML
        this._clear(); // running method that clears parentElement inner html code // 1) empty parent
        this._parentElement.insertAdjacentHTML('afterbegin', markup); // inserting html code inside empty container // 2) fill parent
    }

    update(data) { // only updating the html elements that do change by turning markup string to html and compare it
        this._data = data;
        const newMarkup = this._generateMarkup(); // newMarkup is a string

        // convert markup string into a dom object thats living in memory that we can compare to actual page dom

        // turn newmarkup to html nodes
        const newDOM = document.createRange().createContextualFragment(newMarkup); // convert string to virtual dom object

        // select all new updated html nodes -> return a nodelist -> turn it to reg array
        const newElements = Array.from(newDOM.querySelectorAll('*')); // NodeList(97) [] convert to reg array [] -> Arra.from(NodeList[])

        // select old/current nodes
        const curElements = Array.from(this._parentElement.querySelectorAll('*')); // .qSAll returns nodelist[] turn to array w/ Array.from(nodeList[])

        // Updating only some dom elements by comparing both arrays of new nodes and current/old nodes
        newElements.forEach((newEl, i) => { // Update only some cur nodes text content and attributes
            const curEl = curElements[i];
            // console.log(curEl, newEl.isEqualNode(curEl)); // check if each nodes are equal

            // * Updates changed TEXT
            // newEl is a node which first child is the text node - MDN .nodeValue - check if aint empty string
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                // if aint same node and firstChild is text -> update cur's textContent to news
                curEl.textContent = newEl.textContent;
            }

            // * Updates changed ATTRIBUTES -> nodeEl.attributes
            if(!newEl.isEqualNode(curEl)) {
                // NamedNodeMap {0: class, 1: data-update-to, class: class, data-update-to: data-update-to, length: 2}
                // console.log(newEl.attributes); -> turn {} to array w/ Array.from({}) -> [] to loop over it
                // console.log(Array.from(newEl.attributes)); // (2) [class, data-update-to]

                Array.from(newEl.attributes).forEach(attr => {
                    curEl.setAttribute(attr.name, attr.value) // setting new attrs to curEl attrs
                });
            }
        });
    }

    _clear() { // clears html contained in parent elements in order to fill it up with other rendered html
        this._parentElement.innerHTML = '';
    }

    renderSpinner(){ // Method that inserts html with spinning infinite loop animation w/ css
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    renderError(message = this._errorMessage) {
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
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message) {
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
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

} // We wont make an instance out of class View, only through its children classes