import { BaPlugin } from '../../plugins/BaPlugin';

export class LegendPlugin extends BaPlugin {
	constructor() {
		super();

		this._previewLayers = [];
		this._activeLayers = [];
	}

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {


	}
}
