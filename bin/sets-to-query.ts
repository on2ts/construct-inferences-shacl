import deindent from 'deindent';
import * as R from 'ramda';
import * as fs from 'fs';
import path from 'path';
import { Project } from 'ts-morph';
import { camelCase } from 'text-camel-case';

interface ConstructElem {
  construct: string;
  where: string;
}

// Converting the construct objects into full sparql queries
const basePath = path.join(__dirname, '..', 'construct-sets');
const outPath = path.join(__dirname, '..', 'lib', 'sets');
try {
  fs.mkdirSync(outPath);
// eslint-disable-next-line no-empty
} catch (e) {}

for (const file of fs.readdirSync(basePath)) {
  const data: ConstructElem[] = JSON.parse(fs.readFileSync(path.join(basePath, file)).toString());
  const queries = data.map(({ construct, where }) => deindent`PREFIX sh: <http://www.w3.org/ns/shacl#>
    CONSTRUCT {\n${construct}\n} WHERE {\n${where}\n}
    `);
  fs.writeFileSync(path.join(outPath, file), JSON.stringify(queries, null, 2));
}

// Adding an export file
const project = new Project();

// Remove any existing index
try {
  const index = project.addSourceFileAtPath(path.join(outPath, 'index.ts'));
  index.delete();
// eslint-disable-next-line no-empty
} catch (e) {}

project.saveSync();
const indexNew = project.createSourceFile(path.join(outPath, 'index.ts'));
for (const file of fs.readdirSync(outPath)) {
  indexNew.addExportDeclaration({
    namedExports: [{
      name: 'default',
      alias: camelCase(/^[a-z-]+/i.exec(file)?.[0] ?? ''),
    }],
    moduleSpecifier: `./${file}`,
  });
}

indexNew.saveSync();
