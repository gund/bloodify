/**
 * Created by alex on 6/4/16.
 */

export interface Donor {
  _id?: string;
  firstName: string;
  lastName: string;
  number: number;
  email: string;
  hash?: string;
  blood: Blood;
  address: string;
  coord: Coords;
  ip: string;
}

export interface Blood {
  type: BloodType;
  rh: BloodRh;
}

export type BloodType = 'O' | 'A' | 'B' | 'AB';
export type BloodRh = '+' | '-';

export interface Coords {
  lat: string;
  lng: string;
}

export const createDonor = (coord?: Coords): Donor => ({
  firstName: '',
  lastName: '',
  number: null,
  email: '',
  blood: {type: 'O', rh: '+'},
  address: '',
  coord: coord || {lat: '', lng: ''},
  ip: ''
});
