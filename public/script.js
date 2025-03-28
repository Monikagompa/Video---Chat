const socket = io('/')
const videoGrid = document.getElementById('video-grid');
console.log(videoGrid);
const myVideo = document.createElement('video');
myVideo.muted=true;

const peers=[]

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

const user = prompt("Enter your name");


let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    
    peer.on('call', call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',userVideoStream => {
            addVideoStream(video,userVideoStream)
        })
    })

   
    socket.on('user-connected',userId=>{
        console.log("New user connected...")
        //connectToNewUser(userId, stream)
        setTimeout(connecToNewUser,1000,userId,stream)
    });
   
   
})
socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })

peer.on('open', id => {
    socket.emit('join-room',ROOM_ID,id,user);
})




const connecToNewUser = (userId,stream) => {
  const call = peer.call(userId,stream)
  const video = document.createElement('video')
  call.on('stream',userVideoStream => {
      addVideoStream(video,userVideoStream)
  })
  call.on('close',() => {
      video.remove()
  })
   peers[userId] =call
}


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',() => {
        video.play();
    })
   videoGrid.append(video);
}
// let text= $('input')
// $('html').keydown((e) => {
//     if(e.which == 13 && text.val().length !== 0) {
//         console.log(text.val())
//         socket.emit('message', text.val());
//         text.val('')
//     }
// });

// socket.on("createMessage", message => {
//     $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
//     scrollToBottom()
//   })

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});


socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          userName === user ? "me" : userName
        }</span> </b>
        <span>${message}</span>
    </div>`;
});

const scrollToBottom = () => {
    var d= $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }

  const playStop = () => {
    
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }

 
