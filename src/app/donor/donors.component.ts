/**
 * Created by alex on 6/5/16.
 */

import {
  Component, OnInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Donor } from './donor.store';
import { DonorService } from './donor.service';

let Map = require('esri/Map');

@Component({
  selector: 'bdfy-donors',
  providers: [],
  template: require('./donors.html')
})
export class DonorsComponent implements OnInit {
  donors: Observable<Donor[]>;

  constructor(protected donorService: DonorService) {
    // Bind to donors observable
    this.donors = donorService.donors;
  }

  ngOnInit(): any {
    this.donorService.loadDonors();

    let map = new Map('content', {basemap: 'streets'});
    console.log('Map', map);
  }
}
