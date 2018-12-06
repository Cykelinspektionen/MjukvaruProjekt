import {
  REQUEST_NEW_PASSWORD_BEGIN,
  REQUEST_NEW_PASSWORD_FAILURE,
  REQUEST_NEW_PASSWORD_SUCCESS,
} from '../actions/types';

const RESET_STATE = {
  loadingReset: false,
  passwordResetDone: false,
  error: '',
};

const ResetPasswordReducer = (state = RESET_STATE, action) => {
  switch (action.type) {
    case REQUEST_NEW_PASSWORD_BEGIN:
      return { ...state, loadingReset: true };
    case REQUEST_NEW_PASSWORD_FAILURE:
      return {
        ...state,
        loadingReset: false,
        passwordResetDone: false,
        error: action.payload,
      };
    case REQUEST_NEW_PASSWORD_SUCCESS:
      return { ...state, loadingReset: false, passwordResetDone: true };
    default:
      return state;
  }
};

export default ResetPasswordReducer;
