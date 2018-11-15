import { CHANGEITEMS } from '../actions/types';

const ITEMS_STATE = {
  checkBoxes: [
    { id: 0, title: 'Blå', isChecked: false },
    { id: 1, title: 'Röd', isChecked: false },
    { id: 2, title: 'Svart', isChecked: false },
    { id: 3, title: 'Grön', isChecked: false },
  ],
};

const filterReducer = (state = ITEMS_STATE, action) => {
  let { checkBoxes } = state;
  switch (action.type) {
    case CHANGEITEMS:
      checkBoxes = action.payload;
      return {
        checkBoxes,
      };
    default:
      return state;
  }
};

export default filterReducer;
