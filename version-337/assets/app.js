(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });
        restart();
    }

    function textIncludes(value, query) {
        return String(value || '').toLowerCase().indexOf(query) !== -1;
    }

    function setupSearchPage() {
        var root = document.querySelector('[data-search-filter]');
        var results = document.querySelector('[data-search-results]');
        if (!root || !results) {
            return;
        }
        var input = root.querySelector('[data-search-input]');
        var type = root.querySelector('[data-search-type]');
        var region = root.querySelector('[data-search-region]');
        var year = root.querySelector('[data-search-year]');
        var genre = root.querySelector('[data-search-genre]');
        var sort = root.querySelector('[data-search-sort]');
        var count = root.querySelector('[data-search-count]');
        var cards = Array.prototype.slice.call(results.querySelectorAll('.search-card'));

        function apply() {
            var query = (input && input.value || '').trim().toLowerCase();
            var typeValue = type && type.value || '';
            var regionValue = region && region.value || '';
            var yearValue = year && year.value || '';
            var genreValue = genre && genre.value || '';
            var visible = 0;

            cards.forEach(function (card) {
                var match = true;
                if (query && !textIncludes(card.getAttribute('data-search'), query)) {
                    match = false;
                }
                if (typeValue && card.getAttribute('data-type') !== typeValue) {
                    match = false;
                }
                if (regionValue && card.getAttribute('data-region') !== regionValue) {
                    match = false;
                }
                if (yearValue && card.getAttribute('data-year') !== yearValue) {
                    match = false;
                }
                if (genreValue && card.getAttribute('data-genre') !== genreValue) {
                    match = false;
                }
                card.classList.toggle('is-hidden-card', !match);
                if (match) {
                    visible += 1;
                }
            });

            if (sort && sort.value !== 'default') {
                var sorted = cards.slice().sort(function (a, b) {
                    if (sort.value === 'score') {
                        return Number(b.getAttribute('data-score')) - Number(a.getAttribute('data-score'));
                    }
                    if (sort.value === 'year') {
                        return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
                    }
                    return 0;
                });
                sorted.forEach(function (card) {
                    results.appendChild(card);
                });
            }

            if (count) {
                count.textContent = visible + ' 部';
            }
        }

        [input, type, region, year, genre, sort].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });
    }

    function setupCategoryFilter() {
        var root = document.querySelector('[data-category-filter]');
        var container = document.querySelector('[data-card-container]');
        if (!root || !container) {
            return;
        }
        var input = root.querySelector('[data-category-search]');
        var type = root.querySelector('[data-category-type]');
        var region = root.querySelector('[data-category-region]');
        var year = root.querySelector('[data-category-year]');
        var count = root.querySelector('[data-category-count]');
        var cards = Array.prototype.slice.call(container.querySelectorAll('.catalog-card'));

        function apply() {
            var query = (input && input.value || '').trim().toLowerCase();
            var typeValue = type && type.value || '';
            var regionValue = region && region.value || '';
            var yearValue = year && year.value || '';
            var visible = 0;

            cards.forEach(function (card) {
                var match = true;
                if (query && !textIncludes(card.getAttribute('data-search'), query)) {
                    match = false;
                }
                if (typeValue && card.getAttribute('data-type') !== typeValue) {
                    match = false;
                }
                if (regionValue && card.getAttribute('data-region') !== regionValue) {
                    match = false;
                }
                if (yearValue && card.getAttribute('data-year') !== yearValue) {
                    match = false;
                }
                card.classList.toggle('is-hidden-card', !match);
                if (match) {
                    visible += 1;
                }
            });

            if (count) {
                count.textContent = visible + ' 部';
            }
        }

        [input, type, region, year].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll('.js-player'));
        players.forEach(function (shell) {
            var video = shell.querySelector('video');
            var button = shell.querySelector('.js-play-button');
            var message = shell.querySelector('[data-player-message]');
            var source = shell.getAttribute('data-video');
            var hlsInstance = null;

            function setMessage(text) {
                if (message) {
                    message.textContent = text || '';
                }
            }

            function attachSource() {
                if (!video || !source) {
                    setMessage('影片暂时无法播放。');
                    return false;
                }
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                    return true;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    if (hlsInstance) {
                        hlsInstance.destroy();
                    }
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal) {
                            setMessage('影片加载失败，请稍后重试。');
                        }
                    });
                    return true;
                }
                setMessage('当前浏览器暂不支持在线播放。');
                return false;
            }

            if (button) {
                button.addEventListener('click', function () {
                    setMessage('正在加载影片…');
                    if (!attachSource()) {
                        return;
                    }
                    button.classList.add('is-hidden');
                    video.controls = true;
                    var playPromise = video.play();
                    if (playPromise && typeof playPromise.then === 'function') {
                        playPromise.then(function () {
                            setMessage('');
                        }).catch(function () {
                            setMessage('播放已准备好，请再次点击播放器开始。');
                        });
                    }
                });
            }
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupSearchPage();
        setupCategoryFilter();
        setupPlayers();
    });
})();
