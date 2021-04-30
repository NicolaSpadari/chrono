import { includeCommonConfiguration } from "../../configurations";
import { ParsedResult, ParsingOption } from "../../index";
import { Chrono, Configuration } from "../../chrono";
import SlashDateFormatParser from "../../common/parsers/SlashDateFormatParser";
import ISOFormatParser from "../../common/parsers/ISOFormatParser";
import ITTimeExpressionParser from "./parsers/ITTimeExpressionParser";
import ITWeekdayParser from "./parsers/ITWeekdayParser";
import ITMergeDateRangeRefiner from "./refiners/ITMergeDateRangeRefiner";
import ITMergeDateTimeRefiner from "./refiners/ITMergeDateTimeRefiner";
import ITCasualDateParser from "./parsers/ITCasualDateParser";
import ITCasualTimeParser from "./parsers/ITCasualTimeParser";
import ITMonthNameLittleEndianParser from "./parsers/ITMonthNameLittleEndianParser";

// Shortcuts
export const casual = new Chrono(createCasualConfiguration());
export const strict = new Chrono(createConfiguration(true));

export function parse(text: string, ref?: Date, option?: ParsingOption): ParsedResult[] {
    return casual.parse(text, ref, option);
}

export function parseDate(text: string, ref?: Date, option?: ParsingOption): Date {
    return casual.parseDate(text, ref, option);
}

export function createCasualConfiguration(littleEndian = true): Configuration {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new ITCasualTimeParser());
    option.parsers.unshift(new ITCasualDateParser());
    return option;
}

export function createConfiguration(strictMode = true, littleEndian = true): Configuration {
    return includeCommonConfiguration(
        {
            parsers: [
                new ISOFormatParser(),
                new SlashDateFormatParser(littleEndian),
                new ITTimeExpressionParser(),
                new ITMonthNameLittleEndianParser(),
                new ITWeekdayParser(),
            ],
            refiners: [new ITMergeDateRangeRefiner(), new ITMergeDateTimeRefiner()],
        },
        strictMode
    );
}
