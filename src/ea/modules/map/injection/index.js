import { OlContributionHandler } from '../components/olMap/handler/contribution/OlContributionHandler';
import { OlGeoFeatureLayerHandler } from '../components/olMap/handler/geofeature/OlGeoFeatureLayerHandler';

export const eaMapModule = ($injector) => {
	$injector
		.register('OlGeoFeatureLayerHandler', OlGeoFeatureLayerHandler)
		.register('OlContributionHandler', OlContributionHandler);
};
