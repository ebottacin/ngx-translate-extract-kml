
import { TranslationCollection, CompilerInterface, AbstractCompiler } from '@biesbjerg/ngx-translate-extract';
import { injectable } from 'inversify';

@injectable()
export class KmlCustomCompiler extends AbstractCompiler implements CompilerInterface {

	public extension: string = 'xml';
	public selector: string = 'custom';
	constructor () {
		super();
	}

	public compile(collection: TranslationCollection): string {
		throw new Error('not implemented');
	}

	public parse(contents: string): TranslationCollection {
		throw new Error('not implemented');
	}

}
