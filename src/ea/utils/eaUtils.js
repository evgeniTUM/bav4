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
 * @param csvText the csv to convert. The format is (category, name, optional)
 * @returns {List<Object>}
 */
export const generateJsonCategorySpecFromCSV = (csvText) => {
	const lines = csvText.split(/\r?\n/);

	const categories = {};

	csvText.split();
	for (let i = 1; i < lines.length; i++) {
		if (!lines[i]) {
			continue;
		}

		const fields = lines[i].split(',');
		const category = fields[0].trim();
		const name = fields[1].trim();
		const optional = 'true' === fields[2].trim().toLowerCase();
		const type = fields[3].trim();

		if (!categories[category]) {
			categories[category] = [];
		}

		categories[category].push({ name, optional, type });
	}

	return Object.entries(categories).map(([n, v]) => ({ 'ee-name': n, 'ee-angaben': v }));
};
