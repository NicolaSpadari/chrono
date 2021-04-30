"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
const pattern_1 = require("../../utils/pattern");
const years_1 = require("../../calculation/years");
exports.WEEKDAY_DICTIONARY = {
    "domenica": 0,
    "dom": 0,
    "do": 0,
    "lunedì": 1,
    "lun": 1,
    "lu": 1,
    "martedì": 2,
    "mar": 2,
    "ma": 2,
    "mercoledì": 3,
    "mer": 3,
    "me": 3,
    "giovedì": 4,
    "gio": 4,
    "gi": 4,
    "venerdì": 5,
    "ven": 5,
    "ve": 5,
    "sabato": 6,
    "sab": 6,
    "sa": 6,
};
exports.MONTH_DICTIONARY = {
    "gennaio": 1,
    "ge": 1,
    "gen": 1,
    "gen.": 1,
    "febbraio": 2,
    "fe": 2,
    "feb": 2,
    "feb.": 2,
    "marzo": 3,
    "ma": 3,
    "mar": 3,
    "mar.": 3,
    "aprile": 4,
    "apr": 4,
    "apr.": 4,
    "maggio": 5,
    "mag": 5,
    "mag.": 5,
    "giugno": 6,
    "giu": 6,
    "giu.": 6,
    "gi": 6,
    "luglio": 7,
    "lug": 7,
    "lug.": 7,
    "lu": 7,
    "agosto": 8,
    "ago": 8,
    "ago.": 8,
    "ag": 8,
    "settembre": 9,
    "set": 9,
    "set.": 9,
    "se": 9,
    "ottobre": 10,
    "ott": 10,
    "ott.": 10,
    "ot": 10,
    "novembre": 11,
    "nov": 11,
    "nov.": 11,
    "no": 11,
    "dicembre": 12,
    "dic": 12,
    "dic.": 12,
    "dec.": 12,
    "di": 12,
};
exports.INTEGER_WORD_DICTIONARY = {
    "uno": 1,
    "primo": 1,
    "prima": 1,
    "due": 2,
    "secondo": 2,
    "seconda": 2,
    "tre": 3,
    "terzo": 3,
    "terza": 3,
    "quattro": 4,
    "quarto": 4,
    "quarta": 4,
    "cinque": 5,
    "quinto": 5,
    "quinta": 5,
    "set": 6,
    "sesto": 6,
    "sesta": 6,
    "sette": 7,
    "settimo": 7,
    "settima": 7,
    "otto": 8,
    "ottavo": 8,
    "ottava": 8,
    "nove": 9,
    "nono": 9,
    "nona": 9,
    "dieci": 10,
    "decimo": 10,
    "decima": 10,
    "unidici": 11,
    "undicesimo": 11,
    "undicesima": 11,
    "dodici": 12,
    "dodicesimo": 12,
    "dodicesima": 12,
};
exports.TIME_UNIT_DICTIONARY = {
    sec: "second",
    second: "second",
    seconds: "second",
    min: "minute",
    mins: "minute",
    minute: "minute",
    minutes: "minute",
    h: "hour",
    hr: "hour",
    hrs: "hour",
    hour: "hour",
    hours: "hour",
    day: "d",
    days: "d",
    week: "week",
    weeks: "week",
    month: "month",
    months: "month",
    y: "year",
    yr: "year",
    year: "year",
    years: "year",
};
exports.NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s*an?)?|an?(?:\\s*few)?|few|several|a?\\s*couple\\s*(?:of)?)`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    else if (num === "a" || num === "an") {
        return 1;
    }
    else if (num.match(/few/)) {
        return 3;
    }
    else if (num.match(/half/)) {
        return 0.5;
    }
    else if (num.match(/couple/)) {
        return 2;
    }
    else if (num.match(/several/)) {
        return 7;
    }
    return parseFloat(num);
}
exports.parseNumberPattern = parseNumberPattern;
exports.YEAR_PATTERN = `(?:[0-9]{1,4}(?:\\s*[vn]\\.?\\s*C(?:hr)?\\.?)?)`;
function parseYear(match) {
    if (/v/i.test(match)) {
        return -parseInt(match.replace(/[^0-9]+/gi, ""));
    }
    if (/n/i.test(match)) {
        return parseInt(match.replace(/[^0-9]+/gi, ""));
    }
    const rawYearNumber = parseInt(match);
    return years_1.findMostLikelyADYear(rawYearNumber);
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
