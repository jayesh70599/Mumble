

const socket = io('/');
const videoGrid = document.getElementById('stream__box');
const myVideo = document.createElement('video');
myVideo.muted = true;
const memberList = document.getElementById("member__list");

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
});


let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      })
    })
    socket.on('user-connected', (userId) => {
      connectToNewUser(userId, stream);
    });

    let text = $('input');

$('html').keydown((e) => {
  if(e.which == 13 && text.val().length !== 0){
    socket.emit('messageContent', {
      Sender: Name,
      msg: text.val()
    });
    text.val('');
  }
});

socket.on('createMessage', message => {
  $('ul').append(`<li class="message"><b>${message.Sender}</b><br/>${message.msg}</li>`);
  scrollToBottom();
})
})

peer.on('open', (id) => {
    socket.emit('join-room', ROOM_ID, id, Name);
})

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video);
  //   var element = document.createElement("div");
  //   element.id = "member__1__wrapper";
  //   element.className = "member__wrapper";
  
  //  element.innerHTML = `
  //   <span class="green__icon"></span>
  //   <p class="member_name">${name}</p>`;

  //   memberList.append(element);
}

const scrollToBottom = () => {
  let d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    //setUnmuteButton();
  } else {
    //setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    //setPlayVideo()
  } else {
    //setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
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

const leave = () =>{
  window.location = "/";
}