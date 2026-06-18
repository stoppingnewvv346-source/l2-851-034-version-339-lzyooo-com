
(function () {
    var input = document.getElementById('movieSearchInput');
    var region = document.getElementById('regionFilter');
    var type = document.getElementById('typeFilter');
    var year = document.getElementById('yearFilter');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (input) {
        input.value = initialQuery;
    }

    function matchText(card, query) {
        if (!query) {
            return true;
        }

        var haystack = [
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.genre,
            card.dataset.tags,
            card.textContent
        ].join(' ').toLowerCase();

        return haystack.indexOf(query.toLowerCase()) !== -1;
    }

    function applyFilters() {
        var query = input ? input.value.trim() : '';
        var regionValue = region ? region.value : '';
        var typeValue = type ? type.value : '';
        var yearValue = year ? year.value : '';

        cards.forEach(function (card) {
            var visible = matchText(card, query);
            visible = visible && (!regionValue || card.dataset.region === regionValue);
            visible = visible && (!typeValue || card.dataset.type === typeValue);
            visible = visible && (!yearValue || card.dataset.year === yearValue);
            card.style.display = visible ? '' : 'none';
        });
    }

    [input, region, type, year].forEach(function (element) {
        if (element) {
            element.addEventListener('input', applyFilters);
            element.addEventListener('change', applyFilters);
        }
    });

    applyFilters();
})();
