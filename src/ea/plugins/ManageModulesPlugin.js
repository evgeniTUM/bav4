import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';
import { addLayer, removeLayer } from '../../store/layers/layers.action';
import { close, open } from '../../store/mainMenu/mainMenu.action';
import { observe } from '../../utils/storeUtils';
import { CONTRIBUTION_LAYER_ID } from '../modules/map/components/olMap/handler/contribution/OlContributionHandler';
import { GEO_FEATURE_LAYER_ID } from '../modules/map/components/olMap/handler/geofeature/OlGeoFeatureLayerHandler';
import { EAContribution } from '../modules/toolbox/components/contribution/EAContribution';
import { MixerModuleContent } from '../modules/toolbox/components/mixerModuleContent/MixerModuleContent';
import { RedesignModuleContent } from '../modules/toolbox/components/redesignModuleContent/RedesignModuleContent';
import { ResearchModuleContent } from '../modules/toolbox/components/researchModuleContent/ResearchModuleContent';
import { ModuleId } from '../store/module/module.action';

export class ManageModulesPlugin extends BaPlugin {
	constructor() {
		super();

		this._lastModule = '';
		this._activeGeoResources = new Set();
	}

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {

		const handleMainMenu = (currentModule, lastModule) => {
			if (ModuleId.includes(currentModule)) {
				close();
			}
			else if (ModuleId.includes(lastModule)) {
				open();
			}
		};

		const handleLayers = (currentModule, lastModule) => {
		// remove layers for last module
			switch (lastModule) {
				case EAContribution.tag:
					removeLayer(CONTRIBUTION_LAYER_ID);
					break;
				case MixerModuleContent.tag:
				case RedesignModuleContent.tag:
				case ResearchModuleContent.tag:
					removeLayer(GEO_FEATURE_LAYER_ID);
					break;
			}

			// enable layers for new module
			switch (currentModule) {
				case EAContribution.tag:
					addLayer(CONTRIBUTION_LAYER_ID, { label: 'contribution_layer', constraints: { hidden: true, alwaysTop: false } });
					break;

				case MixerModuleContent.tag:
				case RedesignModuleContent.tag:
				case ResearchModuleContent.tag:
					addLayer(GEO_FEATURE_LAYER_ID, { label: 'Verwaltungseinheiten', constraints: { hidden: true, alwaysTop: true } });
					break;
			}
		};

		const onModuleChange = (moduleId) => {

			handleMainMenu(moduleId, this._lastModule);
			handleLayers(moduleId, this._lastModule);

			this._lastModule = moduleId;

		};

		const { GeoResourceService: geoResourceService } = $injector.inject('GeoResourceService');
		const onActiveGeoResourcesChanged = (ids) => {

			const idsToAdd = ids.filter(id => !this._activeGeoResources.has(id));
			const idsToRemove = Array.from(this._activeGeoResources).filter(id => !new Set(ids).has(id));

			const layerId = (resId) => `module-georesource-${resId}`;

			idsToAdd.forEach(id => {
				const wmsResource = geoResourceService.byId(id);

				addLayer(layerId(id), { geoResourceId: id, label: wmsResource.label });
				this._activeGeoResources.add(id);
			});

			idsToRemove.forEach(id => {
				removeLayer(layerId(id));
				this._activeGeoResources.delete(id);
			});

		};

		observe(store, state => state.module.current, onModuleChange);
		observe(store, state => state.module.activeGeoResources, onActiveGeoResourcesChanged);

	}
}
