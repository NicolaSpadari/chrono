"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
const configurations_1 = require("../../configurations");
const chrono_1 = require("../../chrono");
const FRCasualDateParser_1 = __importDefault(require("./parsers/FRCasualDateParser"));
const FRCasualTimeParser_1 = __importDefault(require("./parsers/FRCasualTimeParser"));
const SlashDateFormatParser_1 = __importDefault(require("../../common/parsers/SlashDateFormatParser"));
const FRTimeExpressionParser_1 = __importDefault(require("./parsers/FRTimeExpressionParser"));
const FRMergeDateTimeRefiner_1 = __importDefault(require("./refiners/FRMergeDateTimeRefiner"));
const FRMergeDateRangeRefiner_1 = __importDefault(require("./refiners/FRMergeDateRangeRefiner"));
const FRWeekdayParser_1 = __importDefault(require("./parsers/FRWeekdayParser"));
const FRSpecificTimeExpressionParser_1 = __importDefault(require("./parsers/FRSpecificTimeExpressionParser"));
const FRMonthNameLittleEndianParser_1 = __importDefault(require("./parsers/FRMonthNameLittleEndianParser"));
const FRTimeUnitAgoFormatParser_1 = __importDefault(require("./parsers/FRTimeUnitAgoFormatParser"));
const FRTimeUnitWithinFormatParser_1 = __importDefault(require("./parsers/FRTimeUnitWithinFormatParser"));
const FRTimeUnitRelativeFormatParser_1 = __importDefault(require("./parsers/FRTimeUnitRelativeFormatParser"));
exports.casual = new chrono_1.Chrono(createCasualConfiguration());
exports.strict = new chrono_1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new FRCasualDateParser_1.default());
    option.parsers.unshift(new FRCasualTimeParser_1.default());
    option.parsers.unshift(new FRTimeUnitRelativeFormatParser_1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations_1.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1.default(littleEndian),
            new FRMonthNameLittleEndianParser_1.default(),
            new FRTimeExpressionParser_1.default(),
            new FRSpecificTimeExpressionParser_1.default(),
            new FRTimeUnitAgoFormatParser_1.default(),
            new FRTimeUnitWithinFormatParser_1.default(),
            new FRWeekdayParser_1.default(),
        ],
        refiners: [new FRMergeDateTimeRefiner_1.default(), new FRMergeDateRangeRefiner_1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
