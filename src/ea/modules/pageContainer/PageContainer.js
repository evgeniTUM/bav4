import { html } from 'lit-html';
import { MvuElement } from '../../../modules/MvuElement';
import css from './pageContainer.css';

export class PageContainer extends MvuElement {

	/**
	 * @override
	 */
	createView() {
		// eslint-disable-next-line no-undef
		const pageContent = page.content;

		// eslint-disable-next-line no-undef
		const sidebarContent = sidebar.content;

		return html`
		<style>${css}</style>

  		<div class="page" >
    		<div class="row">
  	    		<div class="main column" >
					${pageContent}
				</div>
				<div class="sidebar column">
					${sidebarContent}
				</div>
			</div>
		</div>`;
	}

	static get tag() {
		return 'ea-page-container';
	}

}
