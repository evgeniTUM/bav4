import { MixerModuleContent } from './MixerModuleContent';

if (!window.customElements.get(MixerModuleContent.tag)) {
	window.customElements.define(MixerModuleContent.tag, MixerModuleContent);
}
