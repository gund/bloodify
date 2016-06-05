/**
 * Created by alex on 6/5/16.
 */

import {
  it,
  describe,
  expect
} from '@angular/core/testing';

import { donors } from './donors.reducer';

describe('Donors', () => {

  describe('`donors` store', () => {
    let initialState = [
      {_id: 0, firstName: 'First Donor'},
      {_id: 1, firstName: 'Second Donor'}
    ];

    it('should return empty array by default', () => {
      let defaultState = donors(undefined, {type: 'random', payload: {}});

      expect(defaultState).toEqual([]);
    });

    it('`ADD_DONOR`', () => {
      let payload = initialState,
        stateItems = donors([], {type: 'ADD_DONOR', payload: payload});

      expect(stateItems).toEqual(payload);
    });

    it('`CREATE_DONOR`', () => {
      let payload = {_id: 2, firstName: 'Added Donor'},
        result = [...initialState, payload],
        stateItems = donors(initialState, {type: 'CREATE_DONOR', payload: payload});

      expect(stateItems).toEqual(result);
    });

    it('`UPDATE_DONOR`', () => {
      let payload = {_id: 1, firstName: 'Updated Donor'},
        result = [initialState[0], {_id: 1, firstName: 'Updated Donor'}],
        stateItems = donors(initialState, {type: 'UPDATE_DONOR', payload: payload});

      expect(stateItems).toEqual(result);
    });

    it('`DELETE_DONOR`', () => {
      let payload = {_id: 0},
        result = [initialState[1]],
        stateItems = donors(initialState, {type: 'DELETE_DONOR', payload: payload});

      expect(stateItems).toEqual(result);
    });
  });

});
