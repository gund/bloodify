/**
 * Created by alex on 6/6/16.
 */

import {
  Component, OnInit, Input, Output, EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

const AGS_MAP = require('esri/Map');
const AGS_MAP_VIEW = require('esri/views/MapView');

const MAP_CLASS = 'bdfy-map';

@Component({
  selector: 'bdfy-map',
  providers: [],
  template: `<div id="{{ mapId }}" class="${MAP_CLASS}"></div>`
})
export class MapComponent<Pins> implements OnInit {
  static mapCount = 0;

  @Input() pins: Observable<Pins>;
  @Input() basemap = 'streets';
  @Output() pinSelected = new EventEmitter<Pins>();
  @Output() positionChanged = new EventEmitter();

  mapId: string;
  map: AGS_MAP;
  mapView: AGS_MAP_VIEW;

  constructor() {
    this.mapId = MAP_CLASS + (MapComponent.mapCount++).toString();
  }

  ngOnInit(): any {
    // Init map
    this.map = new AGS_MAP({
      basemap: this.basemap
    });

    // Init view
    this.mapView = new AGS_MAP_VIEW({
      container: this.mapId,
      map: this.map
    });
  }
}
