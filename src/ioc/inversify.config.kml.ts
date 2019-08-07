import { TYPES } from '@biesbjerg/ngx-translate-extract';

import { KmlServiceParser } from '../custom-parsers/kml.service.parser';
import { KmlDirectiveParser } from '../custom-parsers/kml.directive.parser';
import { KmlPipeParser } from '../custom-parsers/kml.pipe.parser';
import { KmlFunctionParser } from '../custom-parsers/kml.function.parser';


import { setupParsers, IoCParserConfig, IoCCompilerConfig, setupCompilers, container } from '@biesbjerg/ngx-translate-extract';
import { KmlCustomCompiler } from '../custom-compilers/kml-custom.compiler';

const parsersConfig: IoCParserConfig = {
	parsers: [{type: TYPES.SERVICE_PARSER, obj: KmlServiceParser},
			{type: TYPES.DIRECTIVE_PARSER, obj: KmlDirectiveParser},
			{type: TYPES.PIPE_PARSER, obj: KmlPipeParser}
	],
	parsersWithConfig: [{type: TYPES.FUNCTION_PARSER, obj: KmlFunctionParser}]
};

const compilersConfig: IoCCompilerConfig = {
	compilers: [KmlCustomCompiler]
};

export const updateContainer = () => {
	setupCompilers(container, compilersConfig);
	setupParsers(container, parsersConfig);
};

