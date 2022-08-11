import { provide as dsgvoProvider } from './dsgvo.provider';
import { $injector } from '../../../../injection';
const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('dsgvoProvider', dsgvoProvider);
