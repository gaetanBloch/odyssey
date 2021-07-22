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
            constrainResolution: true,
            maxZoom: 21,
            minZoom: 0,
            resolutions : [156543.033928041, 78271.51696402048, 39135.758482010235, 19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282, 611.49622628141, 305.7481131407048, 152.8740565703525, 76.43702828517624, 38.21851414258813, 19.10925707129406, 9.554628535647032, 4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395, 0.2985821417389697, 0.1492910708694849, 0.0746455354347424]
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


