/* eslint-disable no-await-in-loop */
import inferencer from 'sparql-inferenced';
import entries from 'shacl-test-as-object';
import { Quad, Store } from 'n3';
import { owl2rl } from 'hylar-core';
import SHACLInferences from '../lib';

describe('Testing properties that should apply to every shape', () => {
  it('Should have every shape marked as a NodeShape or a PropertyShape', async () => {
    for (const entry of await entries) {
      // Store to hold explicitly loaded triples
      const explicit = new Store();
      // Store to hold implicitly loaded triples
      const implicit = new Store();

      await inferencer(entry.toQuads() as Quad[], [], explicit, implicit, owl2rl, SHACLInferences);
      entry.toQuads();
    }
  });
});
