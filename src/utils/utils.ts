import { SyntaxKind, SourceFile, ClassDeclaration, CallExpression, Node, ObjectLiteralExpression, createSourceFile } from 'typescript';
import * as fs from 'fs';
import * as fsPath from 'path';

export interface KmlConfigObj {
	name?: string
}

export interface KmlCompleteKey {
	prjName: string;
	kmlName: string;
	key: string,
	completeKey: string;
}

export function findKMLName(sourceFile: SourceFile, nodes?: ClassDeclaration[]|ClassDeclaration): string {
	if (nodes === undefined) {
		nodes = findClassNodes(sourceFile);
	}
	let kmlConfigObjs: KmlConfigObj[] = [];
	if (Array.isArray(nodes)) {
		for (let node of nodes) {
			kmlConfigObjs.push(...getKMLConfigObj(sourceFile, node));
		}
		switch (kmlConfigObjs.length) {
			case 0: return null;
			case 1: return kmlConfigObjs[0].name;
			default: throw new Error('Errore nel recupero del testo del componente');
		}
	}
}

export function getCompleteKey(prjName: string, kmlName: string, key: string) {
	let result = '';
	result = processToken(prjName, result, '$$');
	result = processToken(kmlName, result, '##');
	result = processToken(key, result, '', false);
	return result;
}

export function parseCompleteKey(completeKey: string): KmlCompleteKey {
	let parts = completeKey.split('.');
	let key = parts[parts.length - 1];
	let kmlName = null;
	let prjName = null;
	if (parts.length > 1) {
		for (let i = 0; i < parts.length - 2; i++) {
			let part = parts[i];
			if (part.startsWith('$$')) {
				prjName = part.substr(2);
			} else if (part.startsWith('##')) {
				kmlName = part.substr(2);
			} else {
				throw new Error ('Token non valido: ' + part);
			}
		}

	}
	return {
		prjName: prjName,
		kmlName: kmlName,
		key: key,
		completeKey: completeKey
	};
}

export function getComponentSourceFile(path: string, template?: string) {
	const dirName = fsPath.dirname(path);
	const fileName  = fsPath.basename(path);
	const extension = fsPath.extname(path);
	// inline component
	if ( extension === 'ts') {
		let contents = typeof template === 'undefined' ? fs.readFileSync(path).toString() : template;
		return createSourceFile(path, contents, null, /*setParentNodes */ false);
	} else {
		const newFileName = fileName.replace(/extension$/, 'ts');
		const newPath = `${dirName}${fsPath.sep}${newFileName}`;
		//try to find component in same dir
		if (fs.existsSync(newPath)) {
			let contents = fs.readFileSync(newPath).toString();
			return createSourceFile(path, contents, null, /*setParentNodes */ false);
		}
		// give up
		throw new Error('non riesco a trovare il file del componente');
	}
}

export function getPrjName(path: string) {
	let rootDir = path.substr(0, path.indexOf('/src'));
	let pkgJson = fs.readFileSync(`${rootDir}${fsPath.sep}package.json`);
	let prjName: string;
	if (pkgJson) {
		prjName = JSON.parse(pkgJson.toString()).name;
	} else {
		prjName = fsPath.dirname(rootDir);
	}
	return prjName;
}

function getKMLConfigObj(sourceFile: SourceFile, node: ClassDeclaration): KmlConfigObj[] {
	const decoratorNodes = findNodes(sourceFile, node, SyntaxKind.Decorator);
		let kmlConfigObjs: KmlConfigObj[] = [];
		if (decoratorNodes) {
			for (let d of decoratorNodes) {
				const identifiers = d.getChildren().reduce( (r: Node[], n: Node) => {
					if (n.kind == SyntaxKind.CallExpression) {
						let expr = n as CallExpression;
						if (expr.expression.kind === SyntaxKind.Identifier && expr.expression.getText(sourceFile) === 'Kml') {
							r.push(expr.arguments[0]);
						}
					}
					return r;
				}, []) as ObjectLiteralExpression[];
				kmlConfigObjs.push(...identifiers.map( identifier => parseKmlConfigObj(sourceFile, node, identifier)));
			}
			return kmlConfigObjs;
		} else {
			return [];
		}
}


function processToken(token: string, result: string, identifier: string, toUpperCase: boolean = true) {
		if (token !== null && token !== undefined) {
			if (result.length > 0 ) {
				result += '.';
			}
			result += identifier + token.toUpperCase();
		}
		return result;
	}

function parseKmlConfigObj(sourceFile: SourceFile, classNode: ClassDeclaration, node: ObjectLiteralExpression): KmlConfigObj {
	let configObj: KmlConfigObj = {};
	switch (node.getChildCount()) {
	case 0:
		configObj.name = parseClassName(sourceFile, classNode);
	default:
		for (let prop of node.properties) {
			let leftValue: Node = prop.getChildAt(0);
			let rightValue: Node = prop.getChildAt(2);
			let key: string = leftValue.getText(sourceFile);
			if (key === 'name') {
				configObj.name =  rightValue.getText(sourceFile).replace(/"/g, '').replace(/\'/g, '');
			}
		}

		if (configObj && typeof configObj['name'] === 'undefined') {
			configObj.name = parseClassName(sourceFile, classNode);
		}
	}
	return configObj;
}

function parseClassName(sourceFile: SourceFile, classNode: ClassDeclaration) {
	return classNode.name.getText(sourceFile);
}


	/**
	 * Find all child nodes of a kind
	 */
function findNodes(sourceFile: SourceFile, node: Node, kind: SyntaxKind): Node[] {
	const childrenNodes: Node[] = node.getChildren(sourceFile);
	const initialValue: Node[] = node.kind === kind ? [node] : [];

	return childrenNodes.reduce((result: Node[], childNode: Node) => {
		return result.concat(findNodes(sourceFile, childNode, kind));
	}, initialValue);
}

function findClassNodes(sourceFile: SourceFile): ClassDeclaration[] {
	return findNodes(sourceFile, sourceFile, SyntaxKind.ClassDeclaration) as ClassDeclaration[];
}


