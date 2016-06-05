import { Donor } from './donor/donor.store';

// We are dealing with a single object that has:
//   * An `donors` collection
export interface AppStore {
  donors: Donor[];
}
