import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { OSM, TileDebug } from 'ol/source';
import { OlGeoFeatureLayerHandler } from '../../../../../../../../src/ea/modules/map/components/olMap/handler/geofeature/OlGeoFeatureLayerHandler';
import { GEO_FEATURE_LAYER_ID } from '../../../../../../../../src/ea/plugins/GeoFeaturePlugin';
import { addGeoFeatures } from '../../../../../../../../src/ea/store/geofeature/geofeature.action';
import { geofeatureReducer } from '../../../../../../../../src/ea/store/geofeature/geofeature.reducer';
import { $injector } from '../../../../../../../../src/injection';
import { TestUtils } from '../../../../../../../test-utils.js';



describe('OlGeoFeatureLayerHandler', () => {

    const translationServiceMock = { translate: (key) => key };
    const coordinateServiceMock = {};
    const mapServiceMock = {};

    const setup = (state) => {
        const store = TestUtils.setupStoreAndDi(state, { geofeature: geofeatureReducer });
        $injector
            .registerSingleton('TranslationService', translationServiceMock)
            .registerSingleton('CoordinateService', coordinateServiceMock)
            .registerSingleton('MapService', mapServiceMock);
        return store;
    };

    it('has two methods', () => {
        setup();
        const handler = new OlGeoFeatureLayerHandler();
        expect(handler).toBeTruthy();
        expect(handler.activate).toBeTruthy();
        expect(handler.deactivate).toBeTruthy();
        expect(handler.id).toBe(GEO_FEATURE_LAYER_ID);
    });

    describe('when activated over olMap', () => {
        const initialCenter = fromLonLat([11.57245, 48.14021]);

        const setupMap = () => {
            const container = document.createElement('div');
            return new Map({
                layers: [
                    new TileLayer({
                        source: new OSM()
                    }),
                    new TileLayer({
                        source: new TileDebug()
                    })],
                target: container,
                view: new View({
                    center: initialCenter,
                    zoom: 1
                })
            });
        };

        it('creates a layer to draw', () => {
            const map = setupMap();
            setup();

            const classUnderTest = new OlGeoFeatureLayerHandler();
            const layer = classUnderTest.activate(map);

            expect(layer).toBeTruthy();
        });

        it('fits the map to the layer when a new feature is added', () => {
            const map = setupMap();
            setup();

            const classUnderTest = new OlGeoFeatureLayerHandler();
            const layer = classUnderTest.activate(map);

            addGeoFeatures({ name: "i am a feauture" });


        });

    });
});
