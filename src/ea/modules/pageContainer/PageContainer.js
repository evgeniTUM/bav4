import { html } from 'lit-html';
import { MvuElement } from '../../../modules/MvuElement';
import css from './pageContainer.css';

export class PageContainer extends MvuElement {

	/**
	 * @override
	 */
	createView() {
		// eslint-disable-next-line no-undef
		const content = page.content;

		return html`
		<style>${css}</style>

  		<div style="position: fixed; width: 100%; height:100%">
    		<div class="row">
  	    		<div class="column" style="z-index: 1; flex-grow: 1; z-index: 1; transform: translate3d(0,0,0);">
					${content}
				</div>
				<div id="module-container" class="column" style="z-index: 2;">
					<ea-module-container></ea-module-container>
				</div>
			</div>
		</div>`;
	}

	static get tag() {
		return 'ea-page-container';
	}

}
