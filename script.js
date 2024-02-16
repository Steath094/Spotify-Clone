console.log("Lets write JavaScript");
let currentSong=new Audio();;
let songs;
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
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/song/");
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/song/")[1])
        }
        
    }
    return songs;
}

const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/song/" + track)
    currentSong.src = "/song/" + track
    if(!pause){
        currentSong.play();
        
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
async function main() {
    
    // get the list of all the songs
    songs = await getSongs();
    playMusic(songs[0],true)
    // show all the song in the playlist
    let songUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
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
        e.addEventListener("click touchstart",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })

    // attach an event listner to play,next and previous
    play.addEventListener("click touchstart", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })
    currentSong.addEventListener("timeupdate",(a)=>{
        document.querySelector(".songtime").innerHTML = `${
            secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left= (currentSong.currentTime/ currentSong.duration) * 100 + "%"
    })

    //add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click touchstart",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left= percent +"%";
        currentSong.currentTime = (currentSong.duration *percent)/100
    })
    //add an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click touchstart",()=>{
        document.querySelector(".left").style.left = "0"
    })
    //add an event listner for close button
    document.querySelector(".close").addEventListener("click touchstart",()=>{
        document.querySelector(".left").style.left = "-130%"
    })
    // add an event listner to previous 
    previous.addEventListener("click touchstart",()=>{
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        
        if((index-1)>=0){
    
            playMusic(songs[index-1]);
        }
    })
    // add an event listner to next 
    next.addEventListener("click touchstart",()=>{
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        
        if((index+1)<songs.length){

            playMusic(songs[index+1]);
        }
    })
    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting value to " + e.target.value);
        currentSong.volume = (e.target.value/100)
        // currentSong.setVolume(parseInt(e.target.value/100))
    })
}

main();
 