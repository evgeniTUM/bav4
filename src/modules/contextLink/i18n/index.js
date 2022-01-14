
import { contextLinkProvide } from './contextLink.provider';
import { $injector } from '../../../injection';
const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('contextLinkProvide', contextLinkProvide);


