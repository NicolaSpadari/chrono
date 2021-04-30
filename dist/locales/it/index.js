"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
const configurations_1 = require("../../configurations");
const chrono_1 = require("../../chrono");
const SlashDateFormatParser_1 = __importDefault(require("../../common/parsers/SlashDateFormatParser"));
const ISOFormatParser_1 = __importDefault(require("../../common/parsers/ISOFormatParser"));
const ITTimeExpressionParser_1 = __importDefault(require("./parsers/ITTimeExpressionParser"));
const ITWeekdayParser_1 = __importDefault(require("./parsers/ITWeekdayParser"));
const ITMergeDateRangeRefiner_1 = __importDefault(require("./refiners/ITMergeDateRangeRefiner"));
const ITMergeDateTimeRefiner_1 = __importDefault(require("./refiners/ITMergeDateTimeRefiner"));
const ITCasualDateParser_1 = __importDefault(require("./parsers/ITCasualDateParser"));
const ITCasualTimeParser_1 = __importDefault(require("./parsers/ITCasualTimeParser"));
const ITMonthNameLittleEndianParser_1 = __importDefault(require("./parsers/ITMonthNameLittleEndianParser"));
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
    option.parsers.unshift(new ITCasualTimeParser_1.default());
    option.parsers.unshift(new ITCasualDateParser_1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations_1.includeCommonConfiguration({
        parsers: [
            new ISOFormatParser_1.default(),
            new SlashDateFormatParser_1.default(littleEndian),
            new ITTimeExpressionParser_1.default(),
            new ITMonthNameLittleEndianParser_1.default(),
            new ITWeekdayParser_1.default(),
        ],
        refiners: [new ITMergeDateRangeRefiner_1.default(), new ITMergeDateTimeRefiner_1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
