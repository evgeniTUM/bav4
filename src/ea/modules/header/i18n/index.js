import { provide as eaHeaderProvider} from './header.provider';
import { $injector } from '../../../../injection';
const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('eaHeaderProvider', eaHeaderProvider);
