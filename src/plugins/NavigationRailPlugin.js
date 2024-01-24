/**
 * @module plugins/NavigationRailPlugin
 */
import { observe } from '../utils/storeUtils';
import { BaPlugin } from '../plugins/BaPlugin';
import { openNav, addTabId, closeNav } from '../store/navigationRail/navigationRail.action';
import { TabIds } from '../domain/mainMenu';

/**
 * @class
 * @author alsturm
 */
export class NavigationRailPlugin extends BaPlugin {
	constructor() {
		super();
		this._open = null;
		this._openNav = null;
		this._isPortrait = null;
	}

	_init() {}

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {
		this._init();
		this._openNav = store.getState().navigationRail.openNav;
		this._isPortrait = store.getState().media.portrait;

		const onTabChanged = (tab, state) => {
			this._open = state.mainMenu.open;
			if (tab === TabIds.FEATUREINFO || (tab === TabIds.ROUTING && !this._isPortrait)) {
				addTabId(tab);
				//TEMP
				closeNav();
				openNav();
			}
		};

		observe(store, (store) => store.mainMenu.tab, onTabChanged, false);
	}
}
