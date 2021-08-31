const ignKey = 'choisirgeoportail';
const map = new ol.Map({
  target: document.getElementById('map'),
  view: new ol.View({
    center: [287963, 5948655],
    zoom: 6,
    constrainResolution: true,
    maxZoom: 21,
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
  const ignOLLayer = new ol.layer.VectorTile({
    title: 'Plan IGN vecteur',
    visible: true,
    opacity: 0.8,
    source: new ol.source.VectorTile({
      format: new ol.format.MVT(),
      url: `https://wxs.ign.fr/${ignKey}/geoportail/tms/1.0.0/PLAN.IGN/{z}/{x}/{y}.pbf`,
      tileGrid: ol.tilegrid.createXYZ({
        // extent : [minx, miny, maxx, maxy],
        maxZoom: 22,
        minZoom: 1,
        tileSize: 256,
      }),
    }),
    attributions:
      '<a href="https://geoservices.ign.fr/documentation/geoservices/vecteur-tuile.html">&copy; IGN</a>',
    declutter: true,
  });

  map.addLayer(
    new ol.layer.GeoportalWMTS({
      layer: 'ORTHOIMAGERY.ORTHOPHOTOS',
    })
  );

  // Fetch style IIFE
  (async () => {
    let plan = await fetch(
      // `ign/standard.json`
      `https://wxs.ign.fr/${ignKey}/static/vectorTiles/styles/PLAN.IGN/standard.json`
    );
    const style = await plan.json();
    const setStyle = async () => {
      olms.applyStyle(ignOLLayer, style, 'plan_ign');
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
  serverUrl: './ign/autoconf-https.json',
  callbackSuffix: '',
  onSuccess: go,
});

//

document.getElementById('find').addEventListener('click', async () => {
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const url = `http://wxs.ign.fr/${ignKey}/itineraire/rest/route.json?origin=${origin}&destination=${destination}&method=DISTANCE&graphName=Pieton`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  const wkt = data.geometryWkt;
  const format = new ol.format.WKT();
  const feature = format.readFeature(wkt, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  });
  const vector = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [feature],
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(0,0,0,0.7)',
        width: 3,
      }),
    }),
  });
  map.addLayer(vector);
});
