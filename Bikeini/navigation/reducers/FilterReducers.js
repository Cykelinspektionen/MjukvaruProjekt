import { CHANGEITEMS } from '../actions/types';

const ITEMS_STATE = {
  checkBoxes: [
    {
      category: 'Color',
      items:
        [{ title: 'Blå', isChecked: false },
          { title: 'Röd', isChecked: false },
          { title: 'Svart', isChecked: false },
          { title: 'Vit', isChecked: false },
          { title: 'Grön', isChecked: false }],
    },
    {
      category: 'Type',
      items:
        [{ title: 'Damcykel', isChecked: false },
          { title: 'Cruiser', isChecked: false }],
    },
  ],
  categories: ['Color', 'Type'],
};

const filterReducer = (state = ITEMS_STATE, action) => {
  let { checkBoxes } = state;
  const { categories } = state;
  switch (action.type) {
    case CHANGEITEMS:
      checkBoxes = action.payload;
      return {
        checkBoxes, categories,
      };
    default:
      return state;
  }
};

export default filterReducer;
