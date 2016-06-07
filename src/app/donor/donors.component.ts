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
import { MapService } from '../map/map.service';

@Component({
  selector: 'bdfy-donors',
  providers: [MapService],
  directives: [MapComponent, NewDonorComponent],
  template: require('./donors.html')
})
export class DonorsComponent implements OnInit {
  showNewDonorPopup = new BehaviorSubject(false);
  donors: Observable<Donor[]>;
  tempCoords: Coords;
  tempAddress: string;

  constructor(protected donorService: DonorService, protected mapService: MapService) {
    // Bind to donors observable
    this.donors = donorService.donors;
  }

  ngOnInit(): any {
    this.donorService.loadDonors();
  }

  onMapClick(e) {
    this.tempCoords = {lat: e.mapPoint.latitude.toPrecision(9), lng: e.mapPoint.longitude.toPrecision(9)};
    this.mapService.locationToAddress(e.mapPoint).then(d => this.tempAddress = d.address.Address);
    this.showNewDonorPopup.next(true);
  }

  onMapPositionChange(e) {
    console.log('position', e);
  }
}
