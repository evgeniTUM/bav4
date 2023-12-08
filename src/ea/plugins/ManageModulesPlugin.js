import { QueryParameters } from '../../domain/queryParameters';
import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';
import { abortOrReset } from '../../store/featureInfo/featureInfo.action';
import { clearHighlightFeatures } from '../../store/highlight/highlight.action';
import { addLayer, removeLayer } from '../../store/layers/layers.action';
import { close, open } from '../../store/mainMenu/mainMenu.action';
import { emitNotification, LevelTypes } from '../../store/notifications/notifications.action';
import { observe } from '../../utils/storeUtils';
import { SELECT_LOCATION_LAYER_ID } from '../modules/map/components/olMap/handler/selection/OlSelectLocationHandler';
import { GEO_FEATURE_LAYER_ID } from '../modules/map/components/olMap/handler/geofeature/OlGeoFeatureLayerHandler';
import { Analyse3DModuleContent } from '../modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { EnergyMarketModuleContent } from '../modules/toolbox/components/contribution/EnergyMarketModuleContent';
import { GeothermModuleContent } from '../modules/toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../modules/toolbox/components/mixer/MixerModuleContent';
import { RedesignModuleContent } from '../modules/toolbox/components/redesign/RedesignModuleContent';
import { ResearchModuleContent } from '../modules/toolbox/components/research/ResearchModuleContent';
import { clearMap } from '../store/geofeature/geofeature.action';
import { deactivateAllGeoResources, setCurrentModule } from '../store/module/ea.action';
import { EnergyReportingModuleContent } from '../modules/toolbox/components/contribution/EnergyReportingModuleContent';
import { setTooltipText } from '../store/locationSelection/locationSelection.action';
import { EaModules, EaModulesQueryParameters } from '../domain/moduleTypes';

export class ManageModulesPlugin extends BaPlugin {
	constructor() {
		super();

		const { EnvironmentService: environmentService } = $injector.inject('EnvironmentService');
		const { GeoResourceService: geoResourceService } = $injector.inject('GeoResourceService');
		this._geoResourceService = geoResourceService;
		this._environmentService = environmentService;

		this._lastModule = '';
		this._activeGeoResources = new Set();
		this._activeLayers = [];
	}

	/**
	 * @override
	 * @param {Object} store
	 */
	async register(store) {
		const processEaModuleQueryParameter = () => {
			const queryParams = new URLSearchParams(this._environmentService.getWindow().location.search);
			const moduleParameter = queryParams.get(QueryParameters.EA_MODULE);

			if (moduleParameter) {
				const entry = EaModulesQueryParameters.find((e) => e.parameter === moduleParameter);
				if (entry) {
					setTimeout(() => setCurrentModule(entry.name), 100);
				} else {
					emitNotification(`No module: "${moduleParameter}".`, LevelTypes.ERROR);
				}
			}
		};

		processEaModuleQueryParameter();

		const handleMainMenu = (currentModule, lastModule) => {
			if (EaModules.map((m) => m.name).includes(lastModule)) {
				clearMap();
				abortOrReset();
				clearHighlightFeatures();
				deactivateAllGeoResources();
				open();
			}

			if (EaModules.map((m) => m.name).includes(currentModule)) {
				close();
			}
		};

		const handleLayers = (currentModule, lastModule) => {
			// remove layers for last module
			switch (lastModule) {
				case GeothermModuleContent.name:
				case EnergyMarketModuleContent.name:
				case EnergyReportingModuleContent.name:
				case Analyse3DModuleContent.name:
					removeLayer(SELECT_LOCATION_LAYER_ID);
					break;
				case MixerModuleContent.name:
				case RedesignModuleContent.name:
				case ResearchModuleContent.name:
					removeLayer(GEO_FEATURE_LAYER_ID);
					break;
			}

			// enable layers for new module
			switch (currentModule) {
				case GeothermModuleContent.name:
					setTooltipText('ea_select_location');
					addLayer(SELECT_LOCATION_LAYER_ID, { label: 'Standortselektion', constraints: { hidden: true, alwaysTop: true } });
					break;
				case Analyse3DModuleContent.name:
					setTooltipText('ea_select_region');
					addLayer(SELECT_LOCATION_LAYER_ID, { label: 'Standortselektion', constraints: { hidden: true, alwaysTop: true } });
					break;
				case EnergyMarketModuleContent.name:
				case EnergyReportingModuleContent.name:
					setTooltipText('ea_mark_location');
					addLayer(SELECT_LOCATION_LAYER_ID, { label: 'Standortselektion', constraints: { hidden: true, alwaysTop: true } });
					break;

				case MixerModuleContent.name:
				case RedesignModuleContent.name:
				case ResearchModuleContent.name:
					addLayer(GEO_FEATURE_LAYER_ID, { label: 'Verwaltungseinheiten', constraints: { hidden: true, alwaysTop: true } });
					break;
			}
		};

		const onModuleChange = (moduleId) => {
			handleMainMenu(moduleId, this._lastModule);
			handleLayers(moduleId, this._lastModule);

			this._lastModule = moduleId;
		};

		const onActiveGeoResourcesChanged = (ids) => {
			const idsToAdd = ids.filter((id) => !this._activeGeoResources.has(id)).filter((id) => !this._activeLayers.includes(id));
			const idsToRemove = Array.from(this._activeGeoResources).filter((id) => !new Set(ids).has(id));

			const layerId = (resId) => `module-georesource-${resId}`;

			idsToAdd.forEach((id) => {
				const wmsResource = this._geoResourceService.byId(id);

				addLayer(layerId(id), { geoResourceId: id, label: wmsResource.label });
				this._activeGeoResources.add(id);
			});

			idsToRemove.forEach((id) => {
				removeLayer(layerId(id));
				this._activeGeoResources.delete(id);
			});
		};

		const onActiveLayersChanged = (layers) => {
			this._activeLayers = layers.map((l) => l.geoResourceId);
		};

		observe(store, (state) => state.layers.active, onActiveLayersChanged);
		observe(store, (state) => state.ea.currentModule, onModuleChange);
		observe(store, (state) => state.ea.activeGeoResources, onActiveGeoResourcesChanged);
	}
}
