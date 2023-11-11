const { showResults } = require('../src/core');

test('showResults displays errors correctly', () => {
  const mockData = {
    totals: { file_errors: 2 },
    files: {
      '/path/to/file1.php': { errors: 1, messages: [{ line: 10, message: 'Error message 1' }] },
      '/path/to/file2.php': { errors: 1, messages: [{ line: 20, message: 'Error message 2' }] }
    }
  };
  const consoleSpy = jest.spyOn(console, 'log');

  showResults(JSON.stringify(mockData));
  expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error message 1'));
  expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error message 2'));
});