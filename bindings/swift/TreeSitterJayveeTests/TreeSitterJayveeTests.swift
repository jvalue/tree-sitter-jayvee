import XCTest
import SwiftTreeSitter
import TreeSitterJayvee

final class TreeSitterJayveeTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_jayvee())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Jayvee grammar")
    }
}
