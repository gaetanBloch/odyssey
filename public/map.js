const go = () => {
    const ignKey = 'choisirgeoportail';

    const ignOLLayer = new ol.layer.VectorTile({
        title: "Plan IGN vecteur",
        visible: true,
        opacity: 0.8,
        source: new ol.source.VectorTile({
            format: new ol.format.MVT(),
            url: `https://wxs.ign.fr/${ignKey}/geoportail/tms/1.0.0/PLAN.IGN/{z}/{x}/{y}.pbf`,
            tileGrid : ol.tilegrid.createXYZ({
                // extent : [minx, miny, maxx, maxy],
                maxZoom : 22,
                minZoom : 1,
                tileSize : 256
            }),
        }),
        attributions: '<a href="https://geoservices.ign.fr/documentation/geoservices/vecteur-tuile.html">&copy; IGN</a>',
        declutter: false
    });

    
    const fetchStyle = async () => {
        let plan = await fetch(
            `ign/classique.json`
            // `https://wxs.ign.fr/${ignKey}/static/vectorTiles/styles/PLAN.IGN/classique.json`
        );
        const style = await plan.json();
        const setStyle = async () => {
            olms.applyStyle(ignOLLayer, style, "plan_ign");
        };
        map.addLayer(ignOLLayer);
        if (ignOLLayer.getSource()) {
            await setStyle();
        } else {
            ignOLLayer.once("change:source", setStyle);
        }
        
    }

    const map = new ol.Map({
        layers: [
            new ol.layer.GeoportalWMTS({
                layer : "ORTHOIMAGERY.ORTHOPHOTOS"
            })
        ],
        target: document.getElementById('map'),
        view: new ol.View({
            center: [287963, 5948655],
            zoom: 6,
        })
    });

    fetchStyle()
    .then()
    .catch(console.error);
}

// Connection to Geoportail server
Gp.Services.getConfig({
    serverUrl: "./ign/autoconf.js",
    callbackSuffix: "",
    onSuccess: go
});


