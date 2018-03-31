import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import axios from 'axios'
import DatePicker from 'react-date-picker';
// import DatePicker from 'react-date-picker/dist/entry.nostyle';

/**
 * COMPONENT
 */
export class UserHome extends Component{
  constructor(props){
    super(props)
    this.state={
      email:props.email,
      appointment:props.appointment,
      date: new Date()
    }
  }
  
  addEvent(){
    console.log("STATE DATE", this.state.date)
    axios.post('api/users/event', {date:this.state.date})
    .then(()=>{
      this.setState({
        appointment:[...this.state.appointment, this.state.date]
      })
    })
  }

  onChange(date){
    let newDate = date.toString().slice(0,16)
    this.setState({
      date:newDate
    })
  }
  
  render(){
    // const {email,appointment} = this.props
    return(
      <div>
        {/* <h3>Welcome, {(this.state.email && this.state.email.split('@'))[0]}</h3> */}
        <div id="appointments">
          <h4>UPCOMING APPOINTMENTS</h4>
          <div id="appointment-title-button">
            <DatePicker
              onChange={this.onChange.bind(this)}
              value={this.state.date}
            />
            <button id="add-button" onClick={this.addEvent.bind(this)}>ADD</button>
          </div>
          <ul id="upcoming">
            {
              this.state.appointment.length && this.state.appointment.map((date, index) => {
                return (
                  <li key={index} className="appointment-date">{date}</li>
                )
              })
            }
          </ul>
        </div>
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
    appointment:state.user.appointment
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
