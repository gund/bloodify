/**
 * Created by alex on 6/6/16.
 */

import {
  Component, Input, Output, EventEmitter, AfterViewInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MapService } from './map.service';

const MAP_CLASS = 'bdfy-map';

@Component({
  selector: 'bdfy-map',
  providers: [MapService], // MapService instance per component
  template: `<div id="{{ mapId }}" class="${MAP_CLASS}"></div>`
})
export class MapComponent<Pins> implements AfterViewInit {
  static mapsCount = 0;

  @Input() pins: Observable<Pins>;
  @Output() pinSelected = new EventEmitter<Pins>();
  @Output() positionChanged: EventEmitter<__esri.Extent>;
  @Output() clicked: EventEmitter<any>;
  @Output() viewInit: EventEmitter<any>;

  mapId: string;

  constructor(protected mapService: MapService) {
    this.mapId = `${MAP_CLASS}-${MapComponent.mapsCount++}`;

    // Transfer events from map service to outputs
    this.clicked = this.mapService.click;
    this.positionChanged = this.mapService.positionChange;
    this.viewInit = this.mapService.viewInit;
  }

  ngAfterViewInit(): any {
    this.mapService
      .initialize({container: this.mapId})
      .withSearchBox()
      .withLocateBtn()
      .locateOnInit();
  }
}
