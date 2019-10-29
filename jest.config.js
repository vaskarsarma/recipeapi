module.exports = {
    "testEnvironment": "node",
    "clearMocks": true,
    "collectCoverage": true,
    "coverageDirectory": "build/coverage",
    "coveragePathIgnorePatterns": [
        "/build/",
        "/jest/",
        "/mock-data/",
        "/mocks/",
        "/node_modules/",
        "/swagger/",
        "/index.js",
        "/database.js",
        "/server.js",
    ],
    "coverageThreshold": {
        "global": {
            "branches": 10,
            "functions": 10,
            "lines": 10,
            "statements": 10
        }
    },
}