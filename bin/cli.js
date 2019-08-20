#! /usr/bin/env node

//need to be imported once per application: @see  https://github.com/inversify/InversifyJS/issues/262#issuecomment-227593844
let reflectMetadata = require('reflect-metadata');

//IoC configuration: imported here to allow redefintion for usage as library
let ngxTranslateExtract = require('@ebottacin/ngx-translate-extract');
// setup Standard IoC config
let inversifyConfig = ngxTranslateExtract.inversifyConfig;

// load custom classes and inject in container
let inversifyConfigKml = require('../dist/ioc/inversify.config.kml');
inversifyConfigKml.updateContainer();

// run cli
let extractTask = ngxTranslateExtract.getExtractTask();

// run app
extractTask.execute();

