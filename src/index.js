#!/usr/bin/env node

let isBusy = false;
let pwd = null;

var clc = require("cli-color");

function main() {
    // initialize + welcome message
    init();

    // start analyse at first run
    analyse();

    // watch for changes in php files
    // startWwatching();
}

function init(){
    const {cwd} = require('node:process');
    pwd = cwd();

    console.log('Start watching ' + clc.magenta(pwd + '...'));
    console.log('');
}

function startWwatching(){
    var watch = require('node-watch');

    watch('.', {filter: /\.php$/, recursive: true}, function (evt, name) {
        console.log('%s changed...', name);

        if (!isBusy) {
            analyse();
        }
    });
}

async function analyse() {
    isBusy = true;
    const {exec} = require("child_process");
    let result = null;

    await exec('composer analyse-json', (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
            // console.error("could not execute command: ", err)
        }

        showResults(output);
    });
}

function showResults(results) {
    isBusy = false;
    results = JSON.parse(results);
    showFileResults(results.files);
    // results = JSON.parse(results);
    // console.log(results);
}

function showFileResults(results) {

    for (var file in results) {
        if (results.hasOwnProperty(file)) {
            const displayFile = file.replace(pwd, "");
            const obj = results[file];
            const errors = obj['errors'];
            const messages = obj['messages'];

            printHeaderLine();
            let str = ' ' + 'Line   ' + displayFile;
            const width = getOutputWidth() - str.length;
            for (i = 0; i < width; i++) {
                str = str + ' ';
            }

            console.log(clc.white.bgBlue(str));
            printHeaderLine();

            showFileDetailResults(messages);


            // console.log(file);
            // console.log(file + ': ' + errors);
        }
    }
}

function showFileDetailResults(results) {
    // console.log(results[0]);

    for (var warning in results) {
        const obj = results[warning];

        const line = obj.line;
        const message = obj.message;
        const ignorable = obj.ignorable;

        printWrappedLine(line, message);
        // console.log(line + ' ' + message + ' ' + ignorable);
    }
}

function printWrappedLine(str1, str2){
    var cliFormat = require('cli-format');

    var col1 = str1.toString();
    var col2 = {
        content: str2,
        width: 80,
    };

    var config = { width: 89, paddingMiddle: ' ' };

    var result = cliFormat.columns.wrap([col1, col2], config);
    console.log(result);
}

function printHeaderLine() {
    let str = ' ------ ';
    let width = getOutputWidth() - 9;
    for (i = 0; i < width; i++) {
        str = str + '-';
    }

    console.log(clc.white.bgBlue(str + ' '));
}

function getOutputWidth() {
    return process.stdout.columns;
}


if (require.main === module) {
    main();
}