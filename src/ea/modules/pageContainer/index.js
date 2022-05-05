import { PageContainer } from './PageContainer';
if (!window.customElements.get(PageContainer.tag)) {
	window.customElements.define(PageContainer.tag, PageContainer);
}
