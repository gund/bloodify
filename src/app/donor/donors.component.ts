/**
 * Created by alex on 6/5/16.
 */

import { Component } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Donor } from './donor.store';
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
export class DonorsComponent {
  showNewDonorPopup = new BehaviorSubject(false);
  donors: Observable<Donor[]>;
  tempCoords: number[];
  tempAddress: string;
  extentStream = new BehaviorSubject<__esri.Extent>(null);

  constructor(protected donorService: DonorService, protected mapService: MapService) {
    // Bind to donors observable
    this.donors = donorService.donors;

    this.extentStream
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(ext => this.loadDonorsForExtent(ext));
  }

  onMapClick(e) {
    this.tempCoords = [e.mapPoint.longitude, e.mapPoint.latitude];
    this.mapService.locationToAddress(e.mapPoint).then(d => this.tempAddress = d.address.Address);
    this.showNewDonorPopup.next(true);
  }

  onMapPositionChange(e) {
    this.extentStream.next(e);
  }

  onMapViewInit(view) {
    this.extentStream.next(view.extent);
  }

  loadDonorsForExtent(extent: __esri.Extent) {
    if (!extent) return;

    let latLng1 = MapService.xyToLatLng(extent.xmin, extent.ymin),
      latLng2 = MapService.xyToLatLng(extent.xmax, extent.ymin),
      latLng3 = MapService.xyToLatLng(extent.xmax, extent.ymax),
      latLng4 = MapService.xyToLatLng(extent.xmin, extent.ymax);

    this.donorService.loadDonorsFor(
      latLng1[1], latLng1[0],
      latLng2[1], latLng2[0],
      latLng3[1], latLng3[0],
      latLng4[1], latLng4[0]
    );
  }
}
