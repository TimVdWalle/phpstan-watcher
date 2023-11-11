const { showResults } = require('../src/core');
jest.mock('node-notifier');
const notifier = require('node-notifier');

// Mocking external dependencies
jest.mock('node-notifier', () => ({
    notify: jest.fn(),
}));

jest.mock('child_process', () => ({
    spawn: jest.fn(),
}));

describe('showResults function', () => {
    let consoleSpy;

    beforeEach(() => {
        // Mock console.log to monitor its calls
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        // Restore the original implementation of console.log after each test
        consoleSpy.mockRestore();
    });

    test('should parse input data correctly', () => {
        const mockData = JSON.stringify({
            totals: { file_errors: 2 },
            files: {}
        });

        showResults(mockData);

        // Assertions to verify if parsedData matches the expected structure
        // ...
    });
    
    test('should handle empty results correctly', () => {
        showResults(JSON.stringify({}));
    
        // Replace the following assertions with the expected behavior of your function
        // Check that no error messages are displayed
        expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Error'));
        
        // If your function outputs a specific message for no errors, test for that
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No errors found'));
    });

    test('should display errors correctly', () => {
        const mockData = JSON.stringify({
            totals: { file_errors: 1 },
            files: {
                '/path/to/file.php': { errors: 1, messages: [{ line: 10, message: 'Error message' }] }
            }
        });

        showResults(mockData);

        // Assertions to verify the error messages are displayed correctly
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error message'));
    });

    test('should display success message when there are no errors', () => {
        const mockData = JSON.stringify({
            totals: { file_errors: 0 },
            files: {}
        });

        showResults(mockData);

        // Assertions to verify the success message is displayed
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Well done. No errors!'));
    });

    test('should trigger notifications correctly', () => {
        const mockData = JSON.stringify({
            totals: { file_errors: 1 },
            files: {
                '/path/to/file.php': { errors: 1, messages: [{ line: 10, message: 'Error message' }] }
            }
        });

        showResults(mockData);

        // Assuming `notifier.notify` is the method used for notifications
        expect(notifier.notify).toHaveBeenCalledWith(expect.any(Object));
    });

    test('should format console output correctly', () => {
        const mockData = JSON.stringify({
            totals: { file_errors: 1 },
            files: {
                '/path/to/file.php': { errors: 1, messages: [{ line: 10, message: 'Error message' }] }
            }
        });

        showResults(mockData);

        // Assertions to verify console output format
        // You can check for specific strings or formatting patterns
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('------'));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('/path/to/file.php'));
    });
});
