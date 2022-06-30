import { provide as legendProvider } from './legend.provider';
import { $injector } from '../../../../injection';
const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('legendProvider', legendProvider);
