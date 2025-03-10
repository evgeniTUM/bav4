import { Circle, Fill, Stroke, Style } from 'ol/style';

export const styleTemplates = {
	geolocation: new Style({
		fill: new Fill({
			color: [255, 0, 0, 0.1]
		}),
		stroke: new Stroke({
			color: [255, 0, 0, 0.9],
			width: 3
		}),
		image: new Circle({
			radius: 5,
			fill: new Fill({
				color: [255, 0, 0, 0.9]
			}),
			stroke: new Stroke({
				color: [255, 255, 255, 1],
				width: 3
			})
		})
	}),

	eablocation: new Style({
		fill: new Fill({
			color: [0, 255, 255, 0.1]
		}),
		stroke: new Stroke({
			color: [0, 86, 255, 0.9],
			width: 3
		}),
		image: new Circle({
			radius: 5,
			fill: new Fill({
				color: [20, 255, 255, 0.9]
			}),
			stroke: new Stroke({
				color: [0, 86, 255, 1],
				width: 3
			})
		})
	})
};
