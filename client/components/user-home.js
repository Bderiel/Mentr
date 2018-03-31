import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import DatePicker from 'react-date-picker';
// import DatePicker from 'react-date-picker/dist/entry.nostyle';

import { createPeerConnection, doAnswer } from '../socket.js';
import io from 'socket.io-client'

const socket = io(window.location.origin)

/**
 * COMPONENT
 */
export class UserHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: props.email,
      appointment: props.appointment,
      date: '',
      userVidSource: '',
      userMediaObject: {},
      roomName: '',
      roomTaken: false,
      remoteVidSource: ''
    }
    this.handleVideoSource = this.handleVideoSource.bind(this);
    this.createPeerConnection = createPeerConnection.bind(this);
    this.doAnswer = doAnswer.bind(this)
  }

  componentDidMount() {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(this.handleVideoSource)
        .catch(console.log);

      socket.on('connect', () => {
        console.log('Connected!, My Socket Id:', socket.id);
      });
      socket.on('roomTaken', (msg) => {
        console.log(msg);
        this.setState({ roomName: '' })
        document.getElementById('roomTaken').innerHTML = msg;
      });
      socket.on('someoneJoinedTheRoom', () => {
        console.log('someone joined');
        this.isInitiator = true;
        this.createPeerConnection(this.state, socket, this.state.roomName);
        console.log('pc after someone joined:', this.pc);
      });
      socket.on('signal', message => {
        if (message.type === 'offer') {
          console.log('received offer:', message);
          this.pc.setRemoteDescription(new RTCSessionDescription(message));


          this.doAnswer(socket, this.state.roomName);
          this.pc.onaddstream = e => {
            console.log('onaddstream', e);
            this.remoteStream = e.stream;
            this.remote = window.URL.createObjectURL(this.remoteStream);
            this.setState({ remoteVidSource: this.remote });
            //both video feeds are running so alert the room
            socket.emit('ready', this.state.roomName);
          };
        }
        else if (message.type === 'answer') {
          console.log('received answer:', message);
          this.pc.setRemoteDescription(new RTCSessionDescription(message));
          // when the other side added a media stream, show it on screen
          this.pc.onaddstream = e => {
            console.log('onaddstream', e);
            this.remoteStream = e.stream;
            this.remote = window.URL.createObjectURL(this.remoteStream);
            this.setState({ remoteVidSource: this.remote });
            //both video feeds are running so alert the room
            socket.emit('ready', this.state.roomName);
          };
        }
        else if (message.type === 'candidate') {
          this.pc.addIceCandidate(
            new RTCIceCandidate({
              sdpMLineIndex: message.mlineindex,
              candidate: message.candidate
            })
          );
        }
      });

    }
  }


  componentWillUnmount() {
    navigator.getUserMedia({ audio: false, video: true },
      function (stream) {
        var track = stream.getTracks()[0];  // if only one media track
        // ...
        track.stop();
      },
      function (error) {
        console.log('getUserMedia() error', error);
      });
  }


  handleVideoSource(mediaStream) {
    this.setState({ userVidSource: window.URL.createObjectURL(mediaStream), userMediaObject: mediaStream });
  }

  roomTaken(msg) {
    document.getElementById('roomTaken').innerHTML = msg;
    this.setState({ roomTaken: true })
  }

  handleNewRoom(event) {
    console.log("Hellowokoisdadsad")
    event.preventDefault();
    this.setState({ roomName: event.target.newRoom.value })
    document.getElementById('roomTaken').innerHTML = '';
    socket.emit('newRoom', event.target.newRoom.value, socket.id);
    console.log('NEW ROOM', event.target.newRoom.value);
    event.target.newRoom.value = '';
  }

  handleJoinRoom(event) {
    event.preventDefault();
    this.createPeerConnection(this.state);
    this.setState({ roomName: event.target.joinRoom.value })
    console.log('pc after join room:', this.pc, this.state);
    socket.emit('joinRoom', event.target.joinRoom.value);
    event.target.joinRoom.value = '';
  }


  addEvent() {
    axios.post('api/users/event')
      .then(() => {
        this.setState({
          appointment: [...this.state.appointment, 'hello'],
          date: new Date()
        })
      })
  }

  render() {
    // const {email,appointment} = this.props
    return (
      <div>
                        <p id = "roomTaken"></p>
         { this.state.roomName ?
          <div> Your are in the {this.state.roomName} room </div>
          :
          <div className='roomForms'>
              <form onSubmit={this.handleNewRoom.bind(this)}>
                  <label>
                      {'Create Room: '}
                      <input type="text" name="newRoom" />
                  </label>
                  <input type="submit" name="submitNew" />
              </form>
              <form onSubmit={this.handleJoinRoom.bind(this)}>
                  <label>
                      {'Join Room: '}
                      <input type="text" name="joinRoom" />
                  </label>
                  <input type="submit" name="submitJoin" />
              </form>
          </div>
          }
        <h3>Welcome, {(this.state && this.state.email.split('@'))[0]}</h3>
        <div id="appointments">
          <h4>UPCOMING APPOINTMENTS</h4>
          <div id="appointment-title-button">
            <DatePicker
              value={this.state.date}
            />
            <button id="add-button" onClick={this.addEvent.bind(this)}>ADD</button>
          </div>
          <ul id="upcoming">
            {
              this.state && this.state.appointment.map((date, index) => {
                return (
                  <li key={index} className="appointment-date">{date}</li>
                )
              })
            }
          </ul>
        </div>
        <video src={this.state.userVidSource} autoPlay />
        {this.state.remoteVidSource &&<video
          ref={(opponent) => this.opponentFeed = opponent}
          width='600px'
          height='480px'
          autoPlay="true"
          src={this.state.remoteVidSource}
        />}
        
      </div>
    )
  }

}


/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email,
    appointment: state.user.appointment
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
