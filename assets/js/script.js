const wrapper = document.querySelector(".wrapper");
const musicImg = wrapper.querySelector(".img_area img");
const musicName = wrapper.querySelector(".song_details .name");
const musicArtist = wrapper.querySelector(".song_details .artist");
const audio = wrapper.querySelector("#audio");
const toggleBtn = wrapper.querySelector(".play_pause");
const prevBtn = wrapper.querySelector("#prev");
const nextBtn = wrapper.querySelector("#next");
const progressArea = wrapper.querySelector(".progress_area");
const progressBar = wrapper.querySelector(".progress_area .progress_bar");
const repeatBtn = wrapper.querySelector("#repeatPlaylist");
const musicList = wrapper.querySelector(".music_list");
const showMoreBtn = wrapper.querySelector("#moreMusic");
const showLessBtn = musicList.querySelector("#close");
const ulTag = musicList.querySelector("ul");
let musicIdx = Math.floor(Math.random() * music.length + 1);

window.addEventListener("load", () => {
  loadMusic(musicIdx);
  playingNow();
});

toggleBtn.addEventListener("click", () => {
  const isPlay = wrapper.classList.contains("paused");
  isPlay ? pauseMusic() : playMusic();
  playingNow();
});

nextBtn.addEventListener("click", () => {
  nextMusic();
});

prevBtn.addEventListener("click", () => {
  prevMusic();
});

audio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  let musicCurrentTime = wrapper.querySelector(".current");
  let musicDuration = wrapper.querySelector(".duration");

  progressBar.style.width = `${progressWidth}%`;
  audio.addEventListener("loadeddata", () => {
    let audioDuration = audio.duration;
    let totalMinutes = Math.floor(audioDuration / 60);
    let totalSeconds = Math.floor(audioDuration % 60);

    if (totalSeconds < 10) {
      totalSeconds = `0${totalSeconds}`;
    }

    musicDuration.innerText = `${totalMinutes}:${totalSeconds}`;
  });

  let currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);

  if (currentSeconds < 10) {
    currentSeconds = `0${currentSeconds}`;
  }

  musicCurrentTime.innerText = `${currentMinutes}:${currentSeconds}`;
});

progressArea.addEventListener("click", (e) => {
  let audioDuration = audio.duration;
  let progressWidthValue = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;

  audio.currentTime = (clickedOffsetX / progressWidthValue) * audioDuration;
  playMusic();
  playingNow();
});

repeatBtn.addEventListener("click", () => {
  let text = repeatBtn.innerText;
  switch (text) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song Looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback Shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist Looped");
      break;
  }
});

audio.addEventListener("ended", () => {
  let text = repeatBtn.innerText;
  switch (text) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      audio.currentTime = 0;
      loadMusic(musicIdx);
      playMusic();
      break;
    case "shuffle":
      let randIdx = Math.floor(Math.random() * music.length + 1);

      do {
        randIdx = Math.floor(Math.random() * music.length + 1);
      } while (musicIdx == randIdx);
      musicIdx = randIdx;
      loadMusic(musicIdx);
      playMusic();
      playingNow();
      break;
  }
});

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

showLessBtn.addEventListener("click", () => {
  showMoreBtn.click();
});

for (let i = 0; i < music.length; i++) {
  if (music[i].album != "") {
    let li = /*html*/ `
    <li li-index="${i + 1}">
      <div class="row">
        <span>${music[i].name}</span>
        <p>${music[i].artist} &middot; ${music[i].album}</p>
      </div>
      <span id="${music[i].audio}" class="audio_duration">0:00</span>
      <audio class="${music[i].audio}" src="assets/audio/${music[i].audio}.mp3"></audio>
    </li>`;

    ulTag.insertAdjacentHTML("beforeend", li);
  } else {
    let li = /*html*/ `
    <li li-index="${i + 1}">
      <div class="row">
        <span>${music[i].name}</span>
        <p>${music[i].artist}</p>
      </div>
      <span id="${music[i].audio}" class="audio_duration">0:00</span>
      <audio class="${music[i].audio}" src="assets/audio/${music[i].audio}.mp3"></audio>
    </li>`;

    ulTag.insertAdjacentHTML("beforeend", li);
  }

  let liAudioDuration = ulTag.querySelector(`#${music[i].audio}`);
  let liAudioTag = ulTag.querySelector(`li .${music[i].audio}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMinutes = Math.floor(audioDuration / 60);
    let totalSeconds = Math.floor(audioDuration % 60);

    if (totalSeconds < 10) {
      totalSeconds = `0${totalSeconds}`;
    }

    liAudioDuration.innerText = `${totalMinutes}:${totalSeconds}`;
    liAudioDuration.setAttribute("time-duration", `${totalMinutes}:${totalSeconds}`);
  });
}

function loadMusic(idx) {
  musicImg.src = `assets/img/${music[idx - 1].img}.jpeg`;
  musicImg.setAttribute("alt", `${music[idx - 1].name}`);
  musicImg.setAttribute("title", `${music[idx - 1].name}`);
  musicName.innerText = music[idx - 1].name;
  audio.src = `assets/audio/${music[idx - 1].audio}.mp3`;

  if (music[idx - 1].album != "") {
    musicArtist.innerHTML = /*html*/ `${music[idx - 1].artist} &middot; ${music[idx - 1].album}`;
  } else {
    musicArtist.innerHTML = music[idx - 1].artist;
  }
}

function playMusic() {
  wrapper.classList.add("paused");
  toggleBtn.querySelector("i").innerText = "pause";
  toggleBtn.querySelector("i").setAttribute("title", "Pause");
  musicName.style.paddingLeft = "100%";
  musicName.classList.remove("stop");
  musicName.classList.add("running");
  audio.play();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  toggleBtn.querySelector("i").innerText = "play_arrow";
  toggleBtn.querySelector("i").setAttribute("title", "Play");
  musicName.style.paddingLeft = 0;
  musicName.classList.remove("running");
  musicName.classList.add("stop");
  audio.pause();
}

function nextMusic() {
  ++musicIdx;
  musicIdx > music.length ? (musicIdx = 1) : (musicIdx = musicIdx);
  loadMusic(musicIdx);
  playMusic();
  playingNow();
}

function prevMusic() {
  --musicIdx;
  musicIdx < 1 ? (musicIdx = music.length) : (musicIdx = musicIdx);
  loadMusic(musicIdx);
  playMusic();
  playingNow();
}

function playingNow() {
  const liTag = ulTag.querySelectorAll("li");

  for (let i = 0; i < liTag.length; i++) {
    let audioTag = liTag[i].querySelector(".audio_duration");

    if (liTag[i].classList.contains("playing")) {
      let duration = audioTag.getAttribute("time-duration");

      liTag[i].classList.remove("playing");
      audioTag.innerText = duration;
    }

    if (liTag[i].getAttribute("li-index") == musicIdx) {
      liTag[i].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    liTag[i].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(e) {
  let idx = e.getAttribute("li-index");
  musicIdx = idx;
  loadMusic(musicIdx);
  playMusic();
  playingNow();
}
