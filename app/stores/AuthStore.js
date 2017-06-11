import alt from '../alt';
import AuthActions from '../actions/AuthActions';


class AuthStore {
  constructor() {
    this.bindActions(AuthActions);
    this.current_user = {};
  }

  onGetCurrentUser(){
    this.current_user = {};
  }

  onGetCurrentUserSuccess(data) {
    this.current_user = data;
  }

  onGetCurrentUserFail(jqXhr) {
    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
  }

}

export default alt.createStore(AuthStore);