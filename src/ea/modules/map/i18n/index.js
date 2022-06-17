import { $injector } from '../../../../injection';
import { provide as eaMapProvider } from './eaMap.provider.js';

const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('eaMapProvider', eaMapProvider);
