import { provide as baProvide } from './header.provider';
import { provide as eaProvide } from './ea_header.provider';
import { $injector } from '../../../injection';
const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('headerProvider', baProvide);
translationService.register('eaHeaderProvider', eaProvide);
