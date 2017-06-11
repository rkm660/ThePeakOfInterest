import alt from '../alt';

class AuthActions {
    constructor() {
        this.generateActions(
            'getCurrentUserSuccess',
            'getCurrentUserFail'
        );
    }

    getCurrentUser() {
        return (dispatch) => {
            dispatch()
            $.ajax({ url: '/current_user' })
                .done((data) => {
                    this.actions.getCurrentUserSuccess(data)
                })
                .fail((jqXhr) => {
                    this.actions.getCurrentUserFail(jqXhr)
                });
        }
    }

}

export default alt.createActions(AuthActions);
