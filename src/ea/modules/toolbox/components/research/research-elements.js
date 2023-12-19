import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { getPointResolution } from '../../../../../../node_modules/ol/proj';
import { Circle } from '../../../../../../node_modules/ol/geom';
import { fit } from '../../../../../store/position/position.action';
import { setClick } from '../../../../../store/pointer/pointer.action';
import { Types } from '../../../../domain/researchTypes';
import { activateGeoResource } from '../../../../store/module/ea.action';

export function themeSelectionElement(model, onChange) {
	const { selectedThemeGroupName, selectedThemeId, themeGroups } = model;

	const onCategoryChange = (e) => {
		const themeGroupName = e.target.value;
		const themeGroup = themeGroups.find((tg) => tg.groupName === themeGroupName);
		onChange(themeGroupName, themeGroup.themes[0].themeId);
	};

	const onThemeChange = (e) => {
		const themeId = e.target.value;
		onChange(selectedThemeGroupName, themeId);
	};

	if (themeGroups.length === 0) return html``;

	const themeGroup = themeGroups.find((tg) => tg.groupName === selectedThemeGroupName) ?? themeGroups[0];

	return html`
		<select id="category" @change=${onCategoryChange} title="Kategorie" required>
			${themeGroups.map((tg) => html`<option value="${tg.groupName}" ?selected=${tg.groupName === selectedThemeGroupName}>${tg.groupName}</option>`)}
			<label for="category">Category</label>
		</select>
		<select id="theme" @change=${onThemeChange} title="Thema" required>
			${themeGroup.themes.map((t) => html`<option value="${t.themeId}" ?selected=${t.themeId === selectedThemeId}>${t.displayName}</option>`)}
			<label for="theme">Thema</label>
		</select>
	`;
}

export function filterElement(fieldSpec, propertyFilter, onChange) {
	if (fieldSpec.queryable === true) {
		if (fieldSpec.type === Types.NUMERIC || fieldSpec.type === Types.INTEGER) {
			const { displayname, minLimit, maxLimit } = fieldSpec;
			const { min, max } = propertyFilter;

			const changeMin = (event) => onChange({ type: Types.NUMERIC, min: event.target.value, max });
			const changeMax = (event) => onChange({ type: Types.NUMERIC, min, max: event.target.value });

			return html`
				<div>
					${displayname}
					<input @change=${changeMin} type="range" id="${displayname}-min" name="${displayname}" min="${minLimit}" max="${max}" value=${min} />
					<label for="${displayname}-max">Min: ${min}</label>
					<input @change=${changeMax} type="range" id="${displayname}-max" name="${displayname}" min="${min}" max="${maxLimit}" value=${max} />
					<label for="${displayname}-min">Max: ${max}</label>
				</div>
			`;
		} else if (fieldSpec.type === Types.ENUM) {
			const { displayname, values } = fieldSpec;
			const onValuesChanged = (event) => {
				const options = Array.from(event.target.options);
				const values = options.filter((o) => o.selected).map((o) => o.value);
				onChange({ type: 'enum', values });
			};
			return html`
				<label for=${displayname}><span style="font-weight: bold">${displayname}</span></label>
				<select @change=${onValuesChanged} name=${displayname} id=${displayname} multiple>
					${values.map((v) => html` <option value=${v} ?checked=${values.includes(v)}>${v}</option> `)}
				</select>
			`;
		} else if (fieldSpec.type === Types.CHARACTER) {
			const { displayname, values } = fieldSpec;
			const onValuesChanged = (event) => {
				const options = Array.from(event.target.options);
				const values = options.filter((o) => o.selected).map((o) => o.value);
				onChange({ type: 'char', values });
			};
			return html`
				<label for=${displayname}><span style="font-weight: bold">${displayname}</span></label>
				<select @change=${onValuesChanged} name=${displayname} id=${displayname} multiple>
					${values.map((v) => html` <option value=${v} ?checked=${values.includes(v)}>${v}</option> `)}
				</select>
			`;
		}
	}

	return html``;
}

export function resultsElement(queryResult, fieldsToShow, geoResourceId) {
	const onClick = (result) => () => {
		const { MapService: mapService, CoordinateService: coordinateService } = $injector.inject('MapService', 'CoordinateService');

		activateGeoResource(geoResourceId);

		const position_UTM32N = [Number(result['Ostwert_UTM32N']), Number(result['Nordwert_UTM32N'])];
		const coordinate = coordinateService.transform(position_UTM32N, 25832, mapService.getSrid());

		const circle = new Circle(coordinate, 500 / getPointResolution('EPSG:' + mapService.getSrid(), 1, [coordinate[0], coordinate[1]], 'm'));
		setClick({
			coordinate
		});
		fit(circle.getExtent());
	};
	if (!queryResult) return html`No features were queried yet`;

	const request = queryResult.featureRequest;

	return html`Showing: ${queryResult.features.length} of ${queryResult.hits} hits 
	<br></br>
	Hits: ${request.page * request.pageSize} -
		${(request.page + 1) * request.pageSize}
		<hr></hr>

		<div style="overflow-y: auto">
			<ul>
				${queryResult.features.map(
					(r) =>
						html`<li>
							<div style="border-bottom: solid">
								<div style="display:flex; justify-content: space-between">
									<div style="font-weight: bold">${r.Name}</div>
									<button @click=${onClick(r)}>anzeigen</button>
								</div>
								<ul>
									${fieldsToShow.map((f) => html` <li><span style="color: gray">${f.displayName}:</span> ${r[f.originalKey]}</li> `)}
								</ul>
							</div>
						</li> `
				)}
			</ul>
		</div>`;
}
