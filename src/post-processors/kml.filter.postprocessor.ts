import { PostProcessorInterface, TranslationCollection } from '@ebottacin/ngx-translate-extract';
import { parseCompleteKey, KmlCompleteKey } from '../utils/utils';

export class KmlFilterPostProcessor  implements PostProcessorInterface {

	public name: 'KmkFilter';

	public process(draft: TranslationCollection, extracted: TranslationCollection, existing: TranslationCollection): TranslationCollection {
		let keys = Object.keys(extracted.values);
		if (keys.length > 0) {
			keys.map( key => parseCompleteKey(key))
				.reduce ( (ks: KmlCompleteKey[], k: KmlCompleteKey) => {
					let retValue = ks.filter( ksi => ksi.prjName === k.prjName || ksi.kmlName === k.kmlName);
					retValue.push(k);
					return retValue;
				}, []);
		}
		return null;
	}
}
