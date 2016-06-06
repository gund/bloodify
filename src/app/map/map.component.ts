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
  @Output() positionChanged = new EventEmitter<__esri.Extent>();
  @Output() clicked = new EventEmitter<any>();

  mapId: string;

  constructor(protected mapService: MapService) {
    this.mapId = `${MAP_CLASS}-${MapComponent.mapsCount++}`;
  }

  ngOnInit(): any {
    // Transfer events from map service to outputs
    this.mapService.click.subscribe(e => this.clicked.emit(e));
    this.mapService.positionChange.subscribe(e => this.positionChanged.emit(e));
  }

  ngAfterViewInit(): any {
    this.mapService
      .initialize({container: this.mapId})
      .withSearchBox()
      .withLocateBtn()
      .locateOnInit();
  }
}
