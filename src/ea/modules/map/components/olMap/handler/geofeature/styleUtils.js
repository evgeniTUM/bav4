
import { Fill, Icon, Stroke, Style } from 'ol/style';
import { styleTemplates } from './styleTemplates';

export const createStyleFnFromJson = (json) => {
	if (!json) {
		return () => new Style();
	}

	if (json.template) {
		return () => styleTemplates[json.template];
	}

	const image = json.image ?
		new Icon(json.image.icon ? json.image.icon : json.image.circle)
		: undefined;

	const lineDash = json.stroke.dashstyle ?
		json.stroke.dashstyle.split(',').map(Number) :
		undefined;


	const style = {
		fill: new Fill({
			color: JSON.parse('[' + json.fill.color + ']')
		}),
		stroke: new Stroke({
			color: JSON.parse('[' + json.stroke.color + ']'),
			width: parseInt(json.stroke.width),
			pointRadius: parseInt(json.stroke.pointradius),
			lineDash
		}),
		image
	};

	return () => new Style(style);
};
