/**
 * @file Jayvee is a domain-specific language and runtime for automated processing of data pipelines.
 * @author JValue
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "jayvee",

  rules: {
    jayvee_model: ($) =>
      repeat(
        choice(
          field("import", $.import_definition),
          field("export", $.export_definition),
          field("exportableElement", $.exportable_element_definition),
          field("pipeline", $.pipeline_definition),
          $.line_comment,
        ),
      ),

    exportable_element_definition: ($) =>
      seq(optional(field("isPublished", "publish")), $._exportable_element),

    _exportable_element: ($) =>
      choice(
        $.custom_valuetype_definition,
        $.builtin_valuetype_definition,
        $._constraint_definition,
        $.transform_definition,
        $._referencable_block_type_definition,
        $.builtin_constrainttype_definition,
        $.iotype_definition,
      ),

    export_definition: ($) =>
      seq(
        "publish",
        field("element", $.identifier),
        optional(seq("as", field("alias", $.identifier))),
      ),

    import_definition: ($) =>
      seq(
        "use",
        choice(
          field("useAll", "*"),
          seq(
            "{",
            field("usedElement", $.named_import_element),
            repeat(seq(",", field("usedElement", $.named_import_element))),
            "}",
          ),
        ),
        "from",
        field("path", $.string),
        ";",
      ),

    named_import_element: ($) =>
      seq(field("element", $.identifier), optional(seq("as", field("alias", $.identifier)))),

    pipeline_definition: ($) =>
      seq(
        "pipeline",
        field("name", $.identifier),
        "{",
        repeat(
          choice(
            field("block", $.block_definition),
            field("pipe", $.pipe_definition),
            field("valueType", $.custom_valuetype_definition),
            field("constraint", $._constraint_definition),
            field("transform", $.transform_definition),
          ),
        ),
        "}",
      ),

    pipe_definition: ($) =>
      seq(field("block", $.identifier), repeat1(seq("->", field("block", $.identifier))), ";"),

    block_definition: ($) =>
      seq(
        "block",
        field("name", $.identifier),
        "oftype",
        field("type", $.identifier),
        field("body", $.property_body),
      ),

    property_body: ($) =>
      seq("{", field("properties", repeat($.property_assignment)), "}"),

    property_assignment: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        field("value", choice($._expression, $.runtime_parameter_literal)),
        ";",
      ),

    runtime_parameter_literal: ($) => seq("requires", field("name", $.identifier)),

    _expression: ($) =>
      choice(
        seq(
          "(",
          choice(
            $.unary_expression,
            $.binary_expression,
            $.ternary_expression,
            $._expression_literal,
          ),
          ")",
        ),
        choice(
          $.unary_expression,
          $.binary_expression,
          $.ternary_expression,
          $._expression_literal,
        ),
      ),

    unary_expression: ($) =>
      prec(
        30,
        seq(
          field("operator", $._unary_operator),
          field("operand", $._expression),
        ),
      ),

    _unary_operator: ($) =>
      choice(
        "not",
        "+",
        "-",
        "sqrt",
        "floor",
        "ceil",
        "round",
        "lowercase",
        "uppercase",
        "asDecimal",
        "asInteger",
        "asBoolean",
        "asText",
      ),

    binary_expression: ($) =>
      prec.left(
        20,
        seq(
          field("left", $._expression),
          field("operator", $._binary_operator),
          field("right", $._expression),
        ),
      ),

    _binary_operator: ($) =>
      choice(
        prec(12, choice("or", "and", "xor")),
        prec(13, choice("==", "!=")),
        prec(14, "matches"),
        prec(15, "in"),
        prec(16, choice("<", ">", "<=", ">=")),
        prec(17, choice("+", "-")),
        prec(18, choice("*", "/", "%")),
        prec(19, choice("pow", "root")),
      ),

    ternary_expression: ($) =>
      prec.left(
        10,
        seq(
          field("first", $._expression),
          field("operator", $._ternary_operator),
          field("second", $._expression),
          "with",
          field("third", $._expression),
        ),
      ),

    _ternary_operator: ($) => choice("replace"),

    _expression_literal: ($) =>
      choice($._value_literal, $._free_variable_literal),

    _value_literal: ($) =>
      choice(
        $._text_literal,
        $._numeric_literal,
        $._boolean_literal,
        $._regex_literal,
        $._cell_range_literal,
        $._valuetype_assignment_literal,
        $.collection_literal,
      ),

    _text_literal: ($) => field("value", $.string),
    _numeric_literal: ($) => field("value", choice($.integer, $.decimal)),
    _boolean_literal: ($) =>
      choice(field("true", "true"), field("false", "false")),
    _regex_literal: ($) => field("value", $.regex),
    collection_literal: ($) =>
      seq(
        "[",
        optional(
          seq(
            field("value", $._expression),
            repeat(seq(",", field("value", $._expression))),
          ),
        ),
        optional(","),
        "]",
      ),

    _free_variable_literal: ($) => choice($.value_keyword_literal, $.identifier),

    value_keyword_literal: ($) =>
      seq(
        "value",
        optional(field("lenghtAccess", ".length")),
      ),

    _referencable: ($) =>
      choice(
        $._constraint_definition,
        $.block_type_property,
        $.transform_definition,
        $.transform_port_definition,
      ),

    _referencable_block_type_definition: ($) =>
      choice(
        $.builtin_block_type_definition,
        $.composite_block_type_definition,
      ),

    builtin_block_type_definition: ($) =>
      seq(
        "builtin",
        "blocktype",
        field("name", $.identifier),
        "{",
        repeat(
          choice(
            field("input", $.block_type_input),
            field("output", $.block_type_output),
            field("propterty", $.block_type_property),
          ),
        ),
        "}",
      ),

    composite_block_type_definition: ($) =>
      seq(
        "composite",
        "blocktype",
        field("name", $.identifier),
        "{",
        repeat(
          choice(
            field("input", $.block_type_input),
            field("output", $.block_type_output),
            field("propterty", $.block_type_property),
            field("block", $.block_definition),
            field("pipe", $.block_type_pipeline),
            field("transform", $.transform_definition),
          ),
        ),
        "}",
      ),

    block_type_input: ($) =>
      seq(
        "input",
        field("name", $.identifier),
        "oftype",
        field("iotype", $.iotype_definition),
        ";",
      ),

    block_type_output: ($) =>
      seq(
        "output",
        field("name", $.identifier),
        "oftype",
        field("iotype", $.iotype_definition),
        ";",
      ),

    block_type_property: ($) =>
      seq(
        "property",
        field("name", $.identifier),
        "oftype",
        field("valueType", $.valuetype_reference),
        optional(seq(":", field("defaultValue", $._expression))),
        ";",
      ),

    block_type_pipeline: ($) =>
      seq(
        field("input", $.identifier),
        "->",
        repeat1(seq(field("block", $.identifier), "->")),
        field("output", $.identifier),
        ";",
      ),

    iotype_definition: ($) =>
      seq("builtin", "iotype", field("name", $.identifier), ";"),

    transform_definition: ($) =>
      seq("transform", field("name", $.identifier), field("body", $.transform_body)),

    transform_body: ($) =>
      seq(
        "{",
        repeat(field("port", $.transform_port_definition)),
        repeat(field("ouptutAssignment", $.transform_output_assignment)),
        "}",
      ),

    transform_port_definition: ($) =>
      seq(
        field("kind", choice("from", "to")),
        field("name", $.identifier),
        "oftype",
        field("valueType", $.valuetype_reference),
        ";",
      ),

    transform_output_assignment: ($) =>
      seq(
        field("outPortName", $.identifier),
        ":",
        field("expression", $._expression),
        ";",
      ),

    builtin_valuetype_definition: ($) =>
      seq(
        optional(field("isBuiltin", "builtin")),
        "valuetype",
        field("name", $.identifier),
        optional(field("genericDefinition", $.valuetype_generics_definition)),
      ),

    custom_valuetype_definition: ($) =>
      seq(
        "valuetype",
        field("name", $.identifier),
        optional(field("genericDefinition", $.valuetype_generics_definition)),
        "oftype",
        field("type", $.valuetype_reference),
        "{",
        "constraints",
        ":",
        field("constraints", $.collection_literal),
        ';',
        "}",
      ),

    _valuetype_assignment_literal: ($) =>
      field("value", $.valuetype_assignment),
    valuetype_assignment: ($) =>
      seq(
        field("name", $.string),
        "oftype",
        field("type", $.valuetype_reference),
      ),

    valuetype_reference: ($) =>
      prec.right(
        seq(
          field("reference", $.identifier),
          optional($.valuetype_generics_definition),
        ),
      ),

    valuetype_generics_definition: ($) =>
      seq(
        "<",
        field("generic", $.identifier),
        repeat(seq(",", field("generic", $.identifier))),
        ">",
      ),

    _cell_range_literal: ($) =>
      choice($.range_literal, $.column_literal, $.row_literal, $.cell_literal),

    range_literal: ($) =>
      seq(
        "range",
        field("cellFrom", choice($.CELL_REFERENCE, $.cell_reference)),
        ":",
        field("cellTo", choice($.CELL_REFERENCE, $.cell_reference)),
      ),

    column_literal: ($) => seq("column", field("columnId", $._column_id)),
    row_literal: ($) => seq("row", field("row_id", $._row_id)),
    cell_literal: ($) =>
      seq("cell", field("cell_id", choice($.CELL_REFERENCE, $.cell_reference))),

    cell_reference: ($) =>
      seq(field("columnId", $._column_id), field("rowId", $._row_id)),

    _column_id: ($) => choice($.identifier, "*"),
    _row_id: ($) => choice($.integer, "*"),

    _constraint_definition: ($) =>
      choice($.typed_constraint_definition, $.expression_constraint_definition),

    typed_constraint_definition: ($) =>
      seq(
        "constraint",
        field("name", $.identifier),
        "on",
        field("type", $.identifier),
        field("body", $.property_body),
      ),

    expression_constraint_definition: ($) =>
      seq(
        "constraint",
        field("name", $.identifier),
        "on",
        field("valueType", $.valuetype_reference),
        ":",
        field("expression", $._expression),
        ";",
      ),

    builtin_constrainttype_definition: ($) =>
      seq(
        "builtin",
        "constrainttype",
        field("name", $.identifier),
        "on",
        field("valueType", $.valuetype_reference),
        "{",
        repeat(field("property", $.constrainttype_property)),
        "}",
      ),

    constrainttype_property: ($) =>
      seq(
        "property",
        field("name", $.identifier),
        "oftype",
        field("valueType", $.valuetype_reference),
        optional(seq(":", field("defaultValue", $._expression))),
        ";",
      ),

    CELL_REFERENCE: ($) => seq(/[A-Z]+/, $.integer),
    identifier: ($) => /[_a-zA-Z][\w_]*/,

    decimal: ($) => seq($.integer, ".", $.integer),
    integer: ($) => /[0-9]+/,

    string: ($) => /"[^"]*"|'[^']*'/,

    line_comment: ($) => token(/\/\/[^\n\r]*/),
    block_comment: ($) => token(/\/\*[\s\S]*?\*\//),

    regex: ($) => /\/.+\//,

    _whitespace: ($) => /\s+/,
  },

  extras: ($) => [$.line_comment, $.block_comment, $._whitespace],
});
