console.log("Lets write JavaScript");
let currentSong=new Audio();;
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`${folder}/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // songs = []
    songs = [
        {songName: "RAASHAH.mp3", filePath: "songs/Angry_(mood)/RAASHAH.mp3"},
        {songName: "JASHAN-E-HIPHOP Song RAFTAAR.mp3", filePath: "songs/Bright_(mood)/JASHAN-E-HIPHOP Song RAFTAAR.mp3"},
        {songName: "TWO TONE Song Young Stunners.mp3", filePath: "songs/cs/TWO TONE Song Young Stunners.mp3"},
        {songName: "Dont Mind Song By Young Stunners.mp3", filePath: "songs/Dark_(mood)/Dont Mind Song By Young Stunners.mp3"},
        {songName: "Bhussi - Seedhe Maut [64] Kbps-(SongsPk.com.se).mp3", filePath: "songs/Diljit/Bhussi - Seedhe Maut [64] Kbps-(SongsPk.com.se).mp33"},
        {songName: "Brand-New.mp3", filePath: "songs/Funky_(mood)/Brand-New.mp3"},
        {songName: "Why Not Meri Jaan Song Mp3 Download Young Stunners.mp3", filePath: "songs/Angry_(mood)/Why Not Meri Jaan Song Mp3 Download Young Stunners.mp3"},
    ]
    
    // for (let index = 0; index < as.length; index++) {
    //     const element = as[index];
    //     console.log(element);
    //     if(element.href.endsWith(".mp3")){
    //         songs.push(element.href.split(`/${folder}/`)[1])
    //     }
        
    // }
    // console.log(songs);
    // show all the song in the playlist
    let songUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.songName}</div>
                                <div>Sameer</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
         </li>`;
    }
    // attach an Event listner to each song
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", (element)=>{
            // console.log(element);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
}

const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/song/" + track)
    let trackNum =0;
    for (let index = 0; index < songs.length; index++) {
        if (songs[index].songName==track) {
            trackNum = index;
            break;
        }
        
    }
    console.log(songs[trackNum].filePath);
    currentSong.src = songs[trackNum].filePath
    console.log(track);
    if(!pause){
        currentSong.play();
        
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
function changingAlbums(){
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        console.log(e);
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
}
async function displayAlbums() {
    let a = await fetch(`songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    // console.log(div);
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    // Array.from(anchors).forEach(async e=>{
        // console.log(e.href);
        // })
        
        // console.log(e.href);
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            // console.log(array[index].href);
            
            if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            // console.log(e.href);

            let coverfolder = e.href.split("/").slice(-1)[0]; 
            // get the meta data of the folder
            let a = await fetch(`songs/${coverfolder}/info.json`);
            let response = await a.json();
            // console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${coverfolder}" class="card">
            <div class="play">
                <div>
                    <svg width="16" height ="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141834" stroke-width="1.5" stroke-linejoin="round" fill="#000"/>
                    </svg>
                </div>
            </div>
            <img src="/songs/${coverfolder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    };
    // Load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => { 
            // console.log(e);
            e.addEventListener("click", async item => {
                console.log("Fetching Songs")
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
                // playMusic((songs[0].replaceAll("%20"," ")),true)
            })
        })

}
async function main() {
    // get the list of all the songs
    await getSongs("songs/ncs");
    // console.log(songs[0].replaceAll("%20"," "));
    // playMusic(songs[0],true)
    // playMusic((songs[0].replaceAll("%20"," ").trim()),true)
    // Display all the album on the page
    await displayAlbums();
    // attach an event listner to play,next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })
    // listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${
            secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left= (currentSong.currentTime/ currentSong.duration) * 100 + "%"
    })

    //add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left= percent +"%";
        currentSong.currentTime = (currentSong.duration *percent)/100
    })
    //add an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })
    //add an event listner for close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-130%"
    })
    // add an event listner to previous 
    previous.addEventListener("click", ()=>{
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        
        if((index-1)>=0){
    
            playMusic(songs[index-1]);
        }
    })
    // add an event listner to next 
    next.addEventListener("click", ()=>{
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        
        if((index+1)<songs.length){

            playMusic(songs[index+1]);
        }
    })
    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("setting value to " + e.target.value);
        currentSong.volume = (e.target.value/100)
        if (currentSong.volume>0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg","volume.svg");
        }
        else{
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("volume.svg","mute.svg");
        }
        // currentSong.setVolume(parseInt(e.target.value/100))
    })
    //add event listner to mute in volume button
    document.querySelector(".volume>img").addEventListener("click", e=>{
        console.log(e.target.src);
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg","mute.svg");
            currentSong.volume == 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg" ,"volume.svg");
            currentSong.volume == 0.5;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        }
    });
    
}

main();
 