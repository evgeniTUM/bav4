export const LAYER_ADDED = 'layer/added';
export const LAYER_REMOVED = 'layer/removed';
export const LAYER_MODIFIED = 'layer/modified';


export const initialState = {
	active: [],
};

/**
 * Sets the zIndex based of the current order within the layer list.
 * @param {*} list 
 */
export const index = (list) => {
	list.forEach((element, index) => {
		element.zIndex = index;
	});
	return list;
};

/**
 * Sorts the list based on the zIndex regarding the alwaysTop constraints.
 * Finally it calls {@link index()}.
 * @param {*} list 
 */
export const sort = (list) => {

	const layersWithAlwaysTopConstraint = list.filter(l => l.constraints.alwaysTop);
	const sorted = list.sort((a, b) => a.zIndex - b.zIndex);

	//we insert alwaysTop layers at the end
	layersWithAlwaysTopConstraint.forEach(l => {
		sorted.push(sorted.splice(sorted.indexOf(l), 1)[0]);
	});
	//and reindex
	return index(sorted);
};

export const defaultLayerProperties = Object.freeze({
	label: '',
	visible: true,
	zIndex: -1,
	opacity: 1,
	constraints: { alwaysTop: false, hidden: false }
});

const addLayer = (state, payload) => {
	const { id, properties } = payload;

	if (state.active.findIndex(layer => layer.id === id) !== -1) {
		//do nothing when id already present
		return {
			...state
		};
	}

	const layer = {
		...defaultLayerProperties,
		...properties,
		id: id
	};

	const { constraints: { alwaysTop } } = layer;
	//when index is given we insert at that value, otherwise we append the layer
	const insertIndex = (properties.zIndex >= 0 && !alwaysTop) ? properties.zIndex : state.active.length;
	const active = [...state.active];
	active.splice(insertIndex, 0, layer);
	return {
		...state,
		active: index(active)
	};
};

const removeLayer = (state, payload) => {
	return {
		...state,
		active: index(state.active.filter(layer => layer.id !== payload))
	};
};

const modifyLayer = (state, payload) => {
	const { id, properties } = payload;

	const layer = state.active.find(layer => layer.id === id);
	if (layer) {
		const active = [...state.active];

		const currentIndex = active.indexOf(layer);
		//remove current layer
		active.splice(currentIndex, 1);

		const updatedLayer = {
			...layer,
			...properties
		};

		//add updated layer
		active.splice(updatedLayer.zIndex, 0, updatedLayer);

		return {
			...state,
			active: sort(index(active))
		};
	}
	return {
		...state
	};
};

export const layersReducer = (state = initialState, action) => {

	const { type, payload } = action;
	switch (type) {

		case LAYER_ADDED: {
			return addLayer(state, payload);
		}
		case LAYER_REMOVED: {
			return removeLayer(state, payload);
		}
		case LAYER_MODIFIED: {
			return modifyLayer(state, payload);
		}
	}

	return state;
};