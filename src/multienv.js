import { sync as pkgUp } from 'pkg-up';
import dotEnv from 'dotenv';
import dotEnvExpand from 'dotenv-expand';
import path from 'path';

function multiEnv() {
  const pkgPath = pkgUp();
  const dir = path.dirname(pkgPath);
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const { config = {} } = require(pkgPath);
  const multiEnvConfig = config['multi-env'] || { files: [], expandProcessVars: false };

  multiEnvConfig.files.forEach((file) => {
    let fileName = file;

    if (multiEnvConfig.expandProcessVarsInFileName) {
      const fileNameTemplateTag = /\$\{(\w+)}/g;

      fileName = file.replace(fileNameTemplateTag, (match, envVariableName) => process.env[envVariableName] || '');
    }

    dotEnvExpand(dotEnv.config({ path: path.join(dir, fileName) }));
  });
}

module.exports = multiEnv;
