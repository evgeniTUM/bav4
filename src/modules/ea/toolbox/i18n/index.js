import { provide as eaToolboxProvider } from './ea-toolbox.provider';
import { $injector } from '../../../../injection';
const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('eaToolboxProvider', eaToolboxProvider);
