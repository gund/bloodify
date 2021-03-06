/**
 * Created by alex on 6/6/16.
 */

import { Injectable, EventEmitter } from '@angular/core';

const AGS_MAP = require('esri/Map');
const AGS_MAP_VIEW = require('esri/views/MapView');
const AGS_GRAPH_LAYER = require('esri/layers/GraphicsLayer');
const AGS_LOCATE_WID = require('esri/widgets/Locate');
const AGS_SEARCH_WID = require('esri/widgets/Search');
const AGS_LOCATOR_TASK = require('esri/tasks/Locator');
const AGS_WEBMERCATOR: __esri.webMercatorUtils = require('esri/geometry/support/webMercatorUtils');

const GEOCODE_URL = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';

@Injectable()
export class MapService {
  map: __esri.Map;
  view: __esri.MapView;
  graphicsLayer: __esri.GraphicsLayer;
  locateBtn: __esri.Locate;
  searchBox: __esri.Search;
  locator: __esri.Locator = new AGS_LOCATOR_TASK({url: GEOCODE_URL});

  click = new EventEmitter<any>();
  positionChange = new EventEmitter<__esri.Extent>();
  viewInit = new EventEmitter<__esri.MapView>();

  protected _locateEnabled = false;
  protected _locateOnInit = false;

  static xyToLatLng(x: number, y: number) {
    return AGS_WEBMERCATOR.xyToLngLat(x, y);
  }

  initialize(options: MapServiceOptions) {
    this.initMap(options.basemap);
    this.initView(options.container, options.maxZoom, options.minZoom, options.rotationEnabled);
    this.initGraphicsLayer();

    return this;
  }

  withSearchBox(position = 'top-right', index = 0) {
    this.searchBox = new AGS_SEARCH_WID({
      view: this.view
    });
    this.view.ui.add(this.searchBox, {
      position: position,
      index: index
    });

    return this;
  }

  withLocateBtn(position = 'top-left', index = 1) {
    this.locateBtn = new AGS_LOCATE_WID({
      view: this.view,
      graphicsLayer: this.graphicsLayer
    });
    this.locateBtn.startup();
    this.view.ui.add(this.locateBtn, {
      position: position,
      index: index
    });
    this._locateEnabled = true;

    return this;
  }

  locateOnInit() {
    this._locateOnInit = true;
  }

  locationToAddress(mapPoint) {
    return this.locator.locationToAddress(mapPoint, 100);
  }

  protected viewDidInit() {
    // Bind to events
    this.view.on('click', e => this.click.emit(e));
    this.view.watch('extent', e => this.positionChange.emit(e));

    if (this._locateEnabled && this._locateOnInit) this.locateBtn.locate();

    this.viewInit.emit(this.view);
  }

  protected initMap(basemap = 'streets') {
    this.map = new AGS_MAP({
      basemap: basemap
    });
  }

  protected initView(container: string, maxZoom = 20, minZoom = 2, rotationEnabled = false) {
    this.view = new AGS_MAP_VIEW({
      container: container,
      map: this.map,
      constraints: {
        maxZoom: maxZoom,
        minZoom: minZoom,
        rotationEnabled: rotationEnabled
      }
    });

    this.view.then(() => this.viewDidInit());
  }

  protected initGraphicsLayer() {
    this.graphicsLayer = new AGS_GRAPH_LAYER();
    this.map.add(this.graphicsLayer);
  }
}

export interface MapServiceOptions {
  basemap?: string;
  container: string;
  maxZoom?: number;
  minZoom?: number;
  rotationEnabled?: boolean;
}
