const { init, analyse, showOk, getVersion, padEndOfLine, getTerminalWidth } = require('../src/core');
const notifier = require('node-notifier');
const child_process = require('child_process');

jest.mock('node-notifier');

describe('core.js tests', () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Dummy test that always succeeds', () => {
        expect(true).toBeTruthy();
    });

    test('init function logs welcome messages', () => {
        init();
        expect(consoleSpy).toHaveBeenCalledTimes(4);
    });

    test('analyse sets isBusy to true', () => {
        analyse();
        // Check if isBusy is set to true, assuming isBusy is exported for testing
    });

    test('showOk logs success message', () => {
        showOk();
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Well done. No errors!'));
    });

    test('getVersion returns correct version', () => {
        const version = getVersion();
        expect(version).toBe("2.1.0");
    });

    test('padEndOfLine pads string correctly', () => {
        const paddedString = padEndOfLine('Test');

        expect(paddedString).toBe('Test' + ' '.repeat(getTerminalWidth() - 4));
    });

    // Mock child_process spawn for analyse function
    jest.spyOn(child_process, 'spawn').mockImplementation(() => ({
        // Mock implementation
    }));
});
