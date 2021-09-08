import { Component, OnInit } from '@angular/core';

import { Map, View } from 'ol';
import { createXYZ } from 'ol/tilegrid';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import TileLayer from 'ol/layer/Tile';
import VectorTileSource from 'ol/source/VectorTile';
import OSM from 'ol/source/OSM';

// @ts-ignore
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
// @ts-ignore
import { applyStyle } from 'ol-mapbox-style';
// @ts-ignore
import * as Gp from 'geoportal-extensions-openlayers';

@Component({
  selector: 'app-map-container',
  templateUrl: './map-ol-container.component.html',
  styleUrls: ['./map-ol-container.component.scss']
})
export class MapOlContainerComponent implements OnInit {
  private readonly ignKey = 'choisirgeoportail';
  private map?: Map;

  private go = (): void => {

    // IGN Vector Layer
    const ignOLLayer = new VectorTileLayer({
      // @ts-ignore
      title: 'Vector IGN',
      baseLayer: true,
      visible: false,
      source: new VectorTileSource({
        format: new MVT(),
        url: `https://wxs.ign.fr/${ this.ignKey }/geoportail/tms/1.0.0/PLAN.IGN/{z}/{x}/{y}.pbf`,
        tileGrid: createXYZ({
          maxZoom: 26,
          minZoom: 1,
          tileSize: 512
        }),
        attributions: [
          '<a href="https://geoservices.ign.fr/documentation/geoservices/vecteur-tuile.html">©IGN</a></br>',
          '<a href="https://github.com/gaetanbloch">GBloch</a>'
        ]
      }),
      declutter: true
    });
    this.map?.addLayer(ignOLLayer);

    // Fetch style IIFE
    (async () => {
      const plan = await fetch(
        `https://wxs.ign.fr/${ this.ignKey }/static/vectorTiles/styles/PLAN.IGN/standard.json`
      );
      const style = await plan.json();
      const setStyle = async () => {
        applyStyle(ignOLLayer, style, 'plan_ign');
      };
      if (ignOLLayer.getSource()) {
        await setStyle();
      } else {
        ignOLLayer.once('change:source', setStyle);
      }
    })().catch(console.error);

    // OpenStreetMap Layer
    const osmLayer = new TileLayer({
      // @ts-ignore
      title: 'Raster OSM',
      baseLayer: true,
      source: new OSM()
    });
    this.map?.addLayer(osmLayer);

    const lsControl = new LayerSwitcher({
      collapsed: true,
      reordering: false,
      selection: true,
    });
    this.map?.addControl(lsControl);
  };

  constructor() {
  }

  ngOnInit(): void {
    this.map = new Map({
      target: 'map',
      view: new View({
        center: [287963, 5948655],
        zoom: 6,
        constrainResolution: true,
        maxZoom: 26,
        minZoom: 0,
        resolutions: [
          156543.033928041, 78271.51696402048, 39135.758482010235,
          19567.87924100512, 9783.93962050256, 4891.96981025128,
          2445.98490512564, 1222.99245256282, 611.49622628141,
          305.7481131407048, 152.8740565703525, 76.43702828517624,
          38.21851414258813, 19.10925707129406, 9.554628535647032,
          4.777314267823516, 2.388657133911758, 1.194328566955879,
          0.5971642834779395, 0.2985821417389697, 0.1492910708694849,
          0.0746455354347424
        ]
      })
    });

    // Connection to Geoportal server
    Gp.Services.getConfig({
      // Or download the file from https://ignf.github.io/geoportal-access-lib/latest/jsdoc/tutorial-optimize-getconfig.html
      apiKey: this.ignKey,
      onSuccess: this.go
    });
  }
}
