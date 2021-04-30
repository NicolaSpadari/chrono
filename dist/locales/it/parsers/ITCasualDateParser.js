"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
const dayjs_2 = require("../../../utils/dayjs");
const ITCasualTimeParser_1 = __importDefault(require("./ITCasualTimeParser"));
const references = __importStar(require("../../../common/casualReferences"));
const PATTERN = new RegExp(`(ora|adesso|questa|mattina|mattino|pomeriggio|sera|serata|oggi|ieri|altroieri||notte)` +
    `(?:(mattina|mattino|vormittag|mittags?|nachmittag|abend|nacht|mitternacht))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const TIME_GROUP = 2;
class DECasualDateParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return PATTERN;
    }
    innerExtract(context, match) {
        let targetDate = dayjs_1.default(context.refDate);
        const dateKeyword = (match[DATE_GROUP] || "").toLowerCase();
        const timeKeyword = (match[TIME_GROUP] || "").toLowerCase();
        let component = context.createParsingComponents();
        switch (dateKeyword) {
            case "adesso":
            case "ora":
                component = references.now(context.refDate);
                break;
            case "oggi":
                component = references.today(context.refDate);
                break;
            case "mattina":
            case "mattino":
                dayjs_2.assignTheNextDay(component, targetDate);
                break;
            case "dopodomani":
                targetDate = targetDate.add(1, "day");
                dayjs_2.assignTheNextDay(component, targetDate);
                break;
            case "ieri":
                targetDate = targetDate.add(-1, "day");
                dayjs_2.assignSimilarDate(component, targetDate);
                dayjs_2.implySimilarTime(component, targetDate);
                break;
            case "altro ieri":
                targetDate = targetDate.add(-2, "day");
                dayjs_2.assignSimilarDate(component, targetDate);
                dayjs_2.implySimilarTime(component, targetDate);
                break;
            default:
                if (dateKeyword.match(/questa\s*notte/)) {
                    if (targetDate.hour() > 6) {
                        targetDate = targetDate.add(-1, "day");
                    }
                    dayjs_2.assignSimilarDate(component, targetDate);
                    component.imply("hour", 0);
                }
                break;
        }
        if (timeKeyword) {
            component = ITCasualTimeParser_1.default.extractTimeComponents(component, timeKeyword);
        }
        return component;
    }
}
exports.default = DECasualDateParser;
