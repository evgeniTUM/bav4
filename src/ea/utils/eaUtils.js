/***
 * Checks if a resolution is valid for a specific georesource and updates the "obj" element state.
 * "Obj" hat to have the following properties:
 * - this._wmsLayers variable
 * - this._wmsCapabilitiesService service
 * - this.render() method
 * @param {string} id the geo resource id
 * @param {object} obj the HTML element to update
 * @param {float} resolution the current map resolution
 * @returns {boolean} true if resolution is valid, false otherwise
 */
export const checkIfResolutionValid = (id, obj, resolution) => {
	if (obj._wmsLayers === null) {
		setTimeout(async () => {
			obj._wmsLayers = await obj._wmsCapabilitiesService.getWmsLayers(id);
			obj.render();
		});

		return true;
	}

	return obj._wmsLayers.length === 0 ||
            obj._wmsLayers.some(l => resolution > l.maxResolution && resolution < l.minResolution);
};


/***
 * Converts a csv contribution category to JSON.
 * @param csv the csv to convert (using the webpack csv-loader). The format is (category, name, optional, type)
 * @returns {List<Object>}
 */
export const generateJsonCategorySpecFromCSV = (csv) => {
	const categories = [];

	csv.forEach(e => {
		const category = e.category.trim();


		if (!categories[category]) {
			categories[category] = [];
		}

		categories[category].push({
			name: e.name.trim(),
			optional: 'true' === e.optional.trim().toLowerCase(),
			type: e.type.trim() });
	});


	return Object.entries(categories).map(([n, v]) => ({ 'ee-name': n, 'ee-angaben': v }));
};
