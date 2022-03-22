import { provide as contributeProvider } from './contribute.provider';
import { $injector } from '../../../injection';
const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('contributeProvider', contributeProvider);
