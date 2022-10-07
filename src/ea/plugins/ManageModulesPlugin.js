import { QueryParameters } from '../../domain/queryParameters';
import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';
import { abortOrReset } from '../../store/featureInfo/featureInfo.action';
import { clearHighlightFeatures } from '../../store/highlight/highlight.action';
import { addLayer, removeLayer } from '../../store/layers/layers.action';
import { close, open } from '../../store/mainMenu/mainMenu.action';
import { emitNotification, LevelTypes } from '../../store/notifications/notifications.action';
import { observe } from '../../utils/storeUtils';
import { CONTRIBUTION_LAYER_ID } from '../modules/map/components/olMap/handler/contribution/OlContributionHandler';
import { GEO_FEATURE_LAYER_ID } from '../modules/map/components/olMap/handler/geofeature/OlGeoFeatureLayerHandler';
import { Analyse3DModuleContent } from '../modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { EAContribution } from '../modules/toolbox/components/contribution/EAContribution';
import { GeothermModuleContent } from '../modules/toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../modules/toolbox/components/mixer/MixerModuleContent';
import { RedesignModuleContent } from '../modules/toolbox/components/redesign/RedesignModuleContent';
import { ResearchModuleContent } from '../modules/toolbox/components/research/ResearchModuleContent';
import { clearMap } from '../store/geofeature/geofeature.action';
import { deactivateAllGeoResources, EaModulesQueryParameters, EaModules, setCurrentModule } from '../store/module/ea.action';

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
			if (EaModules.map(m => m.name).includes(lastModule)) {
				clearMap();
				abortOrReset();
				clearHighlightFeatures();
				deactivateAllGeoResources();
				open();
			}

			if (EaModules.map(m => m.name).includes(currentModule)) {
				close();
			}
		};

		const handleLayers = (currentModule, lastModule) => {
		// remove layers for last module
			switch (lastModule) {
				case EAContribution.name:
					removeLayer(CONTRIBUTION_LAYER_ID);
					break;
				case MixerModuleContent.name:
				case RedesignModuleContent.name:
				case ResearchModuleContent.name:
				case Analyse3DModuleContent.name:
				case GeothermModuleContent.name:
					removeLayer(GEO_FEATURE_LAYER_ID);
					break;
			}

			// enable layers for new module
			switch (currentModule) {
				case EAContribution.name:
					addLayer(CONTRIBUTION_LAYER_ID, { label: 'contribution_layer', constraints: { hidden: true, alwaysTop: false } });
					break;

				case MixerModuleContent.name:
				case RedesignModuleContent.name:
				case ResearchModuleContent.name:
				case Analyse3DModuleContent.name:
				case GeothermModuleContent.name:
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


		const { EnvironmentService: environmentService } = $injector.inject('EnvironmentService');
		const queryParams = new URLSearchParams(environmentService.getWindow().location.search);
		const moduleParameter = queryParams.get(QueryParameters.EA_MODULE);

		if (moduleParameter) {
			const entry = EaModulesQueryParameters.find(e => e.parameter === moduleParameter);
			if (entry) {
				setTimeout(() => setCurrentModule(entry.name), 100);
			}
			else {
				emitNotification('Zusatzmodul ' + moduleParameter + ' unbekannt. (Query Parameter COMP)', LevelTypes.ERROR);
			}
		}

		observe(store, state => state.ea.currentModule, onModuleChange);
		observe(store, state => state.ea.activeGeoResources, onActiveGeoResourcesChanged);

	}
}
