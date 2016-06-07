/**
 * Created by alex on 6/4/16.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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

  loadDonors(): Promise<any> {
    let obs = this.http
      .get(getApi('/donor'), HEADER)
      .map(resToJsonData);
    obs
      .map(payloadToAction('ADD_DONORS'))
      .subscribe(action => this.dispatchAction(action));
    return obs.toPromise();
  }

  loadDonorByHash(hash: string) {
    let obs = this.http
      .get(getApi(`/donor/link/${hash}`))
      .map(resToJsonData);
    return obs.toPromise();
  }

  saveDonor(donor: Donor): Promise<any> {
    return (donor._id) ? this.updateDonor(donor) : this.createDonor(donor);
  }

  createDonor(donor: Donor): Promise<any> {
    let obs = this.http
      .post(getApi('/donor'), toJson({donor: donor}), HEADER)
      .map(resToJsonData);
    obs
      .map(payloadToAction('CREATE_DONOR'))
      .subscribe(action => this.dispatchAction(action));
    return obs.toPromise();
  }

  updateDonor(donor: Donor): Promise<any> {
    if (!donor.hash) return Promise.reject('No hash');
    let obs = this.http.put(getApi(`/donor/${donor.hash}`), toJson({donor: donor}), HEADER);
    obs.subscribe(() => this.dispatchAction(payloadToAction('UPDATE_DONOR')(donor)));
    return obs.map(resToJsonData).toPromise();
  }

  deleteDonor(donor: Donor): Promise<any> {
    if (!donor.hash) return Promise.reject('No hash');
    let obs = this.http.delete(getApi(`/donor/${donor.hash}`));
    obs.subscribe(() => this.dispatchAction(payloadToAction('DELETE_DONOR')(donor)));
    return obs.map(resToJsonData).toPromise();
  }

  protected dispatchAction(action) {
    this.store.dispatch(action);
  }
}
