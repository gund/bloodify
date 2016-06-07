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
  coord: number[];
  ip: string;
}

export interface Blood {
  type: BloodType;
  rh: BloodRh;
}

export type BloodType = 'O' | 'A' | 'B' | 'AB';
export type BloodRh = '+' | '-';

export const createDonor = (coord?: number[]): Donor => ({
  firstName: '',
  lastName: '',
  number: null,
  email: '',
  blood: {type: 'O', rh: '+'},
  address: '',
  coord: coord || [0, 0],
  ip: ''
});
