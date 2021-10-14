import { NotificationItem } from '../../../../src/modules/notifications/components/NotificationItem';
import { LevelTypes, notificationReducer } from '../../../../src/store/notifications/notifications.reducer';
import { TestUtils } from '../../../test-utils';
import { $injector } from '../../../../src/injection';

window.customElements.define(NotificationItem.tag, NotificationItem);

describe('NotificationItem', () => {
	const notificationTemplate = {
		content: null,
		level: LevelTypes.INFO,
		permanent: false,
		id: 1234,
		index: 0,
		autocloseTime: 0
	};

	describe('when notification item is rendered', () => {

		beforeEach(function () {
			jasmine.clock().install();
		});

		afterEach(function () {
			jasmine.clock().uninstall();
		});

		const setup = async (notification) => {
			TestUtils.setupStoreAndDi({}, { notifications: notificationReducer });
			$injector.registerSingleton('TranslationService', { translate: (key) => key });
			const element = await TestUtils.render(NotificationItem.tag);
			element.content = notification;
			return element;
		};

		it('displays the notification message', async () => {
			const element = await setup({ ...notificationTemplate, content: 'FooBar' });
			const contentElement = element.shadowRoot.querySelector('.notification_content');

			expect(contentElement.innerText).toContain('FooBar');
		});

		it('starts hiding with autoclose after 1 sec.', async () => {
			const autocloseTime = 1000;
			const laterThenAutoCloseTime = autocloseTime + 100;
			const notification = { ...notificationTemplate, content: 'FooBar', autocloseTime: autocloseTime };

			const element = await setup(notification);
			const hideSpy = spyOn(element, '_hide').and.callThrough();

			jasmine.clock().tick(laterThenAutoCloseTime);

			expect(hideSpy).toHaveBeenCalled();
		});

		it('closes the notification item with call of onClose', async () => {
			const autocloseTime = 1000;
			const laterThenAutoCloseTime = autocloseTime + 100;
			const notification = { ...notificationTemplate, content: 'FooBar', autocloseTime: autocloseTime };

			const element = await setup(notification);
			element.onClose = jasmine.createSpy();
			const hideSpy = spyOn(element, '_hide').and.callThrough();
			const notificationElement = element.shadowRoot.querySelector('.notification_item');

			jasmine.clock().tick(laterThenAutoCloseTime);
			notificationElement.dispatchEvent(new Event('animationend'));
			expect(hideSpy).toHaveBeenCalled();


			expect(element.onClose).toHaveBeenCalledWith(notification);
		});

		describe('displays the level type', () => {

			it('info', async () => {
				const element = await setup({ ...notificationTemplate, level: LevelTypes.INFO });
				const contentElement = element.shadowRoot.querySelector('.notification_level');

				expect(contentElement.innerText).toContain('notifications_item_info');
			});

			it('warn', async () => {
				const element = await setup({ ...notificationTemplate, level: LevelTypes.WARN });
				const contentElement = element.shadowRoot.querySelector('.notification_level');

				expect(contentElement.innerText).toContain('notifications_item_warn');
			});

			it('error', async () => {
				const element = await setup({ ...notificationTemplate, level: LevelTypes.ERROR });
				const contentElement = element.shadowRoot.querySelector('.notification_level');

				expect(contentElement.innerText).toContain('notifications_item_error');
			});

		});
	});
});
