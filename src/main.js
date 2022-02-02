import globalCss from './main.css';

//import global css
const style = document.createElement('style');
style.innerHTML = globalCss;
document.head.appendChild(style);

// eslint-disable-next-line no-unused-vars
import * as config from './injection/config';

// register modules
import './modules/footer';
import './modules/map';
import './modules/toolbox';
import './modules/commons';
import './modules/search';
import './modules/topics';
import './modules/utils';
import './modules/iframe';
import './modules/uiTheme';
import './modules/modal';
import './modules/baseLayer';
import './modules/layerManager';
import './modules/notifications';
import './modules/examples';
import './modules/featureInfo';
import './modules/iconSelect';
import './modules/geoResourceInfo';
import './modules/header';
import './modules/menu';
import './ea/modules/header';
import './ea/modules/menu';
import './ea/modules/toolbox';
import './ea/modules/topics';
import './ea/modules/map';
//import './ea/modules/toolbox/components/moduleContainer';
