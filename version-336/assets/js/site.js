(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    var slider = document.querySelector("[data-hero-slider]");
    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
        var current = 0;
        var show = function (index) {
            current = index;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        };
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
            });
        });
        if (slides.length > 1) {
            window.setInterval(function () {
                show((current + 1) % slides.length);
            }, 5200);
        }
    }

    var panel = document.querySelector("[data-filter-panel]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".js-card"));
    var empty = document.querySelector("[data-empty-state]");
    if (panel && cards.length) {
        var input = panel.querySelector("[data-filter-input]");
        var year = panel.querySelector("[data-filter-year]");
        var region = panel.querySelector("[data-filter-region]");
        var type = panel.querySelector("[data-filter-type]");
        var params = new URLSearchParams(window.location.search);
        if (input && params.get("q")) {
            input.value = params.get("q");
        }
        var filter = function () {
            var query = input ? input.value.trim().toLowerCase() : "";
            var yearValue = year ? year.value : "";
            var regionValue = region ? region.value : "";
            var typeValue = type ? type.value : "";
            var visible = 0;
            cards.forEach(function (card) {
                var text = (card.getAttribute("data-search") || "").toLowerCase();
                var ok = true;
                if (query && text.indexOf(query) === -1) {
                    ok = false;
                }
                if (yearValue && card.getAttribute("data-year") !== yearValue) {
                    ok = false;
                }
                if (regionValue && card.getAttribute("data-region") !== regionValue) {
                    ok = false;
                }
                if (typeValue && card.getAttribute("data-type") !== typeValue) {
                    ok = false;
                }
                card.classList.toggle("is-hidden", !ok);
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        };
        [input, year, region, type].forEach(function (control) {
            if (control) {
                control.addEventListener("input", filter);
                control.addEventListener("change", filter);
            }
        });
        filter();
    }
}());
