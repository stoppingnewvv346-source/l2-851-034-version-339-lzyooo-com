(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupMobileMenu() {
    var toggle = document.querySelector(".mobile-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = panel.hasAttribute("hidden");
      if (open) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5600);
  }

  function setupCatalog() {
    var grid = document.querySelector("[data-catalog-grid]");
    if (!grid) {
      return;
    }
    var input = document.querySelector("[data-catalog-search]");
    var select = document.querySelector("[data-catalog-sort]");
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
    function applyFilter() {
      var keyword = normalize(input ? input.value : "");
      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-type"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre")
        ].join(" "));
        card.classList.toggle("hidden-card", keyword && text.indexOf(keyword) === -1);
      });
    }
    function applySort() {
      var value = select ? select.value : "default";
      var sorted = cards.slice();
      if (value === "views") {
        sorted.sort(function (a, b) {
          return Number(b.getAttribute("data-views")) - Number(a.getAttribute("data-views"));
        });
      }
      if (value === "year") {
        sorted.sort(function (a, b) {
          return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
        });
      }
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
    }
    if (input) {
      input.addEventListener("input", applyFilter);
    }
    if (select) {
      select.addEventListener("change", function () {
        applySort();
        applyFilter();
      });
    }
  }

  function safe(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function movieCard(movie) {
    var title = safe(movie.title);
    var file = safe(movie.file);
    var cover = safe(movie.cover);
    var year = safe(movie.year);
    var views = safe(movie.views);
    var type = safe(movie.type);
    var region = safe(movie.region);
    var genre = safe(movie.genre);
    var oneLine = safe(movie.one_line);
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return "<span>" + safe(tag) + "</span>";
    }).join("");
    return [
      "<a class=\"movie-card\" href=\"" + file + "\" data-title=\"" + title + "\" data-year=\"" + year + "\" data-views=\"" + views + "\" data-type=\"" + type + "\" data-region=\"" + region + "\" data-genre=\"" + genre + "\">",
      "<span class=\"card-cover\">",
      "<img src=\"" + cover + "\" alt=\"" + title + "\" loading=\"lazy\">",
      "<span class=\"card-hover\">▶</span>",
      "<span class=\"card-badge\">" + year + "</span>",
      "</span>",
      "<span class=\"card-body\">",
      "<strong>" + title + "</strong>",
      "<span class=\"card-desc\">" + oneLine + "</span>",
      "<span class=\"card-meta\"><span>" + region + "</span><span>" + type + "</span></span>",
      "<span class=\"card-tags\">" + tags + "</span>",
      "</span>",
      "</a>"
    ].join("");
  }

  function setupSearchPage() {
    var root = document.querySelector("[data-search-page]");
    if (!root || !window.SITE_MOVIES) {
      return;
    }
    var input = root.querySelector("[data-search-input]");
    var form = root.querySelector("[data-search-form]");
    var results = root.querySelector("[data-search-results]");
    var empty = root.querySelector("[data-search-empty]");
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    if (input) {
      input.value = initial;
    }
    function render(keyword) {
      var q = normalize(keyword);
      var list = window.SITE_MOVIES.filter(function (movie) {
        var text = normalize([
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.one_line,
          (movie.tags || []).join(" ")
        ].join(" "));
        return !q || text.indexOf(q) !== -1;
      }).slice(0, 96);
      results.innerHTML = list.map(movieCard).join("");
      if (empty) {
        empty.hidden = list.length > 0;
      }
    }
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var q = input ? input.value.trim() : "";
        var url = q ? "search.html?q=" + encodeURIComponent(q) : "search.html";
        window.history.replaceState(null, "", url);
        render(q);
      });
    }
    if (input) {
      input.addEventListener("input", function () {
        render(input.value);
      });
    }
    root.querySelectorAll("[data-search-tag]").forEach(function (tag) {
      tag.addEventListener("click", function (event) {
        event.preventDefault();
        var q = tag.getAttribute("data-search-tag") || "";
        if (input) {
          input.value = q;
        }
        window.history.replaceState(null, "", "search.html?q=" + encodeURIComponent(q));
        render(q);
      });
    });
    render(initial);
  }

  ready(function () {
    setupMobileMenu();
    setupHero();
    setupCatalog();
    setupSearchPage();
  });
})();
