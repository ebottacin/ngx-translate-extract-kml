import { ExtractTask, TranslationCollection } from '@biesbjerg/ngx-translate-extract';

import { green, bold, dim } from 'colorette';
import * as fs from 'fs';
import * as path from 'path';
import { parseCompleteKey, KmlCompleteKey } from '../utils/utils';

export class MultipleFileExtractTask extends ExtractTask {

	constructor() {
		super();
	}

	public execute(): void {
		if (!this.compiler) {
			throw new Error('No compiler configured');
		}

		this.printEnabledParsers();
		this.printEnabledPostProcessors();
		this.printEnabledCompiler();

		this.out(bold('Extracting:'));
		const extractedMap = this.extractMulti();
		let total = 0;
		this.out(green('\n'));
		for (let key of extractedMap.keys()) {
			let coll = extractedMap.get(key);
			total += coll.count();
			this.out(green(`KmlName: %s =>  Found %d strings.\n`), coll.count());
		}
		this.out(green(`\n\n Found total %d strings.\n`), total);

		this.out(bold('Saving:'));

		this.outputs.forEach(output => {
			let dir: string = output;
			for (let key of extractedMap.keys()) {
				let extracted = extractedMap.get(key);
				let filename: string = `${key}.${this.compiler.extension}`;
				if (!fs.existsSync(output) || !fs.statSync(output).isDirectory()) {
					dir = path.dirname(output);
					filename = path.basename(output);
				}

				const outputPath: string = path.join(dir, filename);

				let existing: TranslationCollection = new TranslationCollection();
				if (!this.options.replace && fs.existsSync(outputPath)) {
					existing = this.compiler.parse(fs.readFileSync(outputPath, 'utf-8'));
				}

				// merge extracted strings with existing
				const draft = extracted.union(existing);

				if (existing.isEmpty()) {
					this.out(dim(`- ${outputPath}`));
				} else {
					this.out(dim(`- ${outputPath} (merged)`));
				}

				// Run collection through post processors
				const final = this.process(draft, extracted, existing);

				// Save to file
				this.save(outputPath, final);
			}
		});

		this.out(green('\nDone.\n'));
	}

	protected extractMulti(): Map<String, TranslationCollection> {
		let extractedMap: Map<String, TranslationCollection> = new Map<String, TranslationCollection>();
		this.inputs.forEach(dir => {
			this.readDir(dir, this.options.patterns).forEach(path => {
				this.out(dim('- %s'), path);
				const contents: string = fs.readFileSync(path, 'utf-8');
				this.parsers.forEach(parser => {
					let map = this.split(parser.extract(contents, path));
					this.mergeMap(extractedMap, map);
				});
			});
		});
		return extractedMap;
	}

	private split(collection: TranslationCollection): Map<String, TranslationCollection> {
		let map: Map<String, TranslationCollection> = new Map<String, TranslationCollection>();
		let keys = Object.keys(collection.values);
		map = keys.map( key => parseCompleteKey(key))
			.reduce( (map: Map<String, TranslationCollection>, key: KmlCompleteKey ) => {
				let kmlName = key.kmlName !== null ? key.kmlName : 'default';
				let item = new TranslationCollection();
				item.add(this.getExtractedKey(key), collection.get(key.completeKey))
				let mapItem: TranslationCollection;
				if (map.has(kmlName)) {
					mapItem = map.get(kmlName);
				} else {
					mapItem = new TranslationCollection();
				}
				map.set(kmlName, mapItem.union(item));
				return map;
			}, new Map<String, TranslationCollection>());
		return map;
	}

	private mergeMap(map:  Map<String, TranslationCollection>, mapToMerge:  Map<String, TranslationCollection>):  Map<String, TranslationCollection> {
		for (let key of mapToMerge.keys()) {
			if (map.has(key)) {
				let coll = map.get(key);
				let collToMerge = mapToMerge.get(key);
				map.set(key, coll.union(collToMerge));
			} else {
				map.set(key, mapToMerge.get(key));
			}
		}
		return map;
	}

	private getExtractedKey(key: KmlCompleteKey) {
		return `${key.prjName}.${key.key}`;
	}
}
