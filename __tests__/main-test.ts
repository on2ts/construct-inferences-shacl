import inferencer from 'sparql-inferenced';
import { Store, Parser } from 'n3';
import { owl2rl } from 'hylar-core';
import { namedNode, literal } from '@rdfjs/data-model';
import SHACLInferences, { defaults, nodekindInferences } from '../lib';

const parser = new Parser();

const shaclConstraint = parser.parse(`
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://example.org/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:myShape a sh:NodeShape ;
  sh:property [
    a sh:PropertyShape ;
    sh:path foaf:friend ;
    sh:class ex:Person
  ] .
`);

describe('Testing with all inferencing sets', () => {
  it('Should infer closed attribute', async () => {
    // Store to hold explicitly loaded triples
    const explicit = new Store();
    // Store to hold implicitly loaded triples
    const implicit = new Store();

    await inferencer(shaclConstraint, [], explicit, implicit, owl2rl, SHACLInferences);

    expect(implicit.countQuads(
      namedNode('http://example.org/myShape'),
      namedNode('http://www.w3.org/ns/shacl#closed'),
      literal('false', 'http://www.w3.org/2001/XMLSchema#boolean'),
      null,
    )).toEqual(1);
  });
  it('Should infer BlankNodeOrIRI', async () => {
    // Store to hold explicitly loaded triples
    const explicit = new Store();
    // Store to hold implicitly loaded triples
    const implicit = new Store();

    await inferencer(shaclConstraint, [], explicit, implicit, owl2rl, SHACLInferences);

    const [propertyShape] = explicit.getObjects(
      namedNode('http://example.org/myShape'),
      namedNode('http://www.w3.org/ns/shacl#property'),
      null,
    );

    expect(implicit.countQuads(
      propertyShape,
      namedNode('http://www.w3.org/ns/shacl#nodeKind'),
      namedNode('http://www.w3.org/ns/shacl#BlankNodeOrIRI'),
      null,
    )).toEqual(1);
  });
});

describe('Testing with defaults only', () => {
  it('Should infer closed attribute ', async () => {
    // Store to hold explicitly loaded triples
    const explicit = new Store();
    // Store to hold implicitly loaded triples
    const implicit = new Store();

    await inferencer(shaclConstraint, [], explicit, implicit, owl2rl, defaults);

    expect(implicit.countQuads(
      namedNode('http://example.org/myShape'),
      namedNode('http://www.w3.org/ns/shacl#closed'),
      literal('false', 'http://www.w3.org/2001/XMLSchema#boolean'),
      null,
    )).toEqual(1);
  });
  it('Should *not* infer BlankNodeOrIRI', async () => {
    // Store to hold explicitly loaded triples
    const explicit = new Store();
    // Store to hold implicitly loaded triples
    const implicit = new Store();

    await inferencer(shaclConstraint, [], explicit, implicit, owl2rl, defaults);

    const [propertyShape] = explicit.getObjects(
      namedNode('http://example.org/myShape'),
      namedNode('http://www.w3.org/ns/shacl#property'),
      null,
    );

    expect(implicit.countQuads(
      propertyShape,
      namedNode('http://www.w3.org/ns/shacl#nodeKind'),
      namedNode('http://www.w3.org/ns/shacl#BlankNodeOrIRI'),
      null,
    )).toEqual(0);
  });
});

describe('Testing with nodekind inferences only only', () => {
  it('Should infer closed attribute ', async () => {
    // Store to hold explicitly loaded triples
    const explicit = new Store();
    // Store to hold implicitly loaded triples
    const implicit = new Store();

    await inferencer(shaclConstraint, [], explicit, implicit, owl2rl, nodekindInferences);

    expect(implicit.countQuads(
      namedNode('http://example.org/myShape'),
      namedNode('http://www.w3.org/ns/shacl#closed'),
      literal('false', 'http://www.w3.org/2001/XMLSchema#boolean'),
      null,
    )).toEqual(0);
  });
  it('Should *not* infer BlankNodeOrIRI', async () => {
    // Store to hold explicitly loaded triples
    const explicit = new Store();
    // Store to hold implicitly loaded triples
    const implicit = new Store();

    await inferencer(shaclConstraint, [], explicit, implicit, owl2rl, nodekindInferences);

    const [propertyShape] = explicit.getObjects(
      namedNode('http://example.org/myShape'),
      namedNode('http://www.w3.org/ns/shacl#property'),
      null,
    );

    expect(implicit.countQuads(
      propertyShape,
      namedNode('http://www.w3.org/ns/shacl#nodeKind'),
      namedNode('http://www.w3.org/ns/shacl#BlankNodeOrIRI'),
      null,
    )).toEqual(1);
  });
});
