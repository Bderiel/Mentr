import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import DatePicker from 'react-date-picker';
import { Skillz } from './';

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
      mentors: [],
      mentorFilter:[],
    }
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  addEvent() {
    axios.post('/api/users/event', this.state.date)
      .then(() => {
        this.setState({
          appointment: [...this.state.appointment, this.state.date],
        })
      })
  }

  componentDidMount() {
    axios.get('/api/users/mentor')
      .then(mentors => {
        mentors = mentors.data
        this.setState({
          mentors
        })
      })
  }

  onChange(date,name){
    console.log(date)
    let newDate = date.toString().slice(0, 16)
    console.log(newDate,'new')
    this.setState({
      date:newDate
    })
  }

  handleChange(evt){
    const filter = evt.target.value.toLowerCase();
    const { mentors } = this.state;
    this.setState({
      mentorFilter: mentors.filter(mentor => {
        return (mentor.skills.filter(el=>{
          return(el.toLowerCase().match(filter))
        })).length
      })
    })
  }

  render() {
    console.log(this.state.date, 'state')
    // const {email,appointment} = this.props
    const { mentors, mentorFilter, date} = this.state;
    return (
      <div className="container-s">
        <div className="flex" >
          <div id="appointments">
            <h4>UPCOMING APPOINTMENTS</h4>
            <div id="appointment-title-button">
              <DatePicker
                onChange={this.onChange}
                value={''}
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
          <div className="skillz">
            <input onChange={this.handleChange} id="search" />
            {mentorFilter.length ? mentorFilter.map(mentor => {
              return (
                <Skillz date={date} dateChange={this.onChange} key={mentor.id} name={mentor.email} image={mentor.image} skills={mentor.skills} />
              )
            }) : null
            }
          </div>
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
