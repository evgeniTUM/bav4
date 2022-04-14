import { EAContribution } from '../modules/toolbox/components/contribution/EAContribution';
import { CONTRIBUTION_LAYER_ID } from '../modules/map/components/olMap/handler/contribution/OlContributionHandler';
import { BaPlugin } from '../../plugins/BaPlugin';
import { addLayer, removeLayer } from '../../store/layers/layers.action';
import { observe } from '../../utils/storeUtils';


export class ManageModuleLayersPlugin extends BaPlugin {

	constructor() {
		super();
		this._currentTool = '';
	}

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {

		const onToolChange = (toolId) => {

			switch (this._currentTool) {
				case EAContribution.tag:
					removeLayer(CONTRIBUTION_LAYER_ID);
					console.log('removing');
					break;
			}

			switch (toolId) {
				case EAContribution.tag:
					addLayer(CONTRIBUTION_LAYER_ID, { label: 'contribution_layer', constraints: { hidden: true, alwaysTop: false } });
					break;
			}

			this._currentTool = toolId;

		};

		observe(store, state => state.tools.current, onToolChange);

	}
}
