# construct-inferences-shacl

A set of construct queries for inferencing SHACL constraints. Originally created for use with the [sparql-inferenced](https://github.com/jeswr/sparql-inferenced) library.

## Included Sets

 - defaults Applies default values to constraints such as minCount, closed etc.
 - nodeKindInferences Infer sh:nodeKind value based on existance of other properties. E.g. sh:datatype -> sh:nodeKind is sh:Literal
 - propertyShapeClassification. Adds the `?s a sh:PropertyShape` triple in cases not encoded in ontology. For instance every element of a `sh:and` list that is not a NodeShape, is taken to be a PropertyShape.
