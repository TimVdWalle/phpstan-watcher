#!/usr/bin/env node

const { init, startWwatching, analyse } = require('./core');

function main() {
    init();
    analyse(); // Added this line to start analysis on first run
    startWwatching();
}

if (require.main === module) {
    main();
}

module.exports = {
    main
};
