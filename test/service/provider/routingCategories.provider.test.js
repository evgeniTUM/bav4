import { $injector } from '../../../src/injection';
import { bvvRoutingCategoriesProvider } from '../../../src/services/provider/routingCategories.provider';

describe('bvvRoutingCategoriesProvider', () => {
	const configService = {
		getValue: () => {}
	};

	beforeEach(() => {
		$injector.registerSingleton('ConfigService', configService);
	});

	afterEach(() => {
		$injector.reset();
	});

	it('returns routing categories for "de"', async () => {
		spyOn(configService, 'getValue').withArgs('DEFAULT_LANG').and.returnValue('de');

		const hike = {
			id: 'hike',
			label: 'Wandern',
			description: 'Wandern auf der gewöhnlich schnellsten Route',
			style: {
				routeColor: 'gray',
				routeBorderColor: 'red'
			},
			subcategories: []
		};
		const bvv_hike = {
			id: 'bvv-hike',
			label: 'Wandern (Freizeitwege)',
			description: 'Wandern möglichst auf offiziellen Wanderwegen',
			style: {
				routeColor: 'red',
				routeBorderColor: 'gray',
				color: 'red',
				icon: '<path d="m217.356 469.8 38.63-108.372-30.089-25.932L177.175 469.8zm172.105-206.5-.223 206.497h15.899V258.686zm.013-12.579 20.336-6.43c5.54-2.696 9.903-8.427 9.903-14.559 0-8.124-6.498-14.719-14.576-14.907v-32.032H389.24v34.864c-13.5 2.986-38.755 8.455-42.805 8.509-4.506.061-8.144-4.02-12.32-8.413-3.602-3.789-12.452-11.705-16.662-15.739-3.988-3.822-21.545-15.246-26.578-17.601-8.821-4.129-41.045-13.238-41.045-13.238l.075.154-.021-.017L217.356 284.2c-3.827 15.308 1.914 30.614 13.394 40.181l21.047 17.101 28.701 23.319c9.95 8.084 11.557 18.836 11.557 18.836l1.114 86.16h36.784v-70.184c0-16.348-1.115-24.895-4.087-37.898s-15.21-26.009-15.21-26.009l-34.743-42.198-.002.001 18.046-63.846c2.867 2.2 5.018 3.94 5.662 4.676 2.602 2.973 15.605 17.092 27.865 23.78s27.867 3.344 27.867 3.344l34.122-10.744v.002zm-215.761 34.875c-15.499-5.163-25.831-22.384-20.665-37.882l10.332-34.44c10.333-30.998 44.773-48.218 75.771-39.607l-27.553 91.268c-5.166 17.218-20.664 25.829-37.885 20.661z"/>'
			},
			subcategories: [hike]
		};
		const bayernnetzBike = {
			id: 'bayernnetz-bike',
			label: 'Fahrrad (Bayernnetz)',
			description: 'Fahrradfahren möglichst auf Wegen des Bayernnetzes',
			style: {
				routeColor: 'blue',
				routeBorderColor: 'gray'
			},
			subcategories: []
		};
		const bike = {
			id: 'bike',
			label: 'Fahrrad',
			description: 'Fahrradfahren auf der gewöhnlich schnellsten Route',
			style: {
				routeColor: 'gray',
				routeBorderColor: 'green'
			},
			subcategories: []
		};
		const bvv_bike = {
			id: 'bvv-bike',
			label: 'Fahrrad (Freizeitwege)',
			description: 'Fahrradfahren möglichst auf offiziellen Freizeitwegen',
			style: {
				routeColor: 'green',
				routeBorderColor: 'gray',
				color: 'green',
				icon: '<path d="M426.365 257.229c0-9.706-7.881-17.575-17.6-17.575h-.035v-.044h-45.962s-4.828.267-10.63-7.087c-44.291-54.922-51.378-65.552-65.551-65.552h-8.856c-14.173 0-24.803 10.63-76.181 62.009-19.488 19.488-17.717 44.291 1.771 56.688l54 31.765-.276 76.663c-.021.365-.035.732-.035 1.104 0 .336.01.67.027 1.004l-.004 1.08h.094a18.78 18.78 0 0 0 18.666 16.678c9.67 0 17.628-7.297 18.666-16.678h.009v-.064c.071-.664.109-1.338.109-2.02a18.98 18.98 0 0 0-.109-2.02v-80.922c0-12.479-10.08-20.959-11.52-22.719-.783-.957-10.32-10.574-18.859-19.146l38.442-34.325 26.574 28.346c6.082 6.827 14.172 10.629 23.031 10.629h57.373l-.001-.02c9.376-.401 16.857-8.336 16.857-17.794zm-52.459-142.938c-.959-2.267-3.229-5.702-5.494-8.317s-6.886-7.147-11.68-9.868-9.332-4.845-19.992-5.036c-10.459-.188-13.947 1.332-18.446 2.527-9.667 2.567-23.795 9.849-25.626 12.29s-1.312 3.86 1.395 6.188c.947.814 2.405 1.719 3.9 2.553a35.28 35.28 0 0 0-4.289 16.911c0 19.569 15.864 35.433 35.434 35.433s35.433-15.864 35.433-35.433c0-3.664-.557-7.197-1.589-10.522 3.357-.396 8.726-1.163 10.211-2.491 1.655-1.482 1.701-1.968.743-4.235zm23.949 195.057 3.163 19.721c23.259 5.143 40.661 25.871 40.661 50.678 0 28.672-23.243 51.915-51.916 51.915s-51.914-23.243-51.914-51.915c0-23.473 15.586-43.283 36.969-49.701l7.188 46.535c.035 4.154 3.493 7.512 7.757 7.512 4.286 0 7.761-3.391 7.761-7.576 0-.557-.066-1.1-.184-1.623l-14.9-92.885h-15.042l4.508 29.182c-30.401 7.971-53.007 35.745-53.007 68.557 0 38.975 31.89 70.865 70.866 70.865s70.866-31.891 70.866-70.865c0-36.244-27.572-66.352-62.776-70.4zM335.273 277.8l-35.004 27.899c.582 2.035.934 4.227.934 6.559v12.335l52.756-42.553h-3.321a29.73 29.73 0 0 1-15.365-4.24zM216.78 321.078l7.968-15.428-12.854-7.561-41.724 79.643a7.395 7.395 0 0 0-.69 1.481c-1.33 3.968.886 8.288 4.95 9.65 4.042 1.356 8.388-.729 9.742-4.657l23.857-46.189c12.768 9.456 21.051 24.62 21.051 41.729 0 28.672-23.244 51.915-51.916 51.915s-51.915-23.243-51.915-51.915 23.243-51.916 51.915-51.916c2.422 0 4.8.18 7.133.5l9.188-17.537a70.43 70.43 0 0 0-16.321-1.914c-38.977 0-70.866 31.891-70.866 70.867s31.89 70.865 70.866 70.865 70.866-31.891 70.866-70.865c.002-24.332-12.43-45.894-31.25-58.668z"/>'
			},
			subcategories: [bike, bayernnetzBike]
		};
		const mtb = {
			id: 'mtb',
			label: 'Mountainbike',
			description: 'Mountainbiken auf der gewöhnlich schnellsten Route',
			style: {
				routeColor: 'gray',
				routeBorderColor: 'SpringGreen'
			},
			subcategories: []
		};
		const bvv_mtb = {
			id: 'bvv-mtb',
			label: 'Mountainbike (Freizeitwege)',
			description: 'Mountainbiken möglichst auf offiziellen Freizeitwegen',
			style: {
				routeColor: 'SpringGreen',
				routeBorderColor: 'gray',
				color: 'SpringGreen',
				icon: '<path d="M317.766 90.578c21.144 0 38.277 16.837 38.277 37.607s-17.134 37.608-38.277 37.608-38.287-16.837-38.287-37.608 17.142-37.607 38.287-37.607zM129.194 223.822c-13.351-9.461-13.265-28.265-3.638-41.385l25.01-29.976c19.237-22.479 51.782-26.096 74.657-7.192l3.81 3.778-57.729 71.2c-11.54 13.111-28.769 14.917-42.11 3.575z"/><path d="M285.067 110.4s-7.254-3.638-10.041-6.251-3.27-4.15-1.16-6.636 17.758-9.435 28.335-11.627c4.921-1.021 8.77-2.44 20.045-1.671 11.493.785 16.27 3.284 21.289 6.43s9.75 8.203 12.05 11.098 4.555 6.661 5.463 9.115.83 2.969-1.038 4.449-8.915 1.956-12.319 2.154-62.624-7.061-62.624-7.061zm136.124 223.559a7.857 7.857 0 0 0-.695-1.595l-43.11-87.32-18.914-2.027 46.694 95.758c1.332 4.212 5.955 6.565 10.361 5.26 4.433-1.313 6.969-5.823 5.664-10.076zm-107.235-30.051 41.981-61.162-18.106-1.941-29.726 42.53a8.867 8.867 0 0 0-.843 1.099l6.694 19.474zm-92.867 3.405-42.348 79.445a7.73 7.73 0 0 0-.745 1.573c-1.437 4.21.956 8.795 5.346 10.241 4.365 1.439 9.059-.774 10.521-4.943l43.004-81.821-15.778-4.495z"/><path d="m213.263 322.072-14.356 26.88c17.731 6.3 30.823 23.229 30.823 42.506 0 24.444-21.047 45.128-45.921 45.128s-45.92-20.684-45.92-45.128 21.047-45.13 45.92-45.13c2.164 0 4.295.166 6.389.468l14.667-27.64a77.193 77.193 0 0 0-21.056-2.914c-42.094 0-76.535 33.847-76.535 75.216s34.441 75.215 76.535 75.215 76.536-33.848 76.536-75.215c0-31.126-19.498-57.989-47.082-69.386zm200.181-62.26a77.3 77.3 0 0 0-17.738 2.057l13.754 28.225a44.92 44.92 0 0 1 3.984-.189c24.875 0 45.922 20.694 45.922 45.143s-21.047 45.128-45.922 45.128-45.922-20.684-45.922-45.128c0-20.041 14.149-37.553 32.952-43.217l-13.496-27.353c-29.153 10.644-50.07 38.324-50.07 70.569 0 41.368 34.441 75.215 76.536 75.215s76.535-33.847 76.535-75.215c.001-41.38-34.44-75.235-76.535-75.235zm-98.129-29.988 71.949 6.353 3.293-30.879-54.26-5.169-64.472-47.499c-11.479-9.401-26.787-7.521-34.441 3.762-19.133 20.684-47.834 54.531-63.142 73.334-17.22 20.684-9.567 52.653 17.221 60.178l41.202 11.687 40.68 11.537 25.597 73.479c1.486 7.075 8.033 12.406 15.889 12.406 8.951 0 16.208-6.921 16.208-15.457 0-1.284-.182-2.524-.492-3.717l.017-.005-.086-.253a15.01 15.01 0 0 0-.571-1.675l-31.283-91.657-63.155-31.029 43.489-52.237 36.357 26.841z"/><ellipse cx="388.335" cy="220.755" rx="16.2" ry="15.457"/>'
			},
			subcategories: [mtb]
		};
		const race = {
			id: 'racingbike',
			label: 'Rennrad',
			description: 'Rennradfahren auf der gewöhnlich schnellsten Route',
			style: {
				routeColor: 'gray',
				routeBorderColor: 'purple',
				color: 'gray',
				icon: '<path d="m423.832 231.177-55.65.515c-12.014 1.366-21.533-45.385-42.041-71.06-2.312-2.894-4.764-5.521-7.375-7.78 0 0-7.074-5.691-18.396-5.691-15.307 0-42.451 12.457-109.281 56.238-21.048 21.047-19.135 47.834 1.912 61.227l11.074 6.516 22.35 13.144 25.891 15.229v84.627l.056.002c-.032.451-.056.904-.056 1.365 0 10.207 8.275 18.482 18.484 18.482s18.482-8.275 18.482-18.482a18.5 18.5 0 0 0-.07-1.551l-.004-88.533c-.303-15.794-10.329-24.302-10.329-24.302l-19.632-19.085 52.633-28.468 14.092 29.021c5.739 7.653 12.456 17.622 30.32 17.622l67.541-3.445c9.828 0 17.794-7.964 17.794-17.792s-7.967-17.799-17.795-17.799zm-78.145-92.299s-7.801-4.662-10.676-7.321-3.763-6.978-1.587-9.508 18.314-9.6 29.219-11.83c5.074-1.039 9.043-2.484 20.668-1.701 11.852.799 16.779 3.342 21.957 6.543s10.059 8.346 12.43 11.292 4.699 6.778 5.637 9.275.856 3.021-1.071 4.526-9.196 1.991-12.708 2.192-63.869-3.468-63.869-3.468zm-145.07 141.139-43.386 83.742a7.88 7.88 0 0 0-.745 1.6c-1.437 4.285.957 8.951 5.346 10.424 4.366 1.463 9.059-.789 10.521-5.031l42.402-82.092-14.138-8.643z"/><circle cx="379.271" cy="150.812" r="38.268"/><path d="m192.645 295.646-6.155 11.941c24.083 8.902 41.254 32.064 41.254 59.24 0 34.873-28.27 63.141-63.142 63.141S101.46 401.7 101.46 366.827s28.27-63.141 63.142-63.141c3.221 0 6.385.244 9.476.709l6.406-12.43a76.056 76.056 0 0 0-15.882-1.674c-42.095 0-76.535 34.441-76.535 76.535s34.441 76.535 76.535 76.535 76.536-34.441 76.536-76.535c0-32.206-20.165-59.934-48.493-71.18zm202.201-5.333 4.195 13.578c32.682 2.4 58.457 29.656 58.457 62.951 0 34.871-28.27 63.141-63.143 63.141s-63.141-28.27-63.141-63.141c0-32.064 23.906-58.527 54.863-62.584l-4.004-12.953c-36.311 5.92-64.254 37.621-64.254 75.537 0 42.094 34.44 76.535 76.535 76.535s76.535-34.441 76.535-76.535c.002-41.931-34.172-76.263-76.043-76.529z"/><path d="m404.757 364.372-26.38-85.827-16.672.851 26.904 89.078c.659 4.439 4.861 7.514 9.422 6.875 4.583-.643 7.791-4.789 7.164-9.266a7.97 7.97 0 0 0-.438-1.711zm-84.462-102.054-.953-1.963-23.736 17.715c1.373 3.459 2.402 7.651 2.497 12.546l.071 6.145 31.389-23.829c-3.903-3.262-6.686-7.17-9.268-10.614z"/>'
			},
			subcategories: []
		};

		const expected = [bvv_hike, bvv_bike, bvv_mtb, race];

		await expectAsync(bvvRoutingCategoriesProvider()).toBeResolvedTo(expected);
	});

	it('returns routing categories for other languages', async () => {
		spyOn(configService, 'getValue').withArgs('DEFAULT_LANG').and.returnValue('en');

		const hike = {
			id: 'hike',
			label: 'Hiking',
			description: 'Hike on the usually fastest route',
			style: {
				routeColor: 'gray',
				routeBorderColor: 'red'
			},
			subcategories: []
		};
		const bvv_hike = {
			id: 'bvv-hike',
			label: 'Hiking (BVV Freizeitwege)',
			description: 'Hike on "BVV Freizeitwege" tracks where possible',
			style: {
				routeColor: 'red',
				routeBorderColor: 'gray',
				color: 'red',
				icon: '<path d="m217.356 469.8 38.63-108.372-30.089-25.932L177.175 469.8zm172.105-206.5-.223 206.497h15.899V258.686zm.013-12.579 20.336-6.43c5.54-2.696 9.903-8.427 9.903-14.559 0-8.124-6.498-14.719-14.576-14.907v-32.032H389.24v34.864c-13.5 2.986-38.755 8.455-42.805 8.509-4.506.061-8.144-4.02-12.32-8.413-3.602-3.789-12.452-11.705-16.662-15.739-3.988-3.822-21.545-15.246-26.578-17.601-8.821-4.129-41.045-13.238-41.045-13.238l.075.154-.021-.017L217.356 284.2c-3.827 15.308 1.914 30.614 13.394 40.181l21.047 17.101 28.701 23.319c9.95 8.084 11.557 18.836 11.557 18.836l1.114 86.16h36.784v-70.184c0-16.348-1.115-24.895-4.087-37.898s-15.21-26.009-15.21-26.009l-34.743-42.198-.002.001 18.046-63.846c2.867 2.2 5.018 3.94 5.662 4.676 2.602 2.973 15.605 17.092 27.865 23.78s27.867 3.344 27.867 3.344l34.122-10.744v.002zm-215.761 34.875c-15.499-5.163-25.831-22.384-20.665-37.882l10.332-34.44c10.333-30.998 44.773-48.218 75.771-39.607l-27.553 91.268c-5.166 17.218-20.664 25.829-37.885 20.661z"/>'
			},
			subcategories: [hike]
		};
		const bayernnetzBike = {
			id: 'bayernnetz-bike',
			label: 'Bicycle (Bayernnetz)',
			description: 'Ride a bicycle on "Bayernnetz" tracks where possible',
			style: {
				routeColor: 'blue',
				routeBorderColor: 'gray'
			},
			subcategories: []
		};
		const bike = {
			id: 'bike',
			label: 'Bicycle',
			description: 'Ride a bicycle on the usually fastest route',
			style: {
				routeColor: 'gray',
				routeBorderColor: 'green'
			},
			subcategories: []
		};
		const bvv_bike = {
			id: 'bvv-bike',
			label: 'Bicycle (BVV Freizeitwege)',
			description: 'Ride a bicycle on "BVV Freizeitwege" tracks where possible',
			style: {
				routeColor: 'green',
				routeBorderColor: 'gray',
				color: 'green',
				icon: '<path d="M426.365 257.229c0-9.706-7.881-17.575-17.6-17.575h-.035v-.044h-45.962s-4.828.267-10.63-7.087c-44.291-54.922-51.378-65.552-65.551-65.552h-8.856c-14.173 0-24.803 10.63-76.181 62.009-19.488 19.488-17.717 44.291 1.771 56.688l54 31.765-.276 76.663c-.021.365-.035.732-.035 1.104 0 .336.01.67.027 1.004l-.004 1.08h.094a18.78 18.78 0 0 0 18.666 16.678c9.67 0 17.628-7.297 18.666-16.678h.009v-.064c.071-.664.109-1.338.109-2.02a18.98 18.98 0 0 0-.109-2.02v-80.922c0-12.479-10.08-20.959-11.52-22.719-.783-.957-10.32-10.574-18.859-19.146l38.442-34.325 26.574 28.346c6.082 6.827 14.172 10.629 23.031 10.629h57.373l-.001-.02c9.376-.401 16.857-8.336 16.857-17.794zm-52.459-142.938c-.959-2.267-3.229-5.702-5.494-8.317s-6.886-7.147-11.68-9.868-9.332-4.845-19.992-5.036c-10.459-.188-13.947 1.332-18.446 2.527-9.667 2.567-23.795 9.849-25.626 12.29s-1.312 3.86 1.395 6.188c.947.814 2.405 1.719 3.9 2.553a35.28 35.28 0 0 0-4.289 16.911c0 19.569 15.864 35.433 35.434 35.433s35.433-15.864 35.433-35.433c0-3.664-.557-7.197-1.589-10.522 3.357-.396 8.726-1.163 10.211-2.491 1.655-1.482 1.701-1.968.743-4.235zm23.949 195.057 3.163 19.721c23.259 5.143 40.661 25.871 40.661 50.678 0 28.672-23.243 51.915-51.916 51.915s-51.914-23.243-51.914-51.915c0-23.473 15.586-43.283 36.969-49.701l7.188 46.535c.035 4.154 3.493 7.512 7.757 7.512 4.286 0 7.761-3.391 7.761-7.576 0-.557-.066-1.1-.184-1.623l-14.9-92.885h-15.042l4.508 29.182c-30.401 7.971-53.007 35.745-53.007 68.557 0 38.975 31.89 70.865 70.866 70.865s70.866-31.891 70.866-70.865c0-36.244-27.572-66.352-62.776-70.4zM335.273 277.8l-35.004 27.899c.582 2.035.934 4.227.934 6.559v12.335l52.756-42.553h-3.321a29.73 29.73 0 0 1-15.365-4.24zM216.78 321.078l7.968-15.428-12.854-7.561-41.724 79.643a7.395 7.395 0 0 0-.69 1.481c-1.33 3.968.886 8.288 4.95 9.65 4.042 1.356 8.388-.729 9.742-4.657l23.857-46.189c12.768 9.456 21.051 24.62 21.051 41.729 0 28.672-23.244 51.915-51.916 51.915s-51.915-23.243-51.915-51.915 23.243-51.916 51.915-51.916c2.422 0 4.8.18 7.133.5l9.188-17.537a70.43 70.43 0 0 0-16.321-1.914c-38.977 0-70.866 31.891-70.866 70.867s31.89 70.865 70.866 70.865 70.866-31.891 70.866-70.865c.002-24.332-12.43-45.894-31.25-58.668z"/>'
			},
			subcategories: [bike, bayernnetzBike]
		};
		const mtb = {
			id: 'mtb',
			label: 'Mountain bike',
			description: 'Ride a mountain bike on the usually fastest route',
			style: {
				routeColor: 'gray',
				routeBorderColor: 'SpringGreen'
			},
			subcategories: []
		};
		const bvv_mtb = {
			id: 'bvv-mtb',
			label: 'Mountain bike (Freizeitwege)',
			description: 'Ride a mountain bike on "BVV Freizeitwege" tracks where possible',
			style: {
				routeColor: 'SpringGreen',
				routeBorderColor: 'gray',
				color: 'SpringGreen',
				icon: '<path d="M317.766 90.578c21.144 0 38.277 16.837 38.277 37.607s-17.134 37.608-38.277 37.608-38.287-16.837-38.287-37.608 17.142-37.607 38.287-37.607zM129.194 223.822c-13.351-9.461-13.265-28.265-3.638-41.385l25.01-29.976c19.237-22.479 51.782-26.096 74.657-7.192l3.81 3.778-57.729 71.2c-11.54 13.111-28.769 14.917-42.11 3.575z"/><path d="M285.067 110.4s-7.254-3.638-10.041-6.251-3.27-4.15-1.16-6.636 17.758-9.435 28.335-11.627c4.921-1.021 8.77-2.44 20.045-1.671 11.493.785 16.27 3.284 21.289 6.43s9.75 8.203 12.05 11.098 4.555 6.661 5.463 9.115.83 2.969-1.038 4.449-8.915 1.956-12.319 2.154-62.624-7.061-62.624-7.061zm136.124 223.559a7.857 7.857 0 0 0-.695-1.595l-43.11-87.32-18.914-2.027 46.694 95.758c1.332 4.212 5.955 6.565 10.361 5.26 4.433-1.313 6.969-5.823 5.664-10.076zm-107.235-30.051 41.981-61.162-18.106-1.941-29.726 42.53a8.867 8.867 0 0 0-.843 1.099l6.694 19.474zm-92.867 3.405-42.348 79.445a7.73 7.73 0 0 0-.745 1.573c-1.437 4.21.956 8.795 5.346 10.241 4.365 1.439 9.059-.774 10.521-4.943l43.004-81.821-15.778-4.495z"/><path d="m213.263 322.072-14.356 26.88c17.731 6.3 30.823 23.229 30.823 42.506 0 24.444-21.047 45.128-45.921 45.128s-45.92-20.684-45.92-45.128 21.047-45.13 45.92-45.13c2.164 0 4.295.166 6.389.468l14.667-27.64a77.193 77.193 0 0 0-21.056-2.914c-42.094 0-76.535 33.847-76.535 75.216s34.441 75.215 76.535 75.215 76.536-33.848 76.536-75.215c0-31.126-19.498-57.989-47.082-69.386zm200.181-62.26a77.3 77.3 0 0 0-17.738 2.057l13.754 28.225a44.92 44.92 0 0 1 3.984-.189c24.875 0 45.922 20.694 45.922 45.143s-21.047 45.128-45.922 45.128-45.922-20.684-45.922-45.128c0-20.041 14.149-37.553 32.952-43.217l-13.496-27.353c-29.153 10.644-50.07 38.324-50.07 70.569 0 41.368 34.441 75.215 76.536 75.215s76.535-33.847 76.535-75.215c.001-41.38-34.44-75.235-76.535-75.235zm-98.129-29.988 71.949 6.353 3.293-30.879-54.26-5.169-64.472-47.499c-11.479-9.401-26.787-7.521-34.441 3.762-19.133 20.684-47.834 54.531-63.142 73.334-17.22 20.684-9.567 52.653 17.221 60.178l41.202 11.687 40.68 11.537 25.597 73.479c1.486 7.075 8.033 12.406 15.889 12.406 8.951 0 16.208-6.921 16.208-15.457 0-1.284-.182-2.524-.492-3.717l.017-.005-.086-.253a15.01 15.01 0 0 0-.571-1.675l-31.283-91.657-63.155-31.029 43.489-52.237 36.357 26.841z"/><ellipse cx="388.335" cy="220.755" rx="16.2" ry="15.457"/>'
			},
			subcategories: [mtb]
		};
		const race = {
			id: 'racingbike',
			label: 'Racing bike',
			description: 'Ride a racing bike on the usually fastest route',
			style: {
				routeColor: 'gray',
				routeBorderColor: 'purple',
				color: 'gray',
				icon: '<path d="m423.832 231.177-55.65.515c-12.014 1.366-21.533-45.385-42.041-71.06-2.312-2.894-4.764-5.521-7.375-7.78 0 0-7.074-5.691-18.396-5.691-15.307 0-42.451 12.457-109.281 56.238-21.048 21.047-19.135 47.834 1.912 61.227l11.074 6.516 22.35 13.144 25.891 15.229v84.627l.056.002c-.032.451-.056.904-.056 1.365 0 10.207 8.275 18.482 18.484 18.482s18.482-8.275 18.482-18.482a18.5 18.5 0 0 0-.07-1.551l-.004-88.533c-.303-15.794-10.329-24.302-10.329-24.302l-19.632-19.085 52.633-28.468 14.092 29.021c5.739 7.653 12.456 17.622 30.32 17.622l67.541-3.445c9.828 0 17.794-7.964 17.794-17.792s-7.967-17.799-17.795-17.799zm-78.145-92.299s-7.801-4.662-10.676-7.321-3.763-6.978-1.587-9.508 18.314-9.6 29.219-11.83c5.074-1.039 9.043-2.484 20.668-1.701 11.852.799 16.779 3.342 21.957 6.543s10.059 8.346 12.43 11.292 4.699 6.778 5.637 9.275.856 3.021-1.071 4.526-9.196 1.991-12.708 2.192-63.869-3.468-63.869-3.468zm-145.07 141.139-43.386 83.742a7.88 7.88 0 0 0-.745 1.6c-1.437 4.285.957 8.951 5.346 10.424 4.366 1.463 9.059-.789 10.521-5.031l42.402-82.092-14.138-8.643z"/><circle cx="379.271" cy="150.812" r="38.268"/><path d="m192.645 295.646-6.155 11.941c24.083 8.902 41.254 32.064 41.254 59.24 0 34.873-28.27 63.141-63.142 63.141S101.46 401.7 101.46 366.827s28.27-63.141 63.142-63.141c3.221 0 6.385.244 9.476.709l6.406-12.43a76.056 76.056 0 0 0-15.882-1.674c-42.095 0-76.535 34.441-76.535 76.535s34.441 76.535 76.535 76.535 76.536-34.441 76.536-76.535c0-32.206-20.165-59.934-48.493-71.18zm202.201-5.333 4.195 13.578c32.682 2.4 58.457 29.656 58.457 62.951 0 34.871-28.27 63.141-63.143 63.141s-63.141-28.27-63.141-63.141c0-32.064 23.906-58.527 54.863-62.584l-4.004-12.953c-36.311 5.92-64.254 37.621-64.254 75.537 0 42.094 34.44 76.535 76.535 76.535s76.535-34.441 76.535-76.535c.002-41.931-34.172-76.263-76.043-76.529z"/><path d="m404.757 364.372-26.38-85.827-16.672.851 26.904 89.078c.659 4.439 4.861 7.514 9.422 6.875 4.583-.643 7.791-4.789 7.164-9.266a7.97 7.97 0 0 0-.438-1.711zm-84.462-102.054-.953-1.963-23.736 17.715c1.373 3.459 2.402 7.651 2.497 12.546l.071 6.145 31.389-23.829c-3.903-3.262-6.686-7.17-9.268-10.614z"/>'
			},
			subcategories: []
		};

		const expected = [bvv_hike, bvv_bike, bvv_mtb, race];

		await expectAsync(bvvRoutingCategoriesProvider()).toBeResolvedTo(expected);
	});
});
