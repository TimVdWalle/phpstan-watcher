const clc = require("cli-color");
const path = require("path");
const spawn = require('child_process').spawn;
const notifier = require('node-notifier');
const cliFormat = require('cli-format');
const watch = require('node-watch');
const { cwd } = require('node:process');

let isBusy = false;
let pwd = cwd();

function init() {
    let version = getVersion();
 
    console.log(clc.white.bgMagenta(padEndOfLine('Start watching : ')));
    console.log(clc.white.bgMagenta(padEndOfLine(pwd)));
    console.log(clc.white.bgMagenta(padEndOfLine('Version ' + version + ' ')));
    console.log('');
}

function startWwatching() {
    watch('.', {filter: /\.php$/, recursive: true}, function (evt, name) {
        console.log('%s changed...', name);
        if (!isBusy) {
            analyse();
        }
    });
}

function analyse() {
    isBusy = true;
    const composer = spawn('composer', ['analyse-json']);

    composer.stdout.on('data', (data) => {
        showResults(data);
    });
}

function showResults(results) {
    isBusy = false;
    if(!results) return;
    results = JSON.parse(results);

    console.clear();
    if (!results || results.totals.file_errors) {
        showFileResults(results.files);
        showErrorsNotification(results.totals.file_errors);
    } else {
        showOk();
    }
}

function showFileResults(results) {
    var totalErrors = 0;

    for (var file in results) {
        if (results.hasOwnProperty(file)) {
            const displayFile = file.replace(pwd, "");
            const obj = results[file];
            const errors = obj['errors'];
            const messages = obj['messages'];
            totalErrors += errors;

            showHeader(displayFile, errors);
            showFileDetailResults(messages);
        }
    }

    showHeader('Total', totalErrors);
}

function showOk() {
    var str = new Array(getOutputWidth() + 1).join(' ');
    var str2 = '  Well done. No errors!';
    for (i = 0; i <= (getOutputWidth() - 24); i++) {
        str2 = str2 + ' ';
    }

    console.log(clc.black.bgGreen(str));
    console.log(clc.black.bgGreen(str2));
    process.stdout.write(clc.black.bgGreen(str) + "\r\r");
    process.stdout.write(clc.black.bgGreen(str) + "\r\n");
}

function showErrorsNotification(errors){
    let msgCount = ' some ';
    let msgPart = 'errors';
    if(errors <= 1){
        msgCount = ' an '
        msgPart = 'error';
    }

    notifier.notify({
        title: errors + ' ' + msgPart,
        message: 'Phpstan found' + msgCount + msgPart + ' that you should fix!',
        icon: path.join(__dirname, 'logo.png'),
        timeout: 200
    });
}

function showHeader(displayFile, errors) {
    errors = errors.toString();
    const padWidth = Math.max(0, 5 - errors.length);
    errors = errors + ')';
    for (i = 0; i <= padWidth; i++) {
        errors = errors + ' ';
    }

    let str = ' (#' + errors + displayFile;
    const width = getOutputWidth() - str.length ;
    for (i = 0; i < width; i++) {
        str = str + ' ';
    }

    console.log();
    printHeaderLine();
    console.log(clc.white.bgRed(str));
    printHeaderLine();
}

function printHeaderLine() {
    let str = ' ------   ';
    let width = getOutputWidth() - 11;
    for (i = 0; i < width; i++) {
        str = str + '-';
    }

    console.log(clc.white.bgRed(str + ' '));
}

function showFileDetailResults(results) {
    for (var warning in results) {
        const obj = results[warning];

        const line = obj.line;
        const message = obj.message;

        printWrappedLine(line, message);
    }
}

function printWrappedLine(str1, str2) {
    var col1 = ' ' + str1.toString();
    var col2 = {
        content: str2,
        width: getOutputWidth() - 11,
    };

    var config = {width: getOutputWidth(), paddingMiddle: ' '};

    var result = cliFormat.columns.wrap([col1, col2], config);
    console.log(result);
}

function getOutputWidth() {
    return process.stdout.columns;
}

function getVersion(){
    var pjson = require('../package.json');
    return pjson.version;
}

function padEndOfLine(message) {
    const paddingLength = getTerminalWidth() - message.length;
    const padding = ' '.repeat(paddingLength);
    return message + padding;
}

function getTerminalWidth() {
    return process.stdout.columns;
}

module.exports = {
    init,
    startWwatching,
    analyse,
    showResults,
    showFileResults,
    showOk,
    showErrorsNotification,
    showHeader,
    printHeaderLine,
    showFileDetailResults,
    printWrappedLine,
    getOutputWidth,
    getVersion,
    padEndOfLine,
    getTerminalWidth
};
