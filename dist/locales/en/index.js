"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.GB = exports.strict = exports.casual = void 0;
const ENTimeUnitWithinFormatParser_1 = __importDefault(require("./parsers/ENTimeUnitWithinFormatParser"));
const ENMonthNameLittleEndianParser_1 = __importDefault(require("./parsers/ENMonthNameLittleEndianParser"));
const ENMonthNameMiddleEndianParser_1 = __importDefault(require("./parsers/ENMonthNameMiddleEndianParser"));
const ENMonthNameParser_1 = __importDefault(require("./parsers/ENMonthNameParser"));
const ENCasualYearMonthDayParser_1 = __importDefault(require("./parsers/ENCasualYearMonthDayParser"));
const ENSlashMonthFormatParser_1 = __importDefault(require("./parsers/ENSlashMonthFormatParser"));
const ENTimeExpressionParser_1 = __importDefault(require("./parsers/ENTimeExpressionParser"));
const ENTimeUnitAgoFormatParser_1 = __importDefault(require("./parsers/ENTimeUnitAgoFormatParser"));
const ENTimeUnitLaterFormatParser_1 = __importDefault(require("./parsers/ENTimeUnitLaterFormatParser"));
const ENMergeDateRangeRefiner_1 = __importDefault(require("./refiners/ENMergeDateRangeRefiner"));
const ENMergeDateTimeRefiner_1 = __importDefault(require("./refiners/ENMergeDateTimeRefiner"));
const configurations_1 = require("../../configurations");
const ENCasualDateParser_1 = __importDefault(require("./parsers/ENCasualDateParser"));
const ENCasualTimeParser_1 = __importDefault(require("./parsers/ENCasualTimeParser"));
const ENWeekdayParser_1 = __importDefault(require("./parsers/ENWeekdayParser"));
const ENRelativeDateFormatParser_1 = __importDefault(require("./parsers/ENRelativeDateFormatParser"));
const chrono_1 = require("../../chrono");
const SlashDateFormatParser_1 = __importDefault(require("../../common/parsers/SlashDateFormatParser"));
const ENTimeUnitCasualRelativeFormatParser_1 = __importDefault(require("./parsers/ENTimeUnitCasualRelativeFormatParser"));
exports.casual = new chrono_1.Chrono(createCasualConfiguration(false));
exports.strict = new chrono_1.Chrono(createConfiguration(true, false));
exports.GB = new chrono_1.Chrono(createConfiguration(false, true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = false) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new ENCasualDateParser_1.default());
    option.parsers.unshift(new ENCasualTimeParser_1.default());
    option.parsers.unshift(new ENMonthNameParser_1.default());
    option.parsers.unshift(new ENRelativeDateFormatParser_1.default());
    option.parsers.unshift(new ENTimeUnitCasualRelativeFormatParser_1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = false) {
    return configurations_1.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1.default(littleEndian),
            new ENTimeUnitWithinFormatParser_1.default(),
            new ENMonthNameLittleEndianParser_1.default(),
            new ENMonthNameMiddleEndianParser_1.default(),
            new ENWeekdayParser_1.default(),
            new ENCasualYearMonthDayParser_1.default(),
            new ENSlashMonthFormatParser_1.default(),
            new ENTimeExpressionParser_1.default(strictMode),
            new ENTimeUnitAgoFormatParser_1.default(strictMode),
            new ENTimeUnitLaterFormatParser_1.default(strictMode),
        ],
        refiners: [new ENMergeDateTimeRefiner_1.default(), new ENMergeDateRangeRefiner_1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
