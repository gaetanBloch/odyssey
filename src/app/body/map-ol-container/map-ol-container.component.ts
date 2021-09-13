import { Component, OnDestroy, OnInit } from '@angular/core';

import { Map, View } from 'ol';
import { createXYZ } from 'ol/tilegrid';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import TileLayer from 'ol/layer/Tile';
import VectorTileSource from 'ol/source/VectorTile';
import GeoJSON from 'ol/format/GeoJSON';
import { OSM, Vector } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';

// @ts-ignore
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
// @ts-ignore
import { applyStyle } from 'ol-mapbox-style';
// @ts-ignore
import * as Gp from 'geoportal-extensions-openlayers';

import { GeolocationService } from '../../services/geolocation.service';
import { ItineraryService } from '../../services/itinerary.service';
import { Subject, Subscription } from 'rxjs';
import { Fill, Stroke, Circle, Style } from 'ol/style';
import { WKT } from 'ol/format';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-map-container',
  templateUrl: './map-ol-container.component.html',
  styleUrls: ['./map-ol-container.component.scss']
})
export class MapOlContainerComponent implements OnInit, OnDestroy {
  private readonly ignKey = 'choisirgeoportail';
  private map?: Map;
  private view?: View;

  // Subject for unsubscription
  private readonly $destroy = new Subject();

  constructor(
    private geoService: GeolocationService,
    private itineraryService: ItineraryService
  ) {

    this.geoService.onPointSet()
      .pipe(takeUntil(this.$destroy))
      .subscribe((point) => {
      this.map?.getLayers().getArray()
        .filter(layer => layer.get('title') === 'point')
        .forEach(layer => this.map?.removeLayer(layer));
      const image = new Circle({
        radius: 7,
        fill: new Fill({ color: 'rgba(0,0,0,0.6)' }),
        stroke: new Stroke({ color: 'rgba(0,0,0,0.6)', width: 1 })
      });

      // @ts-ignore
      const styleFunction = function(feat) {
        // @ts-ignore
        return styles[feat.getGeometry().getType()];
      };

      const styles = {
        'Point': new Style({
          image: image
        })
      };

      const vectorSource = new Vector({
        features: new GeoJSON().readFeatures(point, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        })
      });
      const vectorLayer = new VectorLayer({
        // @ts-ignore
        title: 'point',
        source: vectorSource,
        style: styleFunction
      });
      this.map?.addLayer(vectorLayer);

      const feature = vectorSource.getFeatures()[0];
      const target = feature.getGeometry();
      // @ts-ignore
      console.log(target.getCoordinates());
      // @ts-ignore
      this.view?.fit(target, { padding: [50, 50, 50, 50], minResolution: 3 });
    });

    this.itineraryService.onItinerarySet()
      .pipe(takeUntil(this.$destroy))
      .subscribe((itinerary) => {
      this.map?.getLayers().getArray()
        .filter(layer => layer.get('title') === 'itinerary')
        .forEach(layer => this.map?.removeLayer(layer));
      const format = new WKT();
      const feature = format.readFeature(itinerary, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });
      const vectorSource = new Vector({ features: [feature] });
      const vectorLayer = new VectorLayer({
        // @ts-ignore
        title: 'itinerary',
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0,0,0,0.7)',
            width: 3,
          }),
        }),
      });
      this.map?.addLayer(vectorLayer);
      this.view?.fit(
        vectorSource.getExtent(),
        { padding: [50, 50, 50, 50], minResolution: 3 }
      );
    });
  }

  // Display MapLayers
  private displayLayers = (): void => {
    const lsControl = new LayerSwitcher({
      collapsed: true,
      reordering: false,
      selection: true
    });
    this.map?.addControl(lsControl);

    // OpenStreetMap Layer
    const osmLayer = new TileLayer({
      // @ts-ignore
      title: 'Raster OSM',
      baseLayer: true,
      source: new OSM()
    });
    this.map?.addLayer(osmLayer);

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
          maxZoom: 22,
          minZoom: 1,
          tileSize: 256
        }),
        attributions: [
          '<a href="https://geoservices.ign.fr/documentation/geoservices/vecteur-tuile.html">© IGN</a></br>',
          '<a href="https://github.com/gaetanbloch">© GBloch</a>'
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
  };

  // Init component
  ngOnInit(): void {
    this.view = new View({
      center: [287963, 5948655],
      zoom: 6,
      constrainResolution: true,
      maxZoom: 22,
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
    });
    this.map = new Map({
      target: 'map',
      view: this.view
    });

    // Connection to Geoportal server
    Gp.Services.getConfig({
      // Or download the file from https://ignf.github.io/geoportal-access-lib/latest/jsdoc/tutorial-optimize-getconfig.html
      apiKey: this.ignKey,
      onSuccess: this.displayLayers
    });
  }

  ngOnDestroy(): void {
    // Unsubscriptions
    this.$destroy.next();
    this.$destroy.complete();
  }
}
