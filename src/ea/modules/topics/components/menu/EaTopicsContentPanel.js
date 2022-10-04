import { $injector } from '../../../../../injection';
import { TopicsContentPanel } from '../../../../../modules/topics/components/menu/TopicsContentPanel';


/**
 * @class
 * @author kunze
 */
export class EaTopicsContentPanel extends TopicsContentPanel {

	constructor() {
		super();
		const { TopicsService: topicsService }
			= $injector.inject('TopicsService');
		this._topicsService = topicsService;
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
		const viewHelper = super.createViewHelper(state) ;

		const renderTopicStyle = (topic) => {
			const hue = topic.style.hue || 0;
			const sat = topic.style.sat;
			const light = topic.style.light || 40;
			return `
				.topic-${topic.id}{		
					--topic-theme: hsl(${hue} ${sat}% ${light}%);
				}	
				`;
		};

		return { topics: viewHelper.topics, getActiveClass: viewHelper.getActiveClass, getTabIndex: viewHelper.getTabIndex,
			getVisibilityClass: viewHelper.getVisibilityClass,
			changeTopic: viewHelper.changeTopic,
			renderTopicStyle,
			renderTopicIcon: viewHelper.renderTopicIcon
		};
	}

	/**
	 * @override
	 */
	static get tag() {
		return 'ea-topics-content-panel';
	}
}
