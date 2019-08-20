import { TYPES } from '@ebottacin/ngx-translate-extract';

import { KmlServiceParser } from '../parsers/kml.service.parser';
import { KmlDirectiveParser } from '../parsers/kml.directive.parser';
import { KmlPipeParser } from '../parsers/kml.pipe.parser';
import { KmlFunctionParser } from '../parsers/kml.function.parser';
import { MultipleFileExtractTask } from '../tasks/MultipleFileExtractTask';


import { setupParsers, IoCParserConfig, IoCCompilerConfig, setupCompilers, setupTask, container } from '@ebottacin/ngx-translate-extract';
import { KmlCompiler } from '../compilers/kml.compiler';

const parsersConfig: IoCParserConfig = {
	parsers: [{type: TYPES.SERVICE_PARSER, obj: KmlServiceParser},
			{type: TYPES.DIRECTIVE_PARSER, obj: KmlDirectiveParser},
			{type: TYPES.PIPE_PARSER, obj: KmlPipeParser}
	],
	parsersWithConfig: [{type: TYPES.FUNCTION_PARSER, obj: KmlFunctionParser}]
};

const compilersConfig: IoCCompilerConfig = {
	compilers: [KmlCompiler]
};

export const updateContainer = () => {
	setupCompilers(container, compilersConfig);
	setupParsers(container, parsersConfig);
	setupTask( container, MultipleFileExtractTask);
};

