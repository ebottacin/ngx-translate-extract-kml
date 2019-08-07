import { ServiceParser, KeysPreprocessContextInterface } from '@biesbjerg/ngx-translate-extract';
import { getCompleteKey, findKMLName, getPrjName }  from './kml-utils';


export class KmlServiceParser extends ServiceParser {

	public preprocessKeys(keys: string[], context: KeysPreprocessContextInterface): string[] {
		if (context.ctxObj && typeof context.ctxObj.classDeclaration !== 'undefined') {
			let classNode = context.ctxObj.classDeclaration;
			let sourceFile = context.ctxObj.sourceFile;
			let prjName = getPrjName(context.path);
			let kmlName = findKMLName(sourceFile, classNode);
			return keys.map( key => getCompleteKey(prjName, kmlName, key));
		} else {
			return keys;
		}

	}
}
