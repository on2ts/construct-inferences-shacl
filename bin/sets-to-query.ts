import deindent from 'deindent';
import * as fs from 'fs';
import path from 'path';

interface ConstructElem {
  construct: string;
  where: string;
}

const basePath = path.join(__dirname, '..', 'construct-sets');
const outPath = path.join(__dirname, '..', 'lib', 'sets');

for (const file of fs.readdirSync(basePath)) {
  const data: ConstructElem[] = JSON.parse(fs.readFileSync(path.join(basePath, file)).toString());
  const queries = data.map(({ construct, where }) => deindent`PREFIX sh: <http://www.w3.org/ns/shacl#> .
    CONSTRUCT {\n${construct}\n} WHERE {\n${where}\n}
    `);
  fs.writeFileSync(path.join(outPath, file), JSON.stringify(queries, null, 2));
}
