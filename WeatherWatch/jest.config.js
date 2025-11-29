module.exports = {
    testEnvironment: "jsdom",
    testMatch: ["**/jest/**/*.jest.test.jsx"],
    moduleFileExtensions: ["js", "jsx"],
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
    moduleNameMapper: {
        "\\.css$": "<rootDir>/styleMock.js",
    },
};