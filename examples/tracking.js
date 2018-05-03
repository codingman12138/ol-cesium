/**
 * @module examples.tracking
 */
const exports = {};
/* eslint googshift/valid-provide-and-module: 0 */
import OLCesium from 'olcs/OLCesium.js';
import olView from 'ol/View.js';
import {defaults as olControlDefaults} from 'ol/control.js';
import olSourceOSM from 'ol/source/OSM.js';
import olLayerTile from 'ol/layer/Tile.js';
import olSourceVector from 'ol/source/Vector.js';
import olLayerVector from 'ol/layer/Vector.js';
import olStyleIcon from 'ol/style/Icon.js';
import olStyleStyle from 'ol/style/Style.js';
import olFeature from 'ol/Feature.js';
import olGeomPoint from 'ol/geom/Point.js';
import olMap from 'ol/Map.js';


const point = new olGeomPoint([700000, 200000, 100000]);

const iconFeature = new olFeature({
  geometry: point
});


const iconStyle = new olStyleStyle({
  image: new olStyleIcon(/** @type {olx.style.IconOptions} */ ({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    opacity: 0.75,
    src: 'data/icon.png'
  }))
});

iconFeature.setStyle(iconStyle);


const vectorSource2 = new olSourceVector({
  features: [iconFeature]
});
const vectorLayer2 = new olLayerVector({
  renderMode: 'image',
  source: vectorSource2
});


const map = new olMap({
  layers: [
    new olLayerTile({
      source: new olSourceOSM()
    }),
    vectorLayer2
  ],
  target: 'map2d',
  controls: olControlDefaults({
    attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
      collapsible: false
    })
  }),
  view: new olView({
    center: [0, 0],
    zoom: 2
  })
});


const ol3d = new OLCesium({map/*, target: 'map3d'*/});
const scene = ol3d.getCesiumScene();
const terrainProvider = new Cesium.CesiumTerrainProvider({
  url: '//assets.agi.com/stk-terrain/world',
  requestVertexNormals: false
});
scene.terrainProvider = terrainProvider;
ol3d.setEnabled(true);

let tracking = false;
function toggleTracking() { // eslint-disable-line no-unused-vars
  tracking = !tracking;
  ol3d.trackedFeature = tracking ? iconFeature : undefined;
}

setInterval(() => {
  const old = point.getCoordinates();
  point.setCoordinates([
    old[0] + 1000 * Math.random(),
    old[1] + 1000 * Math.random(),
    old[2]
  ]);
  iconFeature.changed();
}, 100);


export default exports;
