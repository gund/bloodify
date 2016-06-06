/**
 * Created by alex on 6/6/16.
 */

import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MapService } from './map.service';

const MAP_CLASS = 'bdfy-map';

@Component({
  selector: 'bdfy-map',
  providers: [MapService], // MapService instance per component
  template: `<div id="{{ mapId }}" class="${MAP_CLASS}"></div>`
})
export class MapComponent<Pins> implements OnInit, AfterViewInit {
  static mapsCount = 0;

  @Input() pins: Observable<Pins>;
  @Output() pinSelected = new EventEmitter<Pins>();
  @Output() positionChanged = new EventEmitter();

  mapId: string;
  map: __esri.Map;
  view: __esri.MapView;
  graphicsLayer: __esri.GraphicsLayer;
  locateBtn: __esri.Locate;
  searchBox: __esri.Search;

  constructor(protected mapService: MapService) {
    this.mapId = MAP_CLASS + (MapComponent.mapsCount++).toString();
  }

  ngOnInit(): any {
    this.mapService.click.subscribe(e => console.log(e));
  }

  ngAfterViewInit(): any {
    this.mapService
      .initialize({container: this.mapId})
      .withSearchBox()
      .withLocateBtn()
      .locateOnInit();
  }
}
