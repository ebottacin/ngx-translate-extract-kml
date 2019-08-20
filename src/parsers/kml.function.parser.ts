import { FunctionParser, KeysPreprocessContextInterface } from '@ebottacin/ngx-translate-extract';

export class KmlFunctionParser extends FunctionParser {

public preprocessKeys(keys: string[], context: KeysPreprocessContextInterface): string[] {
		// if (typeof context !== 'undefined') {
		// 	let sourceFile  = getComponentSourceFile(context.path);
		// 	let prjName = getPrjName(context.path);
		// 	let kmlName = findKMLName(sourceFile);
		// 	keys.map( key => getCompleteKey(prjName, kmlName, key));
		// }
		return keys;
	}
}
