import { $injector } from '../../../../../../../src/injection';
import { InteractionSnapType, InteractionStateType } from '../../../../../../../src/modules/map/components/olMap/olInteractionUtils';
import { TestUtils } from '../../../../../../test-utils.js';
import { provide as drawProvide } from '../../../../../../../src/modules/map/components/olMap/handler/draw/tooltipMessage.provider';


TestUtils.setupStoreAndDi({});
$injector.registerSingleton('TranslationService', { translate: (key) => key });

describe('Measure tooltipMessageProvider', () => {
	const drawStateTemplate = {
		type: null,
		snap: null,
		coordinate: [0, 0],
		pointCount: 42,
		dragging: false
	};

	it('provides tooltip-messages', () => {
		expect(drawProvide({ ...drawStateTemplate, type: InteractionStateType.DRAW, pointCount: 1 })).toBe('map_olMap_handler_draw_continue_line');
		expect(drawProvide({ ...drawStateTemplate, type: InteractionStateType.DRAW })).toBe('map_olMap_handler_draw_continue_line<br/>map_olMap_handler_delete_last_point');
		expect(drawProvide({ ...drawStateTemplate, type: InteractionStateType.DRAW, snap: InteractionSnapType.FIRSTPOINT })).toBe('map_olMap_handler_measure_snap_first_point<br/>map_olMap_handler_delete_last_point');
		expect(drawProvide({ ...drawStateTemplate, type: InteractionStateType.DRAW, snap: InteractionSnapType.LASTPOINT })).toBe('map_olMap_handler_measure_snap_last_point<br/>map_olMap_handler_delete_last_point');
		expect(drawProvide({ ...drawStateTemplate, type: InteractionStateType.MODIFY })).toBe('map_olMap_handler_draw_modify_key_for_delete');
		expect(drawProvide({ ...drawStateTemplate, type: InteractionStateType.MODIFY, snap: InteractionSnapType.VERTEX })).toBe('map_olMap_handler_measure_modify_click_or_drag');
		expect(drawProvide({ ...drawStateTemplate, type: InteractionStateType.MODIFY, snap: InteractionSnapType.EDGE })).toBe('map_olMap_handler_measure_modify_click_new_point');
		expect(drawProvide({ ...drawStateTemplate, type: InteractionStateType.OVERLAY })).toBe('map_olMap_handler_measure_modify_click_drag_overlay');
	});
});
