import AbstractMergeDateTimeRefiner from "../../../common/refiners/AbstractMergeDateTimeRefiner";

/**
 * Merging date-only result and time-only result (see. AbstractMergeDateTimeRefiner).
 */
export default class DEMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner {
    patternBetween(): RegExp {
        return new RegExp("^\\s*(T|alle|dopo|le|prima|fa|fà|tra|,|-)?\\s*$");
    }
}
