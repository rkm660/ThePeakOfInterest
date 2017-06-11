import React from 'react';
import UserStore from '../stores/UserStore';
import UserActions from '../actions/UserActions'

class Bracket extends React.Component {
  constructor(props) {
    super(props);
    this.state = UserStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    UserStore.listen(this.onChange);
    //UserActions.getUser(this.props.params.id);
  }

  componentWillUnmount() {
    UserStore.unlisten(this.onChange);
    $(document.body).removeClass();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.id !== this.props.params.id) {
      UserActions.getUser(this.props.params.id);
    }
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='container'>
        
      </div>
    );
  }
}

export default Bracket;