console.log("Welcome to Spotify");

document.addEventListener('DOMContentLoaded', ()=>{
    //Initialize the variables
    let songIndex = 0;
    let audioElement = new Audio('songs/1.mp3');
    let masterPlay = document.getElementById('masterPlay');
    let myProgressBar = document.getElementById('myProgressBar');
    let gif = document.getElementById('gif');
    let masterSongName = document.getElementById('masterSongName');
    let songItems = Array.from(document.getElementsByClassName('songItem'));
    let song =[
        {songName: "Warriyo - Mortals [NCS Release]", filePath: "songs/1.mp3", coverPath: "covers/1.jpg"},
        {songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/2.jpg"},
        {songName: "DEAF KEV - Invincible [NCS Release]-320k", filePath: "songs/3.mp3", coverPath: "covers/3.jpg"},
        {songName: "Different Heaven & EH!DE - My Heart [NCS Release]", filePath: "songs/4.mp3", coverPath: "covers/4.jpg"},
        {songName: "anji-Heroes-Tonight-feat-Johnning-NCS-Release", filePath: "songs/5.mp3", coverPath: "covers/5.jpg"},
        {songName: "Rabba - Salam-e-Ishq", filePath: "songs/6.mp3", coverPath: "covers/6.jpg"},
        {songName: "Sakhiyaan - Salam-e-Ishq", filePath: "songs/7.mp3", coverPath: "covers/7.jpg"},
        {songName: "Bhula Dena - Salam-e-Ishq", filePath: "songs/8.mp3", coverPath: "covers/8.jpg"},
        {songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "songs/9.mp3", coverPath: "covers/9.jpg"},
        {songName: "Na Jaana - Salam-e-Ishq", filePath: "songs/10.mp3", coverPath: "covers/10.jpg"}
    ]
    
    songItems.forEach((element, i) =>{
         element.getElementsByTagName("img")[0].src = song[i].coverPath;
         element.getElementsByClassName("songName")[0].innerText = song[i].songName;
    })
    
    // Set initial song name display
    if(masterSongName){
        masterSongName.innerText = song[0].songName;
    }
    // audioElement.play(); 
    
    //Handle play/pause click
masterPlay.addEventListener('click', ()=>{
    if(audioElement.paused || audioElement.currentTime<=0){
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
        // Update song name display
        if(masterSongName){
            masterSongName.innerText = song[songIndex].songName;
        }
    }
    else{
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
})
//Listening to events
audioElement.addEventListener('timeupdate', ()=>{
     //update seekbar
    progress = parseInt(audioElement.currentTime/audioElement.duration*100);
    myProgressBar.value = progress;
})

myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100;
})

// Auto play next song when current song ends
audioElement.addEventListener('ended', ()=>{
    if(songIndex >= 9){
        songIndex = 0;
    } else {
        songIndex += 1;
    }
    audioElement.src = `songs/${songIndex+1}.mp3`;
    masterSongName.innerText = song[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    gif.style.opacity = 1;
    
    // Update the play button icon for the current song
    makeAllPlays();
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
        if(parseInt(element.id) === songIndex){
            element.classList.remove('fa-play-circle');
            element.classList.add('fa-pause-circle');
        }
    })
})

const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle');
    })
}

// Handle song item click (on song name or anywhere in the item)
songItems.forEach((element, index) => {
    element.addEventListener('click', (e) => {
        // Don't trigger if clicking the play button directly
        if(e.target.classList.contains('songItemPlay')){
            return;
        }
        
        // If this song is already playing, toggle pause/play
        if(songIndex === index && !audioElement.paused){
            audioElement.pause();
            let playButton = element.querySelector('.songItemPlay');
            playButton.classList.remove('fa-pause-circle');
            playButton.classList.add('fa-play-circle');
            masterPlay.classList.remove('fa-pause-circle');
            masterPlay.classList.add('fa-play-circle');
            gif.style.opacity = 0;
            return;
        }
        
        // Otherwise, play the selected song
        makeAllPlays();
        songIndex = index;
        let playButton = element.querySelector('.songItemPlay');
        playButton.classList.remove('fa-play-circle');
        playButton.classList.add('fa-pause-circle');
        audioElement.src = `songs/${songIndex+1}.mp3`;
        masterSongName.innerText = song[songIndex].songName;
        audioElement.currentTime = 0; 
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
    })
})

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
    element.addEventListener('click', (e)=>{
        console.log(e.target);
        e.stopPropagation(); // Prevent triggering parent click
        
        // Check if this song is already playing
        if(songIndex === parseInt(e.target.id) && !audioElement.paused){
            // If playing, pause it
            audioElement.pause();
            e.target.classList.remove('fa-pause-circle');
            e.target.classList.add('fa-play-circle');
            masterPlay.classList.remove('fa-pause-circle');
            masterPlay.classList.add('fa-play-circle');
            gif.style.opacity = 0;
            return;
        }
        
        // Otherwise, play the song
        makeAllPlays();
        songIndex = parseInt(e.target.id);
        e.target.classList.remove('fa-play-circle');
        e.target.classList.add('fa-pause-circle');
        audioElement.src = `songs/${songIndex+1}.mp3`;
        masterSongName.innerText = song[songIndex].songName;
        audioElement.currentTime = 0; 
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
    })
})

document.getElementById('next').addEventListener('click',()=>{
    if(songIndex>=9){
        songIndex = 0;
    }       
    else{
    songIndex += 1;
    }
    audioElement.src = `songs/${songIndex+1}.mp3`;
    masterSongName.innerText = song[songIndex].songName;
    audioElement.currentTime = 0; 
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    gif.style.opacity = 1;

})
document.getElementById('previous').addEventListener('click',()=>{
    if(songIndex<=0){
        songIndex = 0;
    }       
    else{
    songIndex -= 1;
    }
    audioElement.src = `songs/${songIndex+1}.mp3`;
    masterSongName.innerText = song[songIndex].songName;
    audioElement.currentTime = 0; 
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    gif.style.opacity = 1;

})
});