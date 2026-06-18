(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var shell = document.querySelector("[data-player]");
    if (!shell) {
      return;
    }
    var video = shell.querySelector("video");
    var overlay = shell.querySelector(".player-overlay");
    var button = shell.querySelector(".player-start");
    var src = shell.getAttribute("data-src");
    var loaded = false;
    var hls = null;

    function loadVideo() {
      if (loaded || !video || !src) {
        return;
      }
      loaded = true;
      video.controls = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }
    }

    function startVideo() {
      loadVideo();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var playTask = video.play();
      if (playTask && typeof playTask.catch === "function") {
        playTask.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", startVideo);
    }
    if (button) {
      button.addEventListener("click", startVideo);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (!loaded) {
          startVideo();
        }
      });
      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      });
    }
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
