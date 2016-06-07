/**
 * Created by alex on 6/5/16.
 */

import {
  Component, OnInit
} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Donor, Coords } from './donor.store';
import { DonorService } from './donor.service';
import { MapComponent } from '../map/map.component';
import { NewDonorComponent } from './new-donor.component';

@Component({
  selector: 'bdfy-donors',
  providers: [],
  directives: [MapComponent, NewDonorComponent],
  template: require('./donors.html')
})
export class DonorsComponent implements OnInit {
  showNewDonorPopup = new BehaviorSubject(false);
  donors: Observable<Donor[]>;
  tempCoords: Coords;

  constructor(protected donorService: DonorService) {
    // Bind to donors observable
    this.donors = donorService.donors;
  }

  ngOnInit(): any {
    this.donorService.loadDonors();
  }

  onMapClick(e) {
    console.log(e);
    this.tempCoords = {lat: e.mapPoint.latitude.toPrecision(9), lng: e.mapPoint.longitude.toPrecision(9)};
    this.showNewDonorPopup.next(true);
  }

  onMapPositionChange(e) {
    console.log('position', e);
  }
}
