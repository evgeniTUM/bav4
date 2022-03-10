import { html, nothing } from 'lit-html';
import { $injector } from '../../../../../injection';
import { TopicsContentPanel, TopicsContentPanelIndex } from '../../../../../modules/topics/components/menu/TopicsContentPanel';
import css from '../../../../../modules/topics/components/menu/topicsContentPanel.css';


/**
 * @class
 * @author kunze
 */
export class EaTopicsContentPanel extends TopicsContentPanel {

	constructor() {
		super();
		const { TopicsService: topicsService, TranslationService: translationService }
			= $injector.inject('TopicsService', 'TranslationService');
		this._topicsService = topicsService;
//		this._translationService = translationService;
	}

        /**
         * //set extended hls - style when theme has been selected
         * @override
         * @returns {undefined}
         */
	initialize() {
		this.observe(['topicsReady', 'contentIndex'], () => this.render());
		this.observe('currentTopicId', (currentTopicId) => {
			//we add and update the topic specific hue value
			const topics = this._topicsService.all();
			const topic = topics.filter(t => t.id === currentTopicId)[0];

			if (!document.getElementById(TopicsContentPanel.Global_Topic_Hue_Style_Id)) {
				const styleElement = document.createElement('style');
				styleElement.id = TopicsContentPanel.Global_Topic_Hue_Style_Id;
				document.head.appendChild(styleElement);
			}
			const style = document.getElementById(EaTopicsContentPanel.Global_Topic_Hue_Style_Id);
                        //set extended hls - style when theme has been selected
			style.innerHTML = `*{--topic-hue: ${topic.style.hue || 0};} *{--topic-saturation: ${topic.style.sat || 0}%;} *{--topic-lightness: ${topic.style.light || 0}%;}`;
		});
            }
        /**
	 * @override
	 */
        createViewHelper(state) {
		const { currentTopicId, topicsReady, contentIndex } = state;
                
                const viewHelper = super.createViewHelper(state) ;

		const renderTopicStyle = (topic) => {
                         window.console.log('EaTopicsContentPanel.renderTopicStyle');
			const hue = topic.style.hue || 0;
                        const sat = topic.style.sat;
                        const light = topic.style.light || 40;
			return `
				.topic-${topic.id}{		
					--topic-theme: hsl(${hue} ${sat}% ${light}%);
				}	
				`;
		};

        return { topics : viewHelper.topics , getActiveClass : viewHelper.getActiveClass, getTabIndex : viewHelper.getTabIndex,
                        getVisibilityClass : viewHelper.getVisibilityClass,
                        changeTopic : viewHelper.changeTopic,
                        renderTopicStyle,
                        renderTopicIcon : viewHelper.renderTopicIcon
		}
        }

	/**
	 * @override
         * erst aktivieren wenn die Frage mit dem Tooltip entschieden ist, zentraler Punkt ist hier der Wegfall der zweiten Zeile und die klasse vertical-center
	 */
//	createView(state) {
//            const { currentTopicId, topicsReady, contentIndex } = state;
//		if (topicsReady) {
//                        let viewHelper = this.createViewHelper(state);
//
//			return html`
//        	<style>${css}</style>
//			<div class="topics-content-panel ${viewHelper.getVisibilityClass()}">
//				<div class="col">
//				${viewHelper.topics.map(topic => html`
//					<style>
//					${viewHelper.renderTopicStyle(topic)}
//					</style>
//					<button tabindex='${viewHelper.getTabIndex()}' class="topic topic-${topic.id} ba-list-item  ${viewHelper.getActiveClass(topic.id)}" @click=${() => viewHelper.changeTopic(topic)}>
//						<span class="ba-list-item__pre">
//							<span class="ba-list-item__icon icon-${topic.id}">
//							${viewHelper.renderTopicIcon(topic)}
//							</span>											
//						</span>
//						</span>
//						<span class="ba-list-item__text vertical-center">
//							<span class="ba-list-item__primary-text">${topic.label}</span>
//						</span>
//						<span class="ba-list-item__after vertical-center">
//							<span class="arrow arrow-right"></span>
//						</span>
//					</button>
//				`)}
//				</div>
//				<div class="col">
//					${viewHelper.topics.map(topic => html`
//						<ba-catalog-content-panel .data=${topic.id}></ba-catalog-content-panel>
//					`)}
//				</div>
//			</div>
//			`;
//		}
//		return nothing;
//	}
         /**
	 * @override
	 */
        static get tag() {
		return 'ea-topics-content-panel';
	}
}
