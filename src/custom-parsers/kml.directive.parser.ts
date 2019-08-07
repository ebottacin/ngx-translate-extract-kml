import { DirectiveParser, KeysPreprocessContextInterface  } from '@biesbjerg/ngx-translate-extract';
import { getComponentSourceFile, getPrjName, findKMLName, getCompleteKey } from './kml-utils';

export class KmlDirectiveParser extends DirectiveParser {

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
