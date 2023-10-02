import path from 'path';

import { shouldAppendJsExtension } from '../src/lib/appendJsExtension';
import { shouldAppendIndexJsExtension } from '../src/lib/appendIndexJsExtension';

type Scenario = {
  // the file that is using the import statement
  // relative to the "tests/fixtures" director
  // for simplicity
  file: string
  specifier: string

  // expected result
  appendJs: boolean
  appendIndexJs: boolean
}

const makeScenario = (
  file: string,
  specifier: string,
  appendJs: boolean,
  appendIndexJs: boolean,
): Scenario => ({
  file,
  specifier,
  appendJs,
  appendIndexJs
});

const testData: Scenario[] = [
  makeScenario('importingFile.js', 'fs/promises', false, false),
  makeScenario('importingFile.js', 'colors/safe', true, false),
  makeScenario('importingFile.js', './mod', true, false),
  makeScenario('importingFile.js', './mod.js', false, false),
  makeScenario('importingFile.js', 'modNoPackageJSON', false, false),
  makeScenario('importingFile.js', 'modNoPackageJSON/fp', true, false),
  makeScenario('importingFile.js', 'modWithPackageJSONAndMatchingExports/fp', false, false),
  makeScenario('importingFile.js', 'modWithPackageJSONButNoExportsAtAll/fp', true, false),
  makeScenario('importingFile.js', 'modNoPackageJSON', false, false),
  makeScenario('./lib/util/leftPad.js', 'modNoPackageJSON', false, false),
  makeScenario('./lib/util/leftPad.js', 'modNoPackageJSON/fp', true, false),
  makeScenario('./lib/util/leftPad.js', 'modWithPackageJSONAndMatchingExports/fp', false, false),
  makeScenario('./lib/util/leftPad.js', 'modWithPackageJSONButNoExportsAtAll/fp', true, false),
  makeScenario('./lib/util/leftPad.js', 'modWithPackageJSONAndMatchingExports/fp', false, false),
  makeScenario('./lib/util/leftPad.js', 'modWithPackageJSONButNoExportsAtAll/fp', true, false),
  makeScenario('./lib/util/leftPad.js', '../../mod.js', false, false),
  makeScenario('./lib/util/leftPad.js', '../../mod.js', false, false),
  makeScenario('./lib/util/leftPad.js', 'modWithPackageJSONAndMatchingExports/fp', false, false),
  makeScenario('./lib/util/leftPad.js', 'modWithPackageJSONButNoExportsAtAll/fp', true, false),


  makeScenario('./lib/util', 'modWithPackageJSONButNoExportsAtAll/fp', false, false),
];

describe([
  '"shouldAppendJsExtension" is a function that decides if a ".js" extension',
  'should be appended to to an import statement',
].join(' '), () => {
  test.each(testData)(
    "add '.js' to «import foo from '$specifier';» in file '$file'? $append",
    async ({ file, specifier, appendJs, appendIndexJs }) => {
      const importingFilePath = path.resolve(
        'tests', 'fixtures', file,
      );

      const actualAppendJs = await shouldAppendJsExtension(
        importingFilePath,
        specifier,
      );
      const actualAppendIndexJs = await shouldAppendIndexJsExtension(
        importingFilePath,
        specifier
      )

      expect(actualAppendJs).toBe(appendJs);
      expect(actualAppendIndexJs).toBe(appendIndexJs);
    },
  );
});
