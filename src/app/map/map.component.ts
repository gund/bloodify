/**
 * Created by alex on 6/6/16.
 */

import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

const AGS_MAP = require('esri/Map');
const AGS_MAP_VIEW = require('esri/views/MapView');
const AGS_GRAPH_LAYER = require('esri/layers/GraphicsLayer');
const AGS_LOCATE_WID = require('esri/widgets/Locate');
const AGS_SEARCH_WID = require('esri/widgets/Search');

const MAP_CLASS = 'bdfy-map';

@Component({
  selector: 'bdfy-map',
  providers: [],
  template: `<div id="{{ mapId }}" class="${MAP_CLASS}"></div>`
})
export class MapComponent<Pins> implements OnInit, AfterViewInit {
  static mapCount = 0;

  @Input() basemap = 'streets';
  @Input() maxZoom = 20;
  @Input() minZoom = 2;
  @Input() locateEnabled = true;
  @Input() locatePosition = 'top-left';
  @Input() searchEnabled = true;
  @Input() searchPosition = 'top-left';
  @Input() pins: Observable<Pins>;
  @Output() pinSelected = new EventEmitter<Pins>();
  @Output() positionChanged = new EventEmitter();

  mapId: string;
  map: __esri.Map;
  view: __esri.MapView;
  graphicsLayer: __esri.GraphicsLayer;
  locateBtn: __esri.Locate;
  searchBox: __esri.Search;

  constructor() {
    this.mapId = MAP_CLASS + (MapComponent.mapCount++).toString();
  }

  ngOnInit(): any {
  }

  ngAfterViewInit(): any {
    this.initMap();
    this.initView();
    this.initGraphicsLayer();
    if (this.locateEnabled) this.initLocateBtn();
    if (this.searchEnabled) this.initSearchBox();
  }

  viewDidInit() {
    if (this.locateEnabled) this.locateBtn.locate();
  }

  initMap() {
    this.map = new AGS_MAP({
      basemap: this.basemap
    });
  }

  initView() {
    this.view = new AGS_MAP_VIEW({
      container: this.mapId,
      map: this.map,
      constraints: {
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        rotationEnabled: false
      }
    });

    this.view.then(() => this.viewDidInit());
  }

  initGraphicsLayer() {
    this.graphicsLayer = new AGS_GRAPH_LAYER();
    this.map.add(this.graphicsLayer);
  }

  initLocateBtn() {
    this.locateBtn = new AGS_LOCATE_WID({
      view: this.view,
      graphicsLayer: this.graphicsLayer
    });
    this.locateBtn.startup();
    this.view.ui.add(this.locateBtn, {
      position: this.locatePosition,
      index: 1
    });
  }

  initSearchBox() {
    this.searchBox = new AGS_SEARCH_WID({
      view: this.view
    });
    this.view.ui.add(this.searchBox, {
      position: this.searchPosition,
      index: 0
    });
  }
}
