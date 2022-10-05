#!/usr/bin/env node

let isBusy = false;
let pwd = null;

var clc = require("cli-color");
const {exec} = require("child_process");
const watch = require("node-watch");

function main() {
    // initialize + welcome message
    init();

    // start analyse at first run
    analyse();

    // watch for changes in php files
    startWwatching();
}

function init() {
    const {cwd} = require('node:process');
    pwd = cwd();

    console.log('Start watching ' + clc.magenta(pwd + '...'));
    console.log('');
}

function startWwatching() {
    var watch = require('node-watch');

    watch('.', {filter: /\.php$/, recursive: true}, function (evt, name) {
        console.log('%s changed...', name);

        if (!isBusy) {
            analyse();
        }
    });
}

function analyse() {
    isBusy = true;
    const {exec} = require("child_process");
    let result = null;

    exec('composer analyse-json', (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
            // console.error("could not execute command: ", err)
        }

        showResults(output);
    });
}

function showResults(results) {
    // console.log(results);
    isBusy = false;
    if(!results) return;
    results = JSON.parse(results);

    console.clear();
    // if (!results.totals.errors && !results.totals.file_errors) {
    if (!results || results.totals.file_errors) {
        showFileResults(results.files);
        showErrorsNotification(results.totals.file_errors);
    } else {
        showOk();
    }
}

function showFileResults(results) {
    for (var file in results) {
        if (results.hasOwnProperty(file)) {
            const displayFile = file.replace(pwd, "");
            const obj = results[file];
            const errors = obj['errors'];
            const messages = obj['messages'];

            showHeader(displayFile, errors);
            showFileDetailResults(messages);
        }
    }
}

function showOk() {
    var str = new Array(getOutputWidth() + 1).join(' ');
    var str2 = '  Well done. No errors !';
    for (i = 0; i <= (getOutputWidth() - 25); i++) {
        str2 = str2 + ' ';
    }

    console.log(clc.black.bgGreen(str));
    console.log(clc.black.bgGreen(str2));
    process.stdout.write(clc.black.bgGreen(str) + "\r");
}

function showErrorsNotification(errors){
    const notifier = require('node-notifier');

    let msgCount = ' some ';
    let msgPart = 'errors';
    if(errors <= 1){
        msgCount = ' an '
        msgPart = 'error';
    }

    notifier.notify({
        title: errors + ' ' + msgPart,
        message: 'Phpstan found' + msgCount + msgPart + ' that you should fix.!',
        timeout: 5
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
    const width = getOutputWidth() - str.length;
    for (i = 0; i < width; i++) {
        str = str + ' ';
    }

    console.log();
    printHeaderLine();
    console.log(clc.white.bgRed(str));
    printHeaderLine();
}

function printHeaderLine() {
    let str = ' ------ ';
    let width = getOutputWidth() - 9;
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
        const ignorable = obj.ignorable;

        printWrappedLine(line, message);
    }
}

function printWrappedLine(str1, str2) {
    var cliFormat = require('cli-format');

    var col1 = ' ' + str1.toString();
    var col2 = {
        content: str2,
        width: getOutputWidth() - 9,
    };

    var config = {width: getOutputWidth(), paddingMiddle: ' '};

    var result = cliFormat.columns.wrap([col1, col2], config);
    console.log(result);
}

function getOutputWidth() {
    return process.stdout.columns;
}

if (require.main === module) {
    main();
}