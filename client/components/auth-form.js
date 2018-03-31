import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <div className="login-background">
    <div className="container">
      <div className="card card-container">
        <img id="profile-img" className="profile-img-card" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="login" />
        <p id="profile-name" className="profile-name-card" />
      <form className="form-signin" onSubmit={handleSubmit} name={name}>
          <span id="reauth-email" className="reauth-email" />
          <input  type="email" id="inputEmail" className="form-control" placeholder="Email address" name="email" required autoFocus name="email" />
          <input name="password" type="password" id="inputPassword" className="form-control" placeholder="Password" required name="password" />
        <div>
            <div id="remember" className="checkbox">
              <label>
                <input type="checkbox" defaultValue="remember-me" /> Remember me
              </label>
            </div>
        </div>
            <button type="submit" className="btn btn-lg btn-primary btn-block btn-signin">{displayName}</button>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
      </div>
    </div>
    </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit (evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
