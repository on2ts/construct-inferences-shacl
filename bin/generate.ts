import nodeKinds from './nodekinds.json';
import deindent from 'deindent';
import * as fs from 'fs';
import path from 'path';

const newObj = [];

for (const key in nodeKinds) {
  newObj.push({
    construct: `?s sh:nodeKind sh:${key}`,
    where: deindent`
    ?s a sh:propertyShape ;
      (${
      // @ts-ignore
      (nodeKinds[key] as [])?.map((x: string) => `sh:${x}`).join('|')}) ?o .
    FILTER( NOT EXISTS { ?s sh:nodeKind ?o2 } )
    `
  })
}

fs.writeFileSync(path.join(__dirname, '..', 'construct-sets', 'nodekind-inferences.json'), JSON.stringify(newObj, null, 2))
