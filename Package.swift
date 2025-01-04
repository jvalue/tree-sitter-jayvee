// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterJayvee",
    products: [
        .library(name: "TreeSitterJayvee", targets: ["TreeSitterJayvee"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterJayvee",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterJayveeTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterJayvee",
            ],
            path: "bindings/swift/TreeSitterJayveeTests"
        )
    ],
    cLanguageStandard: .c11
)
