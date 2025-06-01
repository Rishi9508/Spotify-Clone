// alert("Welcome to Rishi Raj Website")
console.log('Lets write javascript');
let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = (minutes < 10) ? "0" + minutes : minutes;
    const formattedSeconds = (remainingSeconds < 10) ? "0" + remainingSeconds : remainingSeconds;
    var formattedTime = formattedMinutes + ":" + formattedSeconds;
    return formattedTime;
}
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = " "
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class=invert src="img//music.svg" alt="">
                                     <div class="info">
                                     <div>${song.replaceAll("%20", " ")}</div>
                                     <div></div>
                                     </div>
                                     <div class="playnow">
                                     <span>Play Now</span>
                                     <img class=invert src="img/play.svg" alt="">
                                    </div></li>`;
    }


    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    // audio.play()
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
//albums display
async function displayAlbums() {
  try {
    const response = await fetch('/songs/albums.json');
    if (!response.ok) throw new Error('Failed to fetch albums.json');
    const albums = await response.json();

    const cardContainer = document.querySelector('.cardcontainer');
    cardContainer.innerHTML = ''; // Clear existing content

    albums.forEach(album => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.folder = album.folder;

      card.innerHTML = `
        <div class="play">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                  stroke-linejoin="round" />
          </svg>
        </div>
        <img src="/songs/${album.folder}/${album.cover}" alt="Cover Image">
        <h2>${album.title}</h2>
        <p>${album.description}</p>
      `;

      card.addEventListener('click', async () => {
        console.log(`Fetching songs from ${album.folder}`);
        songs = await getSongs(`songs/${album.folder}`);
        playMusic(songs[0]);
      });

      cardContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading albums:', error);
  }
}

//play pause
async function main() {
    await getSongs("songs/partymood")
    playMusic(songs[0], true)

    displayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })
    //time update
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    //seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
    //for mobile
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    document.querySelector(".cardcontainer").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //next or previous
    previous.addEventListener("click", () => {
        console.log("Prevoius clicked")
        // console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        console.log("Next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    // volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, " / 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if(currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "img/volume.svg")
        }
    })
    // for volume mute or up
    document.querySelector(".volume>img").addEventListener("click", e => {
        // console.log(e.target)
        // console.log("changing", e.target.src)
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "img/volume.svg")
            currentSong.volume = .1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }
    })
    
    
}

main()