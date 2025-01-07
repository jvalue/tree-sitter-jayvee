; Keywords
(import_definition
  [
    "use"
    "from"
    "as"
  ] @keyword.import)

(export_definition
  "as" @keyword.import)

[
  ","
  "->"
] @punctuation.delemiter

[
  "["
  "]"
  "{"
  "}"
  "("
  ")"
] @punctuation.bracket

[
  (line_comment)
  (block_comment)
] @comment

(string) @string

[
  "and"
  "asBoolean"
  "asDecimal"
  "asInteger"
  "asText"
  "ceil"
  "floor"
  "in"
  "lowercase"
  "matches"
  "not"
  "or"
  "pow"
  "replace"
  "root"
  "round"
  "sqrt"
  "uppercase"
  "with"
  "xor"
] @keyword.operator

[
  "false"
  "true"
] @boolean

(integer) @number

(decimal) @number.float

(block_type_input
  [
    "input"
    "oftype"
  ] @keyword)

(block_type_output
  [
    "output"
    "oftype"
  ] @keyword)

(block_type_property
  [
    "property"
    "oftype"
  ] @keyword)

(constrainttype_property
  [
    "property"
    "oftype"
  ] @keyword)

(transform_port_definition
  [
    "from"
    "to"
    "oftype"
  ] @keyword)

(valuetype_assignment
  "oftype" @keyword)

(value_keyword_literal
  "value" @keyword)

(runtime_parameter_literal
  "requires" @keyword)

; FIXME These might fit better with another highlight-group
[
  "cell"
  "column"
  "constraints"
  "publish"
  "range"
  "row"
] @keyword

[
  "block"
  "constraint"
  "pipeline"
  "transform"
] @keyword.function

(block_definition
  "oftype" @keyword.function)

[
  "blocktype"
  "constrainttype"
  "iotype"
  "valuetype"
  "on"
] @keyword.type

(custom_valuetype_definition
  "oftype" @keyword.type)

[
  "builtin"
  "composite"
] @keyword.modifier

(regex) @string.regexp

(ERROR) @comment.error
