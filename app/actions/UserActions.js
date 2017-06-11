import alt from '../alt';

class UserActions {
  constructor() {
    this.generateActions(
      'getUserSuccess',
      'getUserFail'
    );
  }

  getUser(userID) {
    $.ajax({ url: '/api/users/' + userID })
      .done((data) => {
        this.actions.getUserSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getUserFail(jqXhr);
      });
  }

}

export default alt.createActions(UserActions);