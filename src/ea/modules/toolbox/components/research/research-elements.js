import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { getPointResolution } from '../../../../../../node_modules/ol/proj';
import { Circle } from '../../../../../../node_modules/ol/geom';
import { fit } from '../../../../../store/position/position.action';
import { setClick } from '../../../../../store/pointer/pointer.action';
import { FieldProperties } from '../../../../domain/researchTypes';

export function themeSelectionElement(model, onChange) {
	const { selectedThemeGroupName, selectedThemeId, themeGroups } = model;

	const onCategoryChange = (e) => {
		const themeGroupName = e.target.value;
		const themeGroup = themeGroups.find((tg) => tg.groupname === themeGroupName);
		onChange(themeGroupName, themeGroup.themes[0].themeId);
	};

	const onThemeChange = (e) => {
		const themeId = e.target.value;
		onChange(selectedThemeGroupName, parseInt(themeId));
	};

	if (themeGroups.length === 0) return html``;

	const themeGroup = themeGroups.find((tg) => tg.groupname === selectedThemeGroupName) ?? themeGroups[0];

	return html`
		<select id="category" @change=${onCategoryChange} title="Kategorie" required>
			${themeGroups.map((tg) => html`<option value="${tg.groupname}" ?selected=${tg.groupname === selectedThemeGroupName}>${tg.groupname}</option>`)}
			<label for="category">Category</label>
		</select>
		<select id="theme" @change=${onThemeChange} title="Thema" required>
			${themeGroup.themes.map((t) => html`<option value="${t.themeId}" ?selected=${t.themeId === selectedThemeId}>${t.displayname}</option>`)}
			<label for="theme">Thema</label>
		</select>
	`;
}

export function filterElement(fieldSpec, filter, onChange) {
	if (fieldSpec.properties.includes(FieldProperties.QUERYABLE)) {
		if (fieldSpec.type === 'numeric') {
			const { name, minLimit, maxLimit } = fieldSpec;
			const { min, max } = filter;

			const changeMin = (event) => onChange({ type: 'numeric', min: event.target.value, max });
			const changeMax = (event) => onChange({ type: 'numeric', min, max: event.target.value });

			return html`
				<div>
					${name}
					<input @change=${changeMin} type="range" id="${name}-min" name="${name}" min="${minLimit}" max="${max}" value=${min} />
					<label for="${name}-max">Min: ${min}</label>
					<input @change=${changeMax} type="range" id="${name}-max" name="${name}" min="${min}" max="${maxLimit}" value=${max} />
					<label for="${name}-min">Max: ${max}</label>
				</div>
			`;
		} else if (fieldSpec.type === 'enum') {
			const { name, values } = fieldSpec;
			const onValuesChanged = (event) => {
				const options = Array.from(event.target.options);
				const values = options.filter((o) => o.selected).map((o) => o.value);
				onChange({ type: 'enum', values });
			};
			return html`
				<label for=${name}><span style="font-weight: bold">${name}</span></label>
				<select @change=${onValuesChanged} name=${name} id=${name} multiple>
					${values.map((v) => html` <option value=${v}>${v}</option> `)}
				</select>
			`;
		}
	}

	return html``;
}

export function resultsElement(queryResult, fieldsToShow) {
	const onClick = (result) => () => {
		console.log(result);
		const { MapService: mapService, CoordinateService: coordinateService } = $injector.inject('MapService', 'CoordinateService');
		const position_UTM32N = [Number(result['Ostwert_UTM32N']), Number(result['Nordwert_UTM32N'])];
		const coordinate = coordinateService.transform(position_UTM32N, 25832, mapService.getSrid());

		const circle = new Circle(coordinate, 500 / getPointResolution('EPSG:' + mapService.getSrid(), 1, [coordinate[0], coordinate[1]], 'm'));
		setClick({
			coordinate
		});
		fit(circle.getExtent());
	};
	return html`Showing: ${queryResult.results.length} of ${queryResult.hits} hits 
	<br></br>
	Hits: ${queryResult.page * queryResult.pageSize} -
		${(queryResult.page + 1) * queryResult.pageSize}
		<hr></hr>

		<div style="overflow-y: auto">
			<ul>
				${queryResult.results.map(
					(r) =>
						html`<li>
							<div style="border-bottom: solid">
								<div style="display:flex; justify-content: space-between">
									<div style="font-weight: bold">${r.Name}</div>
									<button @click=${onClick(r)}>anzeigen</button>
								</div>
								<ul>
									${fieldsToShow.map((f) => html` <li><span style="color: gray">${f.name}:</span> ${r[f.name]}</li> `)}
								</ul>
							</div>
						</li> `
				)}
			</ul>
		</div>`;
}
