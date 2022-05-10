import { Fill, Icon, Stroke, Style } from 'ol/style';
import { createStyleFnFromJson } from '../../../../../../../../src/ea/modules/map/components/olMap/handler/geofeature/styleUtils';

describe('createStyleFnFromJson', () => {

	it('create empty style for undefined json', () => {
		expect(createStyleFnFromJson()()).toEqual(new Style());
	});

	it('creates style from json elements - minimal', () => {
		expect(createStyleFnFromJson(
			{
				fill: {
					color: '111, 177, 121, 0.0'
				},
				stroke: {
					color: '111, 177, 121, 1.0',
					pointradius: '5',
					width: '2'
				}
			}
		)()).toEqual(
			new Style({
				fill: new Fill({
					color: [111, 177, 121, 0.0]
				}),
				stroke: new Stroke({
					color: [111, 177, 121, 1.0],
					pointRadius: 5,
					width: 2
				})
			}));
	});



	it('creates style from json elements - maximal', () => {
		expect(createStyleFnFromJson(
			{
				fill: {
					color: '111, 177, 121, 0.0'
				},
				stroke: {
					dashstyle: '1,5',
					color: '111, 177, 121, 1.0',
					pointradius: '5',
					width: '2'
				},
				image: {
					icon: {
						anchor: [0.5, 1],
						anchorXUnits: 'fraction',
						anchorYUnits: 'fraction',
						src: 'icon.svg'
					}

				}
			}
		)()).toEqual(
			new Style({
				fill: new Fill({
					color: [111, 177, 121, 0.0]
				}),
				stroke: new Stroke({
					color: [111, 177, 121, 1.0],
					lineDash: [1, 5],
					pointRadius: 5,
					width: 2
				}),
				image: new Icon({
					anchor: [0.5, 1],
					anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					src: 'icon.svg'
				})
			}));
	});

	it('creates style from json elements with img.circle property', () => {
		expect(createStyleFnFromJson(
			{
				fill: {
					color: '111, 177, 121, 0.0'
				},
				stroke: {
					color: '111, 177, 121, 1.0',
					pointradius: '5',
					width: '2'
				},
				image: {
					circle: {
						anchor: [0.5, 1],
						anchorXUnits: 'fraction',
						anchorYUnits: 'fraction',
						src: 'icon.svg'
					}

				}
			}
		)().getImage()).toEqual(
			new Icon({
				anchor: [0.5, 1],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
				src: 'icon.svg'
			})
		);
	});
});
