import { ToolKey } from '../../../src/store/toolContainer/toolContainer.action';

describe('toolAction', () => {

	it('exports a ToolKey enum', () => {
		expect(Object.keys(ToolKey).length).toBe(3);
		expect(Object.isFrozen(ToolKey)).toBeTrue();

		expect(ToolKey.MEASURING).toBe('measuring');
		expect(ToolKey.DRAWING).toBe('drawing');
		expect(ToolKey.SHARING).toBe('sharing');
	});
});
