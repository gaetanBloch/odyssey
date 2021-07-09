const ignKey = 'choisirgeoportail';

const ignOLLayer = new ol.layer.VectorTile({
    title: "Plan IGN vecteur",
    visible: true,
    source: new ol.source.VectorTile({
        format: new ol.format.MVT(),
        url: `https://wxs.ign.fr/${ignKey}/geoportail/tms/1.0.0/PLAN.IGN/{z}/{x}/{y}.pbf`,
    }),
    attributions: '<a href="https://geoservices.ign.fr/documentation/geoservices/vecteur-tuile.html">&copy; IGN</a>',
    declutter: false
});

const fetchStyle = async () => {
    const plan = await fetch(
        `classique.json`
    );
    const style = await plan.json();
    olms.applyStyle(ignOLLayer, style, "plan_ign");
}

var map = new ol.Map({
    layers: [ignOLLayer],
    target: document.getElementById('map'),
    view: new ol.View({
        center: [287963, 5948655],
        zoom: 6,
    })
});

fetchStyle().catch(console.error);

