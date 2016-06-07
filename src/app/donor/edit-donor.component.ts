/**
 * Created by alex on 6/7/16.
 */

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RouteParams } from '@angular/router-deprecated';
import { Location } from '@angular/common';

import { Coords, Donor } from './donor.store';
import { DonorService } from './donor.service';
import { NewDonorComponent } from './new-donor.component';

@Component({
  selector: 'bdfy-edit-donor',
  providers: [],
  directives: [NewDonorComponent],
  template: require('./edit-donor.html')
})

export class EditDonorComponent implements OnInit {
  showNewDonorPopup = new BehaviorSubject(false);
  coords: Coords;
  address: string;
  donor = new BehaviorSubject(null);
  hash: string;
  isLoading = true;

  constructor(protected donorService: DonorService, routeParams: RouteParams, location: Location) {
    this.hash = routeParams.get('hash');

    if (!this.hash) {
      location.go('/');
      return null;
    }
  }

  ngOnInit(): any {
    this.donorService.loadDonorByHash(this.hash).then(
      (donor: Donor) => {
        this.isLoading = false;
        this.coords = donor.coord;
        this.address = donor.address;
        this.donor.next(donor);
        this.showNewDonorPopup.next(true);
      },
      this.handleError
    );
  }

  //noinspection JSMethodCanBeStatic
  handleError(error) {
    if (error.data) alert(error.data);
    else if (error.status === 404) alert('Donor not found');
    else alert('Unknown error');
  }
}
