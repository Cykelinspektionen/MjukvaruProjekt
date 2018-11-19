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
          { title: 'Herrcykel', isChecked: false },
          { title: 'Barncykel', isChecked: false },
          { title: 'Sportcykel', isChecked: false },
          { title: 'Tandemcykel', isChecked: false }],
    },
    {
      category: 'Other',
      items:
         [{ title: 'Korg', isChecked: false },
           { title: 'Stänkskydd', isChecked: false },
           { title: 'Kedjeskydd', isChecked: false },
           { title: 'Nät', isChecked: false },
           { title: 'Vinterdäck', isChecked: false },
           { title: 'Light?', isChecked: false }],
    },
  ],
  categories: ['Color', 'Type', 'Other'],
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
