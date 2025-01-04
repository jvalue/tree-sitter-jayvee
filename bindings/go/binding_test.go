package tree_sitter_jayvee_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_jayvee "github.com/jvalue/jayvee/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_jayvee.Language())
	if language == nil {
		t.Errorf("Error loading Jayvee grammar")
	}
}
