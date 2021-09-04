// Prevent Babel related errors
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import 'ol/ol.css';
import './styles.scss';
import { Map, View } from 'ol';
import { createXYZ } from 'ol/tilegrid';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
// @ts-ignore
import { applyStyle } from 'ol-mapbox-style';
// @ts-ignore
import * as Gp from 'geoportal-extensions-openlayers';

const ignKey = 'choisirgeoportail';

const map = new Map({
  target: document.getElementById('map'),
  view: new View({
    center: [287963, 5948655],
    zoom: 6,
    constrainResolution: true,
    maxZoom: 26,
    minZoom: 0,
    resolutions: [
      156543.033928041, 78271.51696402048, 39135.758482010235,
      19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564,
      1222.99245256282, 611.49622628141, 305.7481131407048, 152.8740565703525,
      76.43702828517624, 38.21851414258813, 19.10925707129406,
      9.554628535647032, 4.777314267823516, 2.388657133911758,
      1.194328566955879, 0.5971642834779395, 0.2985821417389697,
      0.1492910708694849, 0.0746455354347424,
    ],
  }),
});

const go = () => {
  const ignOLLayer = new VectorTileLayer({
    visible: true,
    opacity: 0.8,
    source: new VectorTileSource({
      format: new MVT(),
      url: `https://wxs.ign.fr/${ignKey}/geoportail/tms/1.0.0/PLAN.IGN/{z}/{x}/{y}.pbf`,
      tileGrid: createXYZ({
        maxZoom: 26,
        minZoom: 1,
        tileSize: 512,
      }),
      attributions: [
        '<a href="https://geoservices.ign.fr/documentation/geoservices/vecteur-tuile.html">©IGN</a></br>',
        '<a href="https://github.com/gaetanbloch">GBloch</a>',
      ],
    }),
    declutter: true,
  });

  map.addLayer(
    new Gp.olExtended.layer.GeoportalWMTS({
      layer: 'ORTHOIMAGERY.ORTHOPHOTOS',
    })
  );

  // Fetch style IIFE
  (async () => {
    const plan = await fetch(
      // `ign/standard.json`
      `https://wxs.ign.fr/${ignKey}/static/vectorTiles/styles/PLAN.IGN/standard.json`
    );
    const style = await plan.json();
    const setStyle = async () => {
      applyStyle(ignOLLayer, style, 'plan_ign');
    };
    map.addLayer(ignOLLayer);
    if (ignOLLayer.getSource()) {
      await setStyle();
    } else {
      ignOLLayer.once('change:source', setStyle);
    }
  })().catch(console.error);
};

// Connection to Geoportal server
Gp.Services.getConfig({
  // Or download the file from https://ignf.github.io/geoportal-access-lib/latest/jsdoc/tutorial-optimize-getconfig.html
  apiKey: ignKey,
  onSuccess: go,
});
