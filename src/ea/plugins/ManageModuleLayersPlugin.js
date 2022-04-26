import { BaPlugin } from '../../plugins/BaPlugin';
import { addLayer, removeLayer } from '../../store/layers/layers.action';
import { observe } from '../../utils/storeUtils';
import { CONTRIBUTION_LAYER_ID } from '../modules/map/components/olMap/handler/contribution/OlContributionHandler';
import { GEO_FEATURE_LAYER_ID } from '../modules/map/components/olMap/handler/geofeature/OlGeoFeatureLayerHandler';
import { EAContribution } from '../modules/toolbox/components/contribution/EAContribution';
import { MixerModuleContent } from '../modules/toolbox/components/mixerModuleContent/MixerModuleContent';
import { RedesignModuleContent } from '../modules/toolbox/components/redesignModuleContent/RedesignModuleContent';
import { ResearchModuleContent } from '../modules/toolbox/components/researchModuleContent/ResearchModuleContent';

export class ManageModuleLayersPlugin extends BaPlugin {


	constructor() {
		super();

		this._lastTool = '';
	}

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {

		const onToolChange = (toolId) => {

			// remove layers for last tool
			switch (this._lastTool) {
				case EAContribution.tag:
					removeLayer(CONTRIBUTION_LAYER_ID);
					break;
				case MixerModuleContent.tag:
				case RedesignModuleContent.tag:
				case ResearchModuleContent.tag:
					removeLayer(GEO_FEATURE_LAYER_ID);
					break;
			}

			// enable layers for new tool
			switch (toolId) {
				case EAContribution.tag:
					addLayer(CONTRIBUTION_LAYER_ID, { label: 'contribution_layer', constraints: { hidden: true, alwaysTop: false } });
					break;

				case MixerModuleContent.tag:
				case RedesignModuleContent.tag:
				case ResearchModuleContent.tag:
					addLayer(GEO_FEATURE_LAYER_ID, { label: 'Verwaltungseinheiten', constraints: { hidden: true, alwaysTop: true } });
					break;
			}

			this._lastTool = toolId;

		};

		observe(store, state => state.tools.current, onToolChange);

	}
}
