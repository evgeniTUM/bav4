import { OlSelectLocationHandler } from '../components/olMap/handler/selection/OlSelectLocationHandler';
import { OlGeoFeatureLayerHandler } from '../components/olMap/handler/geofeature/OlGeoFeatureLayerHandler';

export const eaMapModule = ($injector) => {
	$injector.register('OlGeoFeatureLayerHandler', OlGeoFeatureLayerHandler).register('OlSelectLocationHandler', OlSelectLocationHandler);
};
