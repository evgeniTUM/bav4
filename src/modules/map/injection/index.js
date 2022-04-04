import { OlMeasurementHandler } from '../components/olMap/handler/measure/OlMeasurementHandler';
import { OlGeolocationHandler } from '../components/olMap/handler/geolocation/OlGeolocationHandler';
import { OlContributionHandler } from '../components/olMap/handler/contribution/OlContributionHandler';
import { OlHighlightLayerHandler } from '../components/olMap/handler/highlight/OlHighlightLayerHandler';
import { VectorLayerService } from '../components/olMap/services/VectorLayerService';
import { LayerService } from '../components/olMap/services/LayerService';
import { StyleService } from '../components/olMap/services/StyleService';
import { OverlayService } from '../components/olMap/services/OverlayService';
import { OlDrawHandler } from '../components/olMap/handler/draw/OlDrawHandler';
import { InteractionStorageService } from '../components/olMap/services/InteractionStorageService';
import { OlFeatureInfoHandler } from '../components/olMap/handler/featureInfo/OlFeatureInfoHandler';

export const mapModule = ($injector) => {
	$injector
		.registerSingleton('StyleService', new StyleService())
		.register('OlMeasurementHandler', OlMeasurementHandler)
		.register('OlDrawHandler', OlDrawHandler)
		.register('OlGeolocationHandler', OlGeolocationHandler)
		.register('OlContributionHandler', OlContributionHandler)
		.register('OlHighlightLayerHandler', OlHighlightLayerHandler)
		.register('VectorLayerService', VectorLayerService)
		.register('LayerService', LayerService)
		.register('InteractionStorageService', InteractionStorageService)
		.register('OverlayService', OverlayService)
		.register('OlFeatureInfoHandler', OlFeatureInfoHandler);
};
