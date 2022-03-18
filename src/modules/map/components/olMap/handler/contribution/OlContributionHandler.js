import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { Vector as VectorSource } from 'ol/source';
import { translate } from 'ol/transform';
import { $injector } from '../../../../../../injection';
import { setLocation, setTaggingMode } from '../../../../../../store/ea/contribute/contribute.action';
import { observe } from '../../../../../../utils/storeUtils';
import { HelpTooltip } from '../../HelpTooltip';
import { OlLayerHandler } from '../OlLayerHandler';
import { geolocationStyleFunction, taggingStyleFunction } from './styleUtils';





export const CONTRIBUTION_LAYER_ID = "contribution_layer_id";

export class OlContributionHandler extends OlLayerHandler {

	constructor() {
		super(CONTRIBUTION_LAYER_ID, { preventDefaultClickHandling: false, preventDefaultContextClickHandling: false });
		const { StoreService } = $injector.inject('StoreService');
		this._helpTooltip = new HelpTooltip();
		this._storeService = StoreService;
		this._positionFeature = new Feature();
		this._taggingFeature = new Feature();
		this._layer = null;
		this._map = null;

		this._listeners = [];
	}


	/**
	 * Activates the Handler.
	 * @override
	 */
	onActivate(olMap) {
		if (this._layer === null) {
			const source = new VectorSource({ wrapX: false, features: [this._positionFeature, this._taggingFeature] });
			this._layer = new VectorLayer({
				source: source
			});
		}
		this._map = olMap;

		this._unregister = this._register(this._storeService.getStore());
		this._helpTooltip.messageProvideFunction = () => "Standort markieren";
		this._helpTooltip.activate(this._map);

		return this._layer;
	}

	/**
	 *  @override
	 *  @param {Map} olMap
	 */
	onDeactivate(/*eslint-disable no-unused-vars */olMap) {
		this._layer = null;
		this._map = null;
		this._helpTooltip.deactivate();
		this._unregister();
	}

	_register(store) {

		const onClick = (event) => {
			const position = event.coordinate;
			if (!position)
				return;
			setLocation(position);
			this._positionFeature.setStyle(geolocationStyleFunction);
			this._positionFeature.setGeometry(new Point(position));
			this._map.renderSync();
		};

		const onMove = (event) => {
			this._helpTooltip.notify(event);

			const position = event.coordinate;
			if (!position)
				return;
			this._taggingFeature.setStyle(taggingStyleFunction);
			this._taggingFeature.setGeometry(new Point(position));
		};

		this._listeners.push(this._map.on(MapBrowserEventType.CLICK, onClick));
		this._listeners.push(this._map.on(MapBrowserEventType.POINTERMOVE, onMove));
		return observe(store, state => state.pointer.click, onClick);
	}
}
