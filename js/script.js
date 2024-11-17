console.log('It\'s Working');
let curruntSong = new Audio();
let songs;
let crrFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    crrFolder = folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a')
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    //show all the songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="/img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Yash</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="/img/play.svg" alt="">
                            </div>
                        </li>`
    }

    //Attach an event listener to each song
    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {
        e.addEventListener("click", element => {
            console.log();
            playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim())
        })

    })

    return songs
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/song/" + track)
    curruntSong.src = `/${crrFolder}/` + track
    if (!pause) {
        curruntSong.play()
        play.src = '/img/pause.svg'
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = '00:00/00:00'

}

async function displayAlbums() {
    let a = await fetch(`/song/`)
    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/song") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            //Get metadata of the folder
            let a = await fetch(`/song/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card rounded">
            <div class="play">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="14" fill="#1fdf64" />
            <path d="M10 10 L18 14 L10 18" fill="black" stroke="none" />
            </svg>
            </div>
            <img src="/song/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
            </div>`

        }
    }
    //load the playlist when its change library
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            let songs = await getSongs(`song/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}

async function main() {

    await getSongs('song/bolly1')
    playMusic(songs[0], true)

    //display all the albums on display
    displayAlbums()

    //Attach an event listner to play, next and previous
    play.addEventListener("click", () => {
        if (curruntSong.paused) {
            curruntSong.play()
            play.src = "/img/pause.svg"
        }
        else {
            curruntSong.pause()
            play.src = "/img/play.svg"
        }
    })


    //Listen for timeupdate event
    curruntSong.addEventListener("timeupdate", () => {
        // console.log(curruntSong.curruntTime, curruntSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(curruntSong.currentTime)}/${secondsToMinutesSeconds(curruntSong.duration)}`

        document.querySelector(".circle").style.left = (curruntSong.currentTime / curruntSong.duration) * 100 + "%";
    })


    //add an event listener to seek bar
    document.querySelector(".seekbar").addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        curruntSong.currentTime = (curruntSong.duration) * percent / 100
    })

    //Add event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = '0'
    })

    //add an event listener for close button 
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = '-120%'
    })

    //add event listener for previous and next
    previous.addEventListener("click", () => {
        console.log('Previous Clicked');

        let index = songs.indexOf(curruntSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        console.log('next Clicked');
        console.log(length);


        let index = songs.indexOf(curruntSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //add event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        curruntSong.volume = parseInt(e.target.value) / 100
    })

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            curruntSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            curruntSong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

}

main()