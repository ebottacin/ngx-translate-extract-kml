import { TranslationCollection, CompilerInterface, TranslationType, AbstractCompiler } from '@biesbjerg/ngx-translate-extract';
import { injectable } from 'inversify';

import { xml2json, json2xml }  from 'xml-js';
import { parseCompleteKey, getCompleteKey } from '../utils/utils';

interface kionMLInterface {
	_attributes: {
		'xmlns:kion': string,
		module: string,
		target: string,
		lang: string,
		xslName?: string
	}
}

interface KionMSG {
	_attributes: {
		id: number
	},
	_text: string
}

@injectable()
export class KmlCompiler extends AbstractCompiler implements CompilerInterface {

	private static readonly options =  {compact: true, ignoreComment: true, spaces: 4};
	public extension: string = 'xml';
	public selector: string = 'kml';

	public compile(collection: TranslationCollection): string {
		let keys = Object.keys(collection.values);
		let header: Object =  {
			_declaration: {
				_attributes: {
					version: '1.0',
					encoding: 'ISO-8859-1'
				}
			}
		};
		if (keys.length == 0) {
			return json2xml(JSON.stringify(header), KmlCompiler.options);
		} else {
			let completeKey = parseCompleteKey(keys[0]);
			let msgs = [];
			for (let key of keys) {
				let completeKey = parseCompleteKey(key);
				let value = collection.get(key);
				if (value === null) {
					value = completeKey.msg === null ? completeKey.key : completeKey.msg;
				}
				msgs.push({
					_attributes: {
						id: completeKey.id === null ? completeKey.key : completeKey.id
					},
					_text : value
				});
			}
			let obj: Object =  {
					'kion:ml': {
						_attributes: {
							'xmlns:kion': 'http://www.kion.it/webesse3/multilingua',
							module: completeKey.prjName,
							xsl: completeKey.kmlName,
							target: 'kion',
							lang: 'ita'
						},
						'kion:msg': msgs
					}
				};
			return json2xml(JSON.stringify(obj), KmlCompiler.options);
		}
	}

	public parse(contents: string): TranslationCollection {
		try {
			let json = JSON.parse(xml2json(contents, KmlCompiler.options));
			const mlNode = <kionMLInterface> json['kion:ml'];
			const msgs = <KionMSG[]> json['kion:msg'];
			let values: TranslationType = {};

			if (msgs !== undefined) {
				for (let msg of msgs) {
						const completeKey = getCompleteKey(mlNode._attributes.module, mlNode._attributes.xslName, msg._attributes.id + '');
						values[completeKey] = msg._text;
					}
			}

			return new TranslationCollection(values);
		} catch (e) {
			throw new Error (`errore ${e} nel parsing della stringa ${contents}`);
		}
	}

}
