/**
 * Created by alex on 6/4/16.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers } from '@angular/http';
import { Store } from '@ngrx/store';

import { AppStore } from '../app.store';
import { Donor } from './donor.store';
import { getApi } from '../config';

const HEADER = {
  headers: new Headers({
    'Content-Type': 'application/json'
  })
};

const toJson = JSON.stringify;
const resToJsonData = (res: Response) => res.json().data;
const payloadToAction = (action: string) => (payload) => ({type: action, payload});

@Injectable()
export class DonorService {
  donors: Observable<Donor[]>;

  constructor(protected http: Http,
              protected store: Store<AppStore>) {
    this.donors = <Observable<Donor[]>>store.select('donors');
  }

  loadDonors() {
    this.http
      .get(getApi('/donor'), HEADER)
      .map(resToJsonData)
      .map(payloadToAction('ADD_DONORS'))
      .subscribe((action) => this.dispatchAction(action));
  }

  saveDonor(donor: Donor) {
    (donor._id) ? this.updateDonor(donor) : this.createDonor(donor);
  }

  createDonor(donor: Donor) {
    this.http
      .post(getApi('/donor'), toJson({donor: donor}), HEADER)
      .map(resToJsonData)
      .map(payloadToAction('CREATE_DONOR'))
      .subscribe(this.dispatchAction);
  }

  updateDonor(donor: Donor) {
    if (!donor.hash) return;
    this.http
      .put(getApi(`/donor/${donor.hash}`), toJson({donor: donor}), HEADER)
      .subscribe(() => this.dispatchAction(payloadToAction('UPDATE_DONOR')(donor)));
  }

  deleteDonor(donor: Donor) {
    if (!donor.hash) return;
    this.http
      .delete(getApi(`/donor/${donor.hash}`))
      .subscribe(() => this.dispatchAction(payloadToAction('DELETE_DONOR')(donor)));
  }

  protected dispatchAction(action) {
    console.log('dispatching...', action);
    this.store.dispatch(action);
  }
}
