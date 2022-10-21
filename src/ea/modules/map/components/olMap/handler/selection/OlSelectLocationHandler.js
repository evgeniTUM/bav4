import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { unByKey } from 'ol/Observable';
import { Vector as VectorSource } from 'ol/source';
import { $injector } from '../../../../../../../injection';
import { setLocation } from '../../../../../../store/contribution/contribution.action';
import { observe } from '../../../../../../../utils/storeUtils';
import { HelpTooltip } from '../../../../../../../modules/olMap/tooltip/HelpTooltip';
import { markerStyleFunction } from '../../../../../../../modules/olMap/utils/olStyleUtils';
import { highlightCoordinateFeatureStyleFunction } from '../../../../../../../modules/olMap/handler/highlight/styleUtils';
import { OlLayerHandler } from '../../../../../../../modules/olMap/handler/OlLayerHandler';





export const SELECT_LOCATION_LAYER_ID = 'select_location_layer_id';

export class OlSelectLocationHandler extends OlLayerHandler {

	constructor() {
		super(SELECT_LOCATION_LAYER_ID);
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
		this._helpTooltip.messageProvideFunction = () => 'Standort markieren';

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
		unByKey(this._listeners);
	}

	_register(store) {

		let tagging = false;

		const onClick = (event) => {
			const position = event.coordinate;
			if (!(tagging && position)) {
				return;
			}
			setLocation(position);
			this._positionFeature.setStyle(highlightCoordinateFeatureStyleFunction);
			this._positionFeature.setGeometry(new Point(position));
			this._map.renderSync();
		};

		const onMove = (event) => {
			this._helpTooltip.notify(event);

			const position = event.coordinate;
			if (!(tagging && position)) {
				return;
			}
			this._taggingFeature.setGeometry(new Point(position));
		};

		this._listeners.push(this._map.on(MapBrowserEventType.CLICK, onClick));
		this._listeners.push(this._map.on(MapBrowserEventType.POINTERMOVE, onMove));

		const onTaggingChanged = (taggingMode) => {
			if (taggingMode) {
				this._taggingFeature.setStyle(markerStyleFunction);
				this._helpTooltip.activate(this._map);
				tagging = true;
			}
			else {
				this._taggingFeature.setStyle(() => { });
				this._helpTooltip.deactivate();
				tagging = false;
			}
		};

		onTaggingChanged(store.getState().contribution.tagging);

		return observe(store, state => state.contribution.tagging, onTaggingChanged);
	}
}
