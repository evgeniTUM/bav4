import { html } from 'lit-html';
import { MvuElement } from '../../../modules/MvuElement';
import css from './pageContainer.css';

export class PageContainer extends MvuElement {
	constructor() {
		super();
		// this.shadow = this.attachShadow({ mode: 'open' });

	}

	/**
	 * @override
	 */
	createView() {
		const changeWidth = (event) => {
			const container = this.shadowRoot.getElementById('module-container');
			container.style.width = (100 - parseInt(event.target.value)) + '%';
		};

		const getValue = () => {
			return 70;
		}

			const onPreventDragging = (e) => {
				e.preventDefault();
				e.stopPropagation();
			};


		return html`
		<style>${css}</style>
		<div class='slider-container'>
			<input  
				type="range" 
				min="30" 
				max="80" 
				value="${getValue()}" 
				draggable='true' 
				@input=${changeWidth} 
				@dragstart=${onPreventDragging}>
			</input>
		</div>
  		<div style="position: fixed; width: 100%; height:100%">
    		<div class="row">
  	    		<div class="column" style="z-index: 1; flex-grow: 1; z-index: 1; transform: translate3d(0,0,0);">
					${page.content}
				</div>
				<div id="module-container" class="column" style="z-index: 2; width: 30%" >
					<ea-module-container></ea-module-container>
				</div>
			</div>
		</div>`;
	}

	static get INITIAL_WIDTH_EM() {
		return 28;
	}

	static get MIN_WIDTH_EM() {
		return 28;
	}

	static get MAX_WIDTH_EM() {
		return 100;
	}

	static get tag() {
		return 'ea-page-container';
	}

}
