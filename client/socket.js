

const config = {
  iceServers: [{ url: 'stun:stun2.1.google.com:19302' },
  {url:'stun:stun01.sipphone.com'},
  {url:'stun:stun.ekiga.net'},
  {url:'stun:stun.fwdnet.net'},
  {url:'stun:stun.ideasip.com'},
  {url:'stun:stun.iptel.org'},
  {url:'stun:stun.rixtelecom.se'},
  {url:'stun:stun.schlund.de'},
  {url:'stun:stun.l.google.com:19302'},
  {url:'stun:stun1.l.google.com:19302'},
  {url:'stun:stun2.l.google.com:19302'},
  {url:'stun:stun3.l.google.com:19302'},
  {url:'stun:stun4.l.google.com:19302'}]
};

export function createPeerConnection (state, socket, roomName) {
  this.pc = new RTCPeerConnection(config);
  this.pc.onicecandidate = handleIceCandidate;
  this.pc.onaddstream = handleRemoteStreamAdded;
  this.pc.onremovestream = handleRemoteStreamRemoved;
  console.log(state.userMediaObject);
  console.log(socket)
  this.pc.addStream(state.userMediaObject);
  if (this.isInitiator) {
      this.pc.createOffer().then(offer => {
          return this.pc.setLocalDescription(offer);
      }).then(() => {
          console.log('localdes:', this.pc.localDescription);
          socket.emit('signal', this.pc.localDescription, this.state.roomName);
      });
  } else {
      console.log('not initiator pc:', this.pc);
  }
}

export function handleIceCandidate (event) {
  console.log(socket)
  console.log('handleIceCandidate event: ', event);
  if (event.candidate) {
      console.log('have cand');
      // this.pc.addIceCandidate(new RTCIceCandidate(event.candidate))
      socket.send({
          type: 'candidate',
          candidate: event.candidate.candidate
      })
  } else {
      console.log('End of candidates.');
  }
}

export function doAnswer (socket, roomName) {
  this.pc.createAnswer().then(answer => {
      return this.pc.setLocalDescription(answer);
  }).then(() => {
      socket.emit('signal', this.pc.localDescription, roomName);
  });
}

export function handleRemoteStreamAdded (event) {
  remoteStream.src = window.URL.createObjectURL(stream);
}

function handleRemoteStreamRemoved () {
  
  }

