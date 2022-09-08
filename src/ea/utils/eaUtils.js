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
