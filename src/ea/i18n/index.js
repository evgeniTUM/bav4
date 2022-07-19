import { $injector } from '../../injection';
import { provide as eaProvider } from './ea.provider';
const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('eaProvider', eaProvider);
