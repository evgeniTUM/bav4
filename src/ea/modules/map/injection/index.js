import { OlGeoFeatureLayerHandler } from '../components/olMap/handler/geofeature/OlGeoFeatureLayerHandler';

export const eaMapModule = ($injector) => {
	$injector
		.register('OlGeoFeatureLayerHandler', OlGeoFeatureLayerHandler);
};
