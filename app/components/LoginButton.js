import React from 'react';
import AuthActions from '../actions/AuthActions';
import AuthStore from '../stores/AuthStore';
import {Link} from 'react-router';


class LoginButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = AuthStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    AuthStore.listen(this.onChange);
    AuthActions.getCurrentUser();
  }

  componentWillUnmount() {
    AuthStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
  	if (this.state.current_user){
        return    (<li className='dropdown'>
                      <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Welcome, {this.state.current_user.first_name}! <span className='caret'></span></a>
                      <ul className='dropdown-menu'>
                        <li><Link to='/bracket'>My Bracket</Link></li>
                        <li><a href="/logout">Logout</a></li>
                      </ul>
                  </li>);
  	 }
    else {
   		return <li><a href="/auth/facebook">Login</a></li>;
  	}
  }
}



export default LoginButton;