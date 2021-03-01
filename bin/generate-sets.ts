import deindent from 'deindent';
import * as fs from 'fs';
import path from 'path';
import nodeKinds from '../data/nodekinds.json';
import basicDefaults from '../data/basic-defaults.json';
import complexDefaults from '../data/complex-defaults.json';
import propertyShapeClassification from '../data/property-shape-classification.json';

const basePath = path.join(__dirname, '..', 'construct-sets');
try {
  fs.mkdirSync(basePath);
// eslint-disable-next-line no-empty
} catch (e) {}

const newObj = [];

for (const key in nodeKinds) {
  newObj.push({
    construct: `?s sh:nodeKind sh:${key}`,
    where: deindent`?s a sh:PropertyShape ;
      (${
  // @ts-ignore
  (nodeKinds[key] as [])?.map((x: string) => `sh:${x}`).join('|')}) ?o .
    FILTER( NOT EXISTS { ?s sh:nodeKind ?o2 } )`,
  });
}

fs.writeFileSync(path.join(basePath, 'nodekind-inferences.json'), JSON.stringify(newObj, null, 2));

const defaults = [...complexDefaults];

for (const defaultClass in basicDefaults) {
  for (const key in basicDefaults[defaultClass]) {
    defaults.push({
      construct: `?s sh:${key} ${(basicDefaults[defaultClass])[key]}`,
      where: `?s a sh:${defaultClass}\nFILTER(NOT EXISTS { ?s sh:${key} ?o })`,
    });
  }
}

fs.writeFileSync(path.join(basePath, 'defaults.json'), JSON.stringify(defaults, null, 2));

// Each subject ?s is set to be a property shape if not already one
const propertyShapeClassificaitons = propertyShapeClassification.map((where) => ({
  construct: '?s a sh:PropertyShape',
  where: `${where} FILTER( NOT EXISTS { ?s a sh:NodeShape } && NOT EXISTS { ?s a sh:PropertyShape } )`,
}));

fs.writeFileSync(path.join(basePath, 'property-shape-classification.json'), JSON.stringify(propertyShapeClassificaitons, null, 2));
