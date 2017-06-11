import alt from '../alt';
import UserActions from '../actions/UserActions';


class UserStore {
  constructor() {
    this.bindActions(UserActions);
  }

}

export default alt.createStore(UserStore);