/**
 * @module modules/topics/components/menu/TopicsContentPanel
 */
import { html, nothing } from 'lit-html';
import { $injector } from '../../../../injection';
import { setCurrent } from '../../../../store/topics/topics.action';
import css from './topicsContentPanel.css';
import commonTopicsCss from './assets/topics.css';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { setIndex } from '../../../../store/topicsContentPanel/topicsContentPanel.action';
import { AbstractMvuContentPanel } from '../../../menu/components/mainMenu/content/AbstractMvuContentPanel';

/**
 * @readonly
 * @enum {Number}
 */
export const TopicsContentPanelIndex = Object.freeze({
	TOPICS: 0,
	CATALOG_0: 1,
	CATALOG_1: 2
});

const Update_CurrentTopicId = 'update_currentTopicId';
const Update_TopicsReady = 'update_TopicsReady';
const Update_ContentIndex = 'update_ContentIndex';
/**
 * @class
 * @author taulinger
 * @author alsturm
 */
export class TopicsContentPanel extends AbstractMvuContentPanel {
	constructor() {
		super({
			currentTopicId: null,
			topicsReady: false,
			contentIndex: null
		});
		const { TopicsService: topicsService, TranslationService: translationService } = $injector.inject('TopicsService', 'TranslationService');
		this._topicsService = topicsService;
		this._translationService = translationService;
	}

	update(type, data, model) {
		switch (type) {
			case Update_CurrentTopicId:
				return { ...model, currentTopicId: data };
			case Update_TopicsReady:
				return { ...model, topicsReady: data };
			case Update_ContentIndex:
				return { ...model, contentIndex: data };
		}
	}

	onInitialize() {
		this.observe(
			(store) => store.topics.current,
			(current) => {
				this.signal(Update_CurrentTopicId, current);
			}
		);
		this.observe(
			(store) => store.topics.ready,
			(ready) => {
				this.signal(Update_TopicsReady, ready);
			}
		);
		this.observe(
			(store) => store.topicsContentPanel.index,
			(index) => {
				this.signal(Update_ContentIndex, index);
			}
		);
	}

	onAfterRender() {
		const { currentTopicId } = this.getModel();
		if (currentTopicId) {
			//we add and update the topic specific hue value
			const topics = this._topicsService.all();
			const topic = topics.filter((t) => t.id === currentTopicId)[0];
			if (!document.getElementById(TopicsContentPanel.Global_Topic_Hue_Style_Id)) {
				const styleElement = document.createElement('style');
				styleElement.id = TopicsContentPanel.Global_Topic_Hue_Style_Id;
				document.head.appendChild(styleElement);
			}
			const style = document.getElementById(TopicsContentPanel.Global_Topic_Hue_Style_Id);
			style.innerHTML = `*{--topic-hue: ${topic.style.hue || 0};}`;
		}
	}

	onWindowLoad() {
		//append common styles for all topics
		if (!document.getElementById(TopicsContentPanel.Global_Topics_Common_Style_Id)) {
			const style = document.createElement('style');
			style.innerHTML = commonTopicsCss;
			style.id = TopicsContentPanel.Global_Topics_Common_Style_Id;
			document.head.appendChild(style);
		}
	}

	createViewHelper(state) {
		const { currentTopicId, contentIndex } = state;

		const topics = this._topicsService.all();

		const getActiveClass = (id) => {
			return currentTopicId === id ? 'active' : '';
		};

		const getTabIndex = () => {
			return contentIndex === TopicsContentPanelIndex.TOPICS ? 0 : -1;
		};

		const getVisibilityClass = () => {
			return contentIndex === TopicsContentPanelIndex.TOPICS ? '' : 'invisible';
		};

		const changeTopic = (topic) => {
			this.scrollIntoView();
			setCurrent(topic.id);
			setIndex(TopicsContentPanelIndex.CATALOG_0);
		};

		const renderTopicStyle = (topic) => {
			const hue = topic.style.hue || 0;
			return `
				.topic-${topic.id}{		
					--topic-theme: hsl(${hue} var(--topic-saturation) var(--topic-lightness));			
				}	
				`;
		};

		const renderTopicIcon = (topic) => {
			if (topic.style.icon) {
				return html`
					<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">${unsafeSVG(topic.style.icon)}</svg>
				`;
			}
			return nothing;
		};
		return { topics, getActiveClass, getTabIndex, getVisibilityClass, changeTopic, renderTopicStyle, renderTopicIcon };
	}

	/**
	 * @override
	 */
	createView(state) {
		const { topicsReady } = state;
		if (topicsReady) {
			const helper = this.createViewHelper(state);

			return html`
				<style>
					${css}
				</style>
				<div class="topics-content-panel ${helper.getVisibilityClass()}">
					<div class="col">
						${helper.topics.map(
							(topic) => html`
					<style>
					${helper.renderTopicStyle(topic)}
					</style>
					<button id='button-${topic.id}' data-test-id tabindex='${helper.getTabIndex()}' class="topic topic-${topic.id} ba-list-item  ${helper.getActiveClass(
						topic.id
					)}" @click=${() => helper.changeTopic(topic)}>
						<span class="ba-list-item__pre">
							<span class="ba-list-item__icon icon-${topic.id}">
							${helper.renderTopicIcon(topic)}
							</span>											
						</span>
						</span>
						<span class="ba-list-item__text ">
							<span class="ba-list-item__primary-text">${topic.label}</span>
							<span class="ba-list-item__secondary-text">${topic.description}</span>
						</span>
						<span class="ba-list-item__after vertical-center">
							<span class="arrow arrow-right"></span>
						</span>
					</button>
				`
						)}
					</div>
					<div class="col">${helper.topics.map((topic) => html` <ba-catalog-content-panel .data=${topic.id}></ba-catalog-content-panel> `)}</div>
				</div>
			`;
		}
		return nothing;
	}

	static get tag() {
		return 'ba-topics-content-panel';
	}

	static get Global_Topics_Common_Style_Id() {
		return 'topicContentPanel_topics_commons_js6dg4asosas9df';
	}

	static get Global_Topic_Hue_Style_Id() {
		return 'topicContentPanel_topic_hue_LDS5GF3BDjdfG6aG5';
	}
}
