'use strict';

// --------------------------- html elements ---------------------------
const noisesEl = document.querySelectorAll('.noise');
const playlistEl = document.getElementById('playlist');
const playlistContainerEl = document.getElementById('playlist-container');
const playPauseEl = document.getElementById('play-pause');
const songIdEl = document.getElementById('song-id');
const songTitleEl = document.getElementById('song-title');
const genreEl = document.getElementById('genre');
const albumCoverEl = document.getElementById('album-cover');
const coverEl = document.getElementById('cover');
const closeBtn = document.getElementById('rotate-icon');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const stopBtn = document.getElementById('stop');
const forwardBtn = document.getElementById('forward');
const backwardBtn = document.getElementById('backward');

// --------------------------- data ---------------------------
const song01 = {
  id: 1,
  title: 'TVARI - Tokyo Cafe',
  poster: 'media/posters/poster01.jpg',
  url: 'media/music/song01.mp3',
  genre: 'Caffe lounge',
};

const song02 = {
  id: 2,
  title: 'Nesterouk - My Universe',
  poster: 'media/posters/poster02.jpg',
  url: 'media/music/song02.mp3',
  genre: 'Energetic power bass',
};

const song03 = {
  id: 3,
  title: 'Penguin - Modern Vlog',
  poster: 'media/posters/poster03.jpg',
  url: 'media/music/song03.mp3',
  genre: 'Future bass uplifting',
};

const song04 = {
  id: 4,
  title: 'QubeSound - Abstract Fashion',
  poster: 'media/posters/poster04.jpg',
  url: 'media/music/song04.mp3',
  genre: 'Beat calm chill',
};

const song05 = {
  id: 5,
  title: 'AlexiAction - Lifelike',
  poster: 'media/posters/poster05.jpg',
  url: 'media/music/song05.mp3',
  genre: 'Techno abstract',
};

// --------------------------- global variables ---------------------------
const songs = [song01, song02, song03, song04, song05];
let songIndex = 0;
let isPlaying = false;

// create a new audio wavesurfer
const wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#ccc',
  progressColor: '#1e1e1e',
  height: 30,
  barWidth: 2,
  barRadius: 50,
  autoplay: true,
});

wavesurfer.load(songs[songIndex].url); // load first song

// --------------------------- functions ---------------------------

// create a function to display the playlist
const displayPlaylist = function () {
  songs.forEach(song => {
    let playlist = `
                    <div class="song">
                      <h2 class="song-id">${String(song.id).padStart(2, 0)}</h2>
                      <p class="song-title">
                        <i class="fa-brands fa-itunes-note"></i>${song.title}
                      </p>
                      <div class="play-container">
                        <i class="fa-solid fa-play"></i>
                        <i class="fa-solid fa-pause hide"></i>
                      </div>
                    </div>
                  `;

    playlistContainerEl.insertAdjacentHTML('beforeend', playlist);
  });

  playFromList();
};

// create a function that plays songs from list
const playFromList = function () {
  const songsListEl = Array.from(document.querySelectorAll('.song'));
  const listPlayBtns = document.querySelectorAll('.play-container .fa-play');
  const listPauseBtns = document.querySelectorAll('.play-container .fa-pause');

  songsListEl.forEach((song, index) => {
    const playBtnList = song.children[2].firstElementChild; // play button off each song
    const pauseBtnList = song.children[2].lastElementChild; // pause button off each song

    playBtnList.addEventListener('click', () => {
      songIndex = index;
      // let currentSong = songs.find(song => song.id === index + 1); // current song Object

      songsListEl.forEach(song => {
        // remove previous song's active state and pause option
        if (song.classList.contains('active')) {
          song.classList.remove('active');
          listPlayBtns.forEach(playBtn => playBtn.classList.remove('hide'));
          listPauseBtns.forEach(pauseBtn => pauseBtn.classList.add('hide'));
        }
      });

      // add current song's active state and pause option
      if (songs[songIndex].id === songIndex + 1) {
        isPlaying = true;
        song.classList.add('active');
        playBtnList.classList.add('hide');
        pauseBtnList.classList.remove('hide');
        wavesurfer.load(songs[songIndex].url); // load current song
        wavesurfer.play();
        updateOnPlay(); // update UI on play
        updateDisplay(songs[songIndex]);

        pauseBtnList.addEventListener('click', () => {
          isPlaying = false;
          playBtnList.classList.remove('hide');
          pauseBtnList.classList.add('hide');
          wavesurfer.pause(); // pause current song
          updateOnPause(); // update UI on pause
        });
      }
    });
  });
};

displayPlaylist(); // display the playlist

// create a function to update the UI on play
const updateOnPlay = function () {
  if (isPlaying) {
    // update animations and controls
    noisesEl.forEach(noise => noise.classList.add('sound-wave'));
    playBtn.classList.add('hide');
    pauseBtn.classList.add('show');
    albumCoverEl.classList.add('rotate360');
  }
};

// create a function that updates the display
const updateDisplay = function (currentSong) {
  // update display
  songIdEl.textContent = `${String(currentSong.id).padStart(2, 0)}.`;
  songTitleEl.textContent = currentSong.title;
  coverEl.src = currentSong.poster;
  genreEl.textContent = currentSong.genre;
};

// create a function to update the UI on pause
const updateOnPause = function () {
  // restore initial state
  noisesEl.forEach(noise => noise.classList.remove('sound-wave'));
  playBtn.classList.remove('hide');
  pauseBtn.classList.remove('show');
  albumCoverEl.classList.remove('rotate360');
};

// --------------------------- event listeners ---------------------------

// open playlist
playlistEl.addEventListener('click', () => {
  playlistContainerEl.classList.remove('rotate');
});

// close playlist
closeBtn.addEventListener('click', () => {
  playlistContainerEl.classList.add('rotate');
});

// play from controls
playBtn.addEventListener('click', () => {
  isPlaying = true;
  updateOnPlay();
  wavesurfer.play();
});

// pause from controls
pauseBtn.addEventListener('click', () => {
  isPlaying = false;
  updateOnPause();
  wavesurfer.pause();
});

// stop from controls
stopBtn.addEventListener('click', () => {
  isPlaying = false;
  updateOnPause();
  wavesurfer.stop();
});

// play previous song
backwardBtn.addEventListener('click', () => {
  isPlaying = true;

  if (songIndex > 0 && songIndex < songs.length) {
    songIndex--;
    wavesurfer.load(songs[songIndex].url);
    updateOnPlay();
    updateDisplay(songs[songIndex]);
  }
});

// play next song
forwardBtn.addEventListener('click', () => {
  isPlaying = true;

  if (songIndex < songs.length - 1) {
    songIndex++;
    wavesurfer.load(songs[songIndex].url);
    updateOnPlay();
    updateDisplay(songs[songIndex]);
  }
});
