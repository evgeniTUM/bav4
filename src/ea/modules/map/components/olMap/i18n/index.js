import { provide as eaOlMapProvider } from './olMap.provider';
import { $injector } from '../../../../../../injection';
const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('eaOlMapProvider', eaOlMapProvider);
