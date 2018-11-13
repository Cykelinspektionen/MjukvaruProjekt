// Should this maybe be incorporated in a user profile state?
const STOLEN_STATE = {
  missingID: [],
  retrievedID: [],
};

function doSomething(state) {
  return state;
}

const reportStolenReducers = (state = STOLEN_STATE, action) => {
  switch (action.type) {
    case 'ANYTHING':
      return doSomething(state);
    default:
      return state;
  }
};

export default reportStolenReducers;
