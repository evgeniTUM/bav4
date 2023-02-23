import { infoPopupProvider } from './InfoPopup.provider';
import { $injector } from '../../../../injection';
const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('infoPopupProvider', infoPopupProvider);
