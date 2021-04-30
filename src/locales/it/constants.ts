import { OpUnitType } from "dayjs";
import { matchAnyPattern, repeatedTimeunitPattern } from "../../utils/pattern";
import { findMostLikelyADYear } from "../../calculation/years";
import { TimeUnits } from "../../utils/timeunits";

export const WEEKDAY_DICTIONARY: { [word: string]: number } = {
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

export const MONTH_DICTIONARY: { [word: string]: number } = {
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

export const INTEGER_WORD_DICTIONARY: { [word: string]: number } = {
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
    "undicesimo":11,
    "undicesima": 11,
    "dodici": 12,
    "dodicesimo": 12,
    "dodicesima": 12,
};

export const TIME_UNIT_DICTIONARY: { [word: string]: OpUnitType } = {
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

//-----------------------------

export const NUMBER_PATTERN = `(?:${matchAnyPattern(
    INTEGER_WORD_DICTIONARY
)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s*an?)?|an?(?:\\s*few)?|few|several|a?\\s*couple\\s*(?:of)?)`;

export function parseNumberPattern(match: string): number {
    const num = match.toLowerCase();
    if (INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return INTEGER_WORD_DICTIONARY[num];
    } else if (num === "a" || num === "an") {
        return 1;
    } else if (num.match(/few/)) {
        return 3;
    } else if (num.match(/half/)) {
        return 0.5;
    } else if (num.match(/couple/)) {
        return 2;
    } else if (num.match(/several/)) {
        return 7;
    }

    return parseFloat(num);
}

//-----------------------------

export const YEAR_PATTERN = `(?:[0-9]{1,4}(?:\\s*[vn]\\.?\\s*C(?:hr)?\\.?)?)`;
export function parseYear(match: string): number {
    if (/v/i.test(match)) {
        // v.Chr.
        return -parseInt(match.replace(/[^0-9]+/gi, ""));
    }

    if (/n/i.test(match)) {
        // n.Chr.
        return parseInt(match.replace(/[^0-9]+/gi, ""));
    }

    const rawYearNumber = parseInt(match);
    return findMostLikelyADYear(rawYearNumber);
}

//-----------------------------

const SINGLE_TIME_UNIT_PATTERN = `(${NUMBER_PATTERN})\\s{0,5}(${matchAnyPattern(TIME_UNIT_DICTIONARY)})\\s{0,5}`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");

export const TIME_UNITS_PATTERN = repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);

export function parseTimeUnits(timeunitText): TimeUnits {
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

function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
