import { observe } from '../utils/storeUtils';
import { BaPlugin } from '../plugins/BaPlugin';
import { close, open, setTab, TabId } from '../store/mainMenu/mainMenu.action';
import { $injector } from '../injection';
import { QueryParameters } from '../services/domain/queryParameters';


/**
 * @class
 * @author taulinger
 */
export class MainMenuPlugin extends BaPlugin {

	constructor() {
		super();
		this._previousTab = null;
		this._open = null;
	}

	_init() {
		const { EnvironmentService: environmentService }
			= $injector.inject('EnvironmentService');
		const queryParams = new URLSearchParams(environmentService.getWindow().location.search);
		const defaultTabId = TabId.TOPICS;

		// check if we have query params
		if (queryParams.has(QueryParameters.MENU_ID)) {
			const tabId = TabId.valueOf(parseInt(queryParams.get(QueryParameters.MENU_ID)));
			if (tabId) {
				setTab(tabId);
			}
			else {

				// set default tab id
				setTab(defaultTabId);
			}
		}
		else {
			// set default tab id
			setTab(defaultTabId);
		}
	}

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {
		this._init();

		this._open = store.getState().mainMenu.open;
		this._previousTab = store.getState().mainMenu.tab;

		const onFeatureInfoQueryingChanged = (querying, state) => {
			const { featureInfo: { current } } = state;
			if (!querying) {

				if (current.length === 0) {
					if (!this._open) {
						close();
					}
					setTab(this._previousTab);
				}
				else {
					setTab(TabId.FEATUREINFO);
					open();
				}
			}
		};

		const onFeatureInfoAbortedChanged = () => {

			if (!this._open) {
				close();
			}
			setTab(this._previousTab);
		};

		const onTabChanged = (tab, state) => {
			if (tab === TabId.FEATUREINFO) {
				this._open = state.mainMenu.open;
			}
			else {
				this._previousTab = tab;
			}
		};

		observe(store, state => state.featureInfo.querying, onFeatureInfoQueryingChanged);
		observe(store, state => state.featureInfo.aborted, onFeatureInfoAbortedChanged);
		observe(store, store => store.mainMenu.tab, onTabChanged, false);
	}
}
