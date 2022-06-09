import { OlContributionHandler } from '../components/olMap/handler/contribution/OlContributionHandler';
import { OlGeoFeatureLayerHandler } from '../components/olMap/handler/geofeature/OlGeoFeatureLayerHandler';
import { OlWmsActionsLayerHandler } from '../components/olMap/handler/wmsActions/OlWmsActionsLayerHandler';

export const eaMapModule = ($injector) => {
	$injector
		.register('OlGeoFeatureLayerHandler', OlGeoFeatureLayerHandler)
		.register('OlContributionHandler', OlContributionHandler)
		.register('OlWmsActionsLayerHandler', OlWmsActionsLayerHandler);
};
