const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const audio = document.querySelector("#audio");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#prev");
const play = document.querySelector("#play");
const playIcon = document.querySelector("#playIcon");
const next = document.querySelector("#next");
const duration = document.querySelector("#duration-time");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volumeIcon");
const volumeSlider = document.getElementById("volume-slider");
const ul = document.querySelector("ul");



const player = new MusicPlayer(musicList);

window.addEventListener("load", () => {
    let music = player.getMusic();
    displayMusic(music);

    displayMusicList(player.musicList);
    isMusicPlayNow();
})
function displayMusic(music) {
    title.textContent = music.title;
    singer.textContent = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;

}
play.addEventListener("click", () => {
    const isMusicPlay = container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();
    

})

function pauseMusic() {
    audio.pause();
    container.classList.remove("playing");
    playIcon.classList.replace("fa-pause", "fa-play");
}
function playMusic() {
    audio.play();
    container.classList.add("playing");
    playIcon.classList.replace("fa-play", "fa-pause");

}

next.addEventListener("click", () => {
    nextMusic();
})

prev.addEventListener("click", () => {
    prevMusic();
})
function prevMusic() {
    player.prev();

    let music = player.getMusic();
    displayMusic(music);

    if (container.classList.contains("playing")) {
        container.classList.remove("playing");
    }
    playMusic();
    isMusicPlayNow();
}

function nextMusic() {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    if (container.classList.contains("playing")) {
        container.classList.remove("playing");
    }
    playMusic();
    isMusicPlayNow();
}

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);

})

const calculateTime = (toplamSaniye) => {

    const dakika = Math.floor(toplamSaniye / 60);
    const saniye = Math.floor(toplamSaniye % 60);
    const guncellenenSaniye = saniye < 10 ? "0" + saniye : saniye;
    let result = (dakika < 10 ? "0" + dakika : dakika) + ":" + guncellenenSaniye;
    return result;

}

audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);

    if (audio.duration == audio.currentTime) {
        nextMusic();
    }
});

progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value;
})

volume.addEventListener("click", () => {
    let durum = volume.classList.contains("sesli");
    if (durum) {
        audio.muted = true;
        volume.classList.remove("sesli");
        volume.classList = ("sessiz fa-solid fa-volume-xmark");
        volumeSlider.value = 0;
    }
    else {
        audio.muted = false;
        volume.classList.remove("sessiz");
        volume.classList = ("sesli fa-solid fa-volume-high");
        volumeSlider.value = 1;
    }
})

volumeSlider.addEventListener("input", function () {
    audio.volume = volumeSlider.value;

    if (volumeSlider.value == 0) {
        volume.classList = ("sessiz fa-solid fa-volume-xmark");

    }
    else {
        volume.classList = ("sesli fa-solid fa-volume-high");
    }
});

const displayMusicList = (list) => {
    for (let i in list) {
        let liTag = `<li li-index='${i}' onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
                       <span>${list[i].getName()}</span>
                       <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
                       <audio class="music-${i}" src="mp3/${list[i].file}"> </audio>
                       </li>`;

        ul.insertAdjacentHTML("beforeend", liTag);

        let liAudioDuration = ul.querySelector(`#music-${i}`);
        let liAudioTag = ul.querySelector(`.music-${i}`);

        liAudioTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = calculateTime(liAudioTag.duration);
        })   
    }
}
const selectedMusic = (e) => {
    const index = e.getAttribute("li-index");
    player.index = index;
    displayMusic(player.getMusic());
    playMusic();
    isMusicPlayNow();

}
const isMusicPlayNow = () => {
    for (let li of ul.querySelectorAll("li")) {
        if (li.classList.contains("playing")) {
            li.classList.remove("playing");
        }
        if (li.getAttribute("li-index") == player.index) {
            li.classList.add("playing");
        }
    }
}






