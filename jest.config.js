/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    clearMocks: true,
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
    moduleDirectories: ['node_modules', '<rootDir>/'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest'
    }
};
