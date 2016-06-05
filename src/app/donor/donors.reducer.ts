/**
 * Created by alex on 6/4/16.
 */

// Redux reducer for Donors

export const donors = (state: any = [], {type, payload}) => {
  switch (type) {
    case 'ADD_DONOR':
      return payload; // New income array

    case 'CREATE_DONOR':
      return [...state, payload]; // Concatenate

    case 'UPDATE_DONOR':
      return state.map(donor => donor._id === payload._id ?
        Object.assign({}, donor, payload) : // Update
        donor // Return as is
      );

    case 'DELETE_DONOR':
      return state.filter(donor => donor._id !== payload._id); // Remove

    default:
      return state;
  }
};
