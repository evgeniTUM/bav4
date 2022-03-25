import { provide as eaMenuProvider } from './menu.provider';
import { $injector } from '../../../../injection';
const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('eaMenuProvider', eaMenuProvider);
