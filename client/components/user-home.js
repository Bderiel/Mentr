import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import DatePicker from 'react-date-picker';
// import DatePicker from 'react-date-picker/dist/entry.nostyle';

import { createPeerConnection, doAnswer } from '../socket.js';
import VideoFeed from './VideoFeed'
/**
 * COMPONENT
 */
export class UserHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: props.email,
      appointment: props.appointment,
      date: ''
  
    }
   
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
    <VideoFeed/>
        
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
