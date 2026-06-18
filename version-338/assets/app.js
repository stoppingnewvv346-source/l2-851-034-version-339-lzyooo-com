
(function () {
    var menuButton = document.getElementById('menuButton');
    var mainNav = document.getElementById('mainNav');

    if (menuButton && mainNav) {
        menuButton.addEventListener('click', function () {
            mainNav.classList.toggle('is-open');
        });
    }

    var slider = document.getElementById('heroSlider');

    if (!slider) {
        return;
    }

    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
        if (!slides.length) {
            return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === current);
        });
    }

    function play() {
        clearInterval(timer);
        timer = setInterval(function () {
            show(current + 1);
        }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
            show(dotIndex);
            play();
        });
    });

    if (prev) {
        prev.addEventListener('click', function () {
            show(current - 1);
            play();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            show(current + 1);
            play();
        });
    }

    show(0);
    play();
})();
