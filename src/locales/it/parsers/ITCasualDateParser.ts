import { ParsingContext } from "../../../chrono";
import { ParsingComponents, ParsingResult } from "../../../results";
import dayjs from "dayjs";
import { AbstractParserWithWordBoundaryChecking } from "../../../common/parsers/AbstractParserWithWordBoundary";
import { assignSimilarDate, assignTheNextDay, implySimilarTime } from "../../../utils/dayjs";
import DECasualTimeParser from "./ITCasualTimeParser";
import * as references from "../../../common/casualReferences";

const PATTERN = new RegExp(
    `(ora|adesso|questa|mattina|mattino|pomeriggio|sera|serata|oggi|ieri|altroieri||notte)` +
        `(?:(mattina|mattino|vormittag|mittags?|nachmittag|abend|nacht|mitternacht))?` +
        `(?=\\W|$)`,
    "i"
);

const DATE_GROUP = 1;
const TIME_GROUP = 2;

export default class DECasualDateParser extends AbstractParserWithWordBoundaryChecking {
    innerPattern(context: ParsingContext): RegExp {
        return PATTERN;
    }

    innerExtract(context: ParsingContext, match: RegExpMatchArray): ParsingComponents | ParsingResult {
        let targetDate = dayjs(context.refDate);
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
                assignTheNextDay(component, targetDate);
                break;

            case "dopodomani":
                targetDate = targetDate.add(1, "day");
                assignTheNextDay(component, targetDate);
                break;

            case "ieri":
                targetDate = targetDate.add(-1, "day");
                assignSimilarDate(component, targetDate);
                implySimilarTime(component, targetDate);
                break;

            case "altro ieri":
                targetDate = targetDate.add(-2, "day");
                assignSimilarDate(component, targetDate);
                implySimilarTime(component, targetDate);
                break;

            default:
                if (dateKeyword.match(/questa\s*notte/)) {
                    if (targetDate.hour() > 6) {
                        targetDate = targetDate.add(-1, "day");
                    }

                    assignSimilarDate(component, targetDate);
                    component.imply("hour", 0);
                }

                break;
        }

        if (timeKeyword) {
            component = DECasualTimeParser.extractTimeComponents(component, timeKeyword);
        }

        return component;
    }
}
