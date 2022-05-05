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

  		<div class="page" >
    		<div class="row">
  	    		<div class="main column" >
					${content}
				</div>
				<div class="sidebar column">
					<ea-module-container></ea-module-container>
				</div>
			</div>
		</div>`;
	}

	static get tag() {
		return 'ea-page-container';
	}

}
