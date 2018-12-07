import { CHANGEITEMS } from '../actions/types';

/*
 * Key: type (FOUND or STOLEN)          <- Gotten from Browser-state
    Key: brand (string)                 ¤ not implemented yet ¤
    Key: model (string)                 ¤ not implemented yet ¤
    Key: color (string)                 ~ need to be fixed ~
    Key: frame_number (number)          ¤ not implemented yet ¤
    Key: antitheft_code (string)        ¤ not implemented yet ¤
    Key: male (bool)
    Key: female (bool)
    Key: child (bool)
    Key: sport (bool)
    Key: tandem (bool)
    Key: basket (bool)
    Key: rack (bool)
    Key: mudguard (bool)
    Key: chain_protection (bool)
    Key: net (bool)
    Key: winter_tires (bool)
    Key: light (bool)

*/

const ITEMS_STATE = {
  checkBoxes: [
    /* {
      category: 'Brand',
      items:
        [{ title: 'Monark', isChecked: false },
          { title: 'Merida', isChecked: false },
          { title: 'Cresent', isChecked: false },
          { title: 'Scott', isChecked: false },
          { title: 'Mountainbike', isChecked: false }],
    },
    {
      category: 'Color',
      items:
        [{ title: 'Red', isChecked: false },
          { title: 'Green', isChecked: false },
          { title: 'Blue', isChecked: false },
          { title: 'Yellow', isChecked: false }],
    }, */
    {
      category: 'Type',
      items:
        [{ title: 'Female bike', data: 'female', isChecked: false },
          { title: 'Male bike', data: 'male', isChecked: false },
          { title: 'Kids bike', data: 'child', isChecked: false },
          { title: 'Sports bike', data: 'sport', isChecked: false },
          { title: 'Tandem bike', data: 'tandem', isChecked: false }],
    },
    {
      category: 'Other',
      items:
         [{ title: 'Basket', data: 'basket', isChecked: false },
           { title: 'Mudguard', data: 'mudguard', isChecked: false },
           { title: 'Chain protection', data: 'chain_protection', isChecked: false },
           { title: 'Net', data: 'net', isChecked: false },
           { title: 'Winter tires', data: 'winter_tires', isChecked: false },
           { title: 'Lamp', data: 'light', isChecked: false }],
    },
  ],
  categories: ['Type', 'Other'],
  searchOptions: {
    frameNumber: '',
    antiTheftCode: '',
    brand: '',
    model: '',
    color: '',
  },
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
