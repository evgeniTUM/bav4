import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';

export function themeSelectionElement(model, onChange) {
	const { themes, theme, category } = model;

	const onCategoryChange = (e) => {
		const category = e.target.value;
		const theme = themes[category][0];
		console.log(category, theme);
		onChange(category, theme);
	};

	const onThemeChange = (e) => {
		const theme = e.target.value;
		onChange(category, theme);
	};

	return themes && category
		? html`
				<select id="category" @change=${onCategoryChange} title="Kategorie" required>
					${Object.keys(themes).map((e) => html`<option value="${e}" ?selected=${e === category}>${e}</option>`)}
					<label for="category">Category</label>
				</select>
				<select id="theme" @change=${onThemeChange} title="Thema" required>
					${themes[category].map((e) => html`<option value="${e}" ?selected=${e === theme}>${e}</option>`)}
					<label for="theme">Thema</label>
				</select>
		  `
		: '';
}

export function filterElement(fieldSpec, filter, onChange) {
	if (fieldSpec.type === 'numeric') {
		const { type, name, minLimit, maxLimit } = fieldSpec;
		const { min, max } = filter;

		const changeMin = (event) => onChange(event.target.value, max);
		const changeMax = (event) => onChange(min, event.target.value);

		return html`
			<div>
				${name}
				<input @change=${changeMin} type="range" id="${name}-min" name="${name}" min="${minLimit}" max="${max}" value=${min} />
				<label for="${name}-max">Min: ${min}</label>
				<input @change=${changeMax} type="range" id="${name}-max" name="${name}" min="${min}" max="${maxLimit}" value=${max} />
				<label for="${name}-min">Max: ${max}</label>
			</div>
		`;
	}
	return html``;
}

export function resultsElement(results) {
	return html` Results: ${results.length}
		<ul>
			${results.map((r) => html`<li>${r.Name}</li>`)}
		</ul>`;
}
