import { CHANGEITEMS } from './types';

export const changeItems = items => (
  {
    type: CHANGEITEMS,
    payload: items,
  }
);
