import icons from 'url:../../img/icons.svg'; // Parcel 2
import View from './View.js'

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) { // publisher(subscriber) pattern
        this._parentElement.addEventListener('click', function(e) { // event delegation -> addEvListnr on parent to track e.target.closest(button)
            // look up in the chain to get closest parent w/ class '.btn--inline'
            const btn = e.target.closest('.btn--inline'); // no matter if we click on span/svg -> it will go up to closest parent with '.btn--inline'

            if (!btn) return; // if we click in the middle or outside btns

            // Connect dom and our code with data attributes -> <button data-goto="${curPage +- 1}"></button>
            const goToPage = +btn.dataset.goto; // 1/2/3/4/5/6

            handler(goToPage); // passing goToPage dataset number value to controllerFunction(goToPage)
        });
    };

    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage); // 60 / 10 = 6 = numPages

        // Page 1, and there are other pages
        if (curPage === 1 && numPages > 1) {
            return `
                <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        };

        // Last page
        if (curPage === numPages && numPages > 1) {
            return `
                <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
            `;
        };

        // Other page
        if (curPage < numPages) {
            return `
                <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>

                <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        };

        // Page 1, and there are NO other pages
        return ''; // nothing cause theres nowhere to go
    }

}

export default new PaginationView();