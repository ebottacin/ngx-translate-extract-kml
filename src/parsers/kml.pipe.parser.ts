import { PipeParser, KeysPreprocessContextInterface } from '@ebottacin/ngx-translate-extract';

import { getComponentSourceFile, findKMLName, getPrjName, getCompleteKey } from '../utils/utils';

export class KmlPipeParser extends PipeParser {

	public preprocessKeys(keys: string[], context: KeysPreprocessContextInterface): string[] {
		if (typeof context !== 'undefined') {
			let sourceFile  = getComponentSourceFile(context.path);
			let prjName = getPrjName(context.path);
			let kmlName = findKMLName(sourceFile);
			keys = keys.map( key => getCompleteKey(prjName, kmlName, key));
		}
		return keys;
	}
}
