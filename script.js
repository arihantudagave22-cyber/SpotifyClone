console.log("Welcome to Spotify");

document.addEventListener('DOMContentLoaded', ()=>{
    //Initialize the variables
    let songIndex = 0;
    let audioElement = new Audio('songs/1.mp3');
    let masterPlay = document.getElementById('masterPlay');
    let myProgressBar = document.getElementById('myProgressBar');
    let gif = document.getElementById('gif');
    let masterSongName = document.getElementById('masterSongName');
    let currentTimeDisplay = document.getElementById('currentTime');
    let totalTimeDisplay = document.getElementById('totalTime');
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
    
    // Format time in MM:SS format (define early so we can use it)
    const formatTime = (seconds) => {
        if(isNaN(seconds)) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    
    songItems.forEach((element, i) =>{
         element.getElementsByTagName("img")[0].src = song[i].coverPath;
         element.getElementsByClassName("songName")[0].innerText = song[i].songName;
    })
    
    // Load duration for all songs in the list
    song.forEach((songData, index) => {
        let tempAudio = new Audio(songData.filePath);
        tempAudio.addEventListener('loadedmetadata', () => {
            let timeStamps = document.getElementsByClassName('timeStamp');
            if(timeStamps[index]){
                timeStamps[index].innerText = formatTime(tempAudio.duration);
            }
        });
    });
    
    // Initialize liked songs array from localStorage
    let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
    
    // Load liked status for all songs
    likedSongs.forEach(index => {
        let likeBtn = document.getElementById(`like${index}`);
        if(likeBtn){
            likeBtn.classList.remove('fa-regular');
            likeBtn.classList.add('fa-solid', 'liked');
        }
    });
    
    // Add like button functionality
    Array.from(document.getElementsByClassName('songItemLike')).forEach((element, index) => {
        element.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering parent click
            
            let likeIndex = parseInt(element.id.replace('like', ''));
            
            // Toggle like status
            if(element.classList.contains('liked')){
                // Unlike
                element.classList.remove('fa-solid', 'liked');
                element.classList.add('fa-regular');
                likedSongs = likedSongs.filter(idx => idx !== likeIndex);
            } else {
                // Like
                element.classList.remove('fa-regular');
                element.classList.add('fa-solid', 'liked');
                if(!likedSongs.includes(likeIndex)){
                    likedSongs.push(likeIndex);
                }
            }
            
            // Save to localStorage
            localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
        })
    });
    
    // Add play/pause button functionality
    Array.from(document.getElementsByClassName('songPlayPauseBtn')).forEach((element) => {
        element.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering parent click
            
            let buttonIndex = parseInt(element.id.replace('playPause', ''));
            
            // Check if this song is already playing
            if(songIndex === buttonIndex && !audioElement.paused){
                // If playing, pause it
                audioElement.pause();
                return;
            }
            
            // Check if this song is paused (same song but paused)
            if(songIndex === buttonIndex && audioElement.paused){
                // Resume playing
                audioElement.play();
                return;
            }
            
            // Otherwise, play a different song
            songIndex = buttonIndex;
            audioElement.src = `songs/${songIndex+1}.mp3`;
            masterSongName.innerText = song[songIndex].songName;
            audioElement.currentTime = 0; 
            audioElement.play();
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
            gif.style.opacity = 1;
            highlightCurrentSong();
        })
    });
    
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
    
    // Update current time display
    if(currentTimeDisplay){
        currentTimeDisplay.innerText = formatTime(audioElement.currentTime);
    }
    if(totalTimeDisplay && audioElement.duration){
        totalTimeDisplay.innerText = formatTime(audioElement.duration);
    }
})

myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100;
})

// Update total time when metadata is loaded
audioElement.addEventListener('loadedmetadata', ()=>{
    if(totalTimeDisplay && audioElement.duration){
        totalTimeDisplay.innerText = formatTime(audioElement.duration);
    }
})

// Update button icons when audio plays
audioElement.addEventListener('play', ()=>{
    updateSongButtons();
})

// Update button icons when audio pauses
audioElement.addEventListener('pause', ()=>{
    updateSongButtons();
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
    
    // Update the play button icons for the current song
    highlightCurrentSong();
    updateSongButtons();
})

// Highlight currently playing song in the list
const highlightCurrentSong = ()=>{
    songItems.forEach((item, index) => {
        if(index === songIndex){
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    })
}

// Update all song buttons according to current playback state
const updateSongButtons = ()=>{
    Array.from(document.getElementsByClassName('songPlayPauseBtn')).forEach((element)=>{
        const id = parseInt(element.id.replace('playPause', ''));
        if(id === songIndex && !audioElement.paused){
            // Currently playing - show pause icon
            element.classList.remove('fa-play-circle');
            element.classList.add('fa-pause-circle');
        } else {
            // Not playing or paused - show play icon
            element.classList.remove('fa-pause-circle');
            element.classList.add('fa-play-circle');
        }
    })
}

// Handle song item click (on song name or album cover)
songItems.forEach((element, index) => {
    element.addEventListener('click', (e) => {
        // Don't trigger if clicking buttons directly
        if(e.target.classList.contains('songPlayPauseBtn') || e.target.classList.contains('songItemLike')){
            return;
        }
        
        // Play this song
        songIndex = index;
        audioElement.src = `songs/${songIndex+1}.mp3`;
        masterSongName.innerText = song[songIndex].songName;
        audioElement.currentTime = 0; 
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
        highlightCurrentSong();
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
    highlightCurrentSong();
    updateSongButtons();

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
    highlightCurrentSong();
    updateSongButtons();

})
});