
var video = document.getElementById('movieVideo');
var cover = document.getElementById('playCover');
var hlsInstance = null;
var attached = false;

function attachStream() {
    if (!video || attached) {
        return;
    }

    var stream = video.dataset.stream;

    if (!stream) {
        return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        attached = true;
        return;
    }

    var Hls = window.Hls;

    if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({ enableWorker: true });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        attached = true;
        return;
    }

    video.src = stream;
    attached = true;
}

function startPlayback() {
    if (!video) {
        return;
    }

    attachStream();

    if (cover) {
        cover.classList.add('is-hidden');
    }

    var result = video.play();

    if (result && typeof result.catch === 'function') {
        result.catch(function () {
            if (cover) {
                cover.classList.remove('is-hidden');
            }
        });
    }
}

if (cover) {
    cover.addEventListener('click', startPlayback);
}

if (video) {
    video.addEventListener('click', function () {
        if (video.paused) {
            startPlayback();
        }
    });
}

window.addEventListener('pagehide', function () {
    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }
});
