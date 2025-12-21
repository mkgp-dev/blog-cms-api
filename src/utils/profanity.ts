import { CensorType, Profanity } from "@2toad/profanity";

export const usernameFilter = new Profanity({
    languages: ["en"],
    wholeWord: false,
    unicodeWordBoundaries: true,
});

export const commentFilter = new Profanity({
    languages: ["en"],
    wholeWord: true,
    grawlix: "*****",
    unicodeWordBoundaries: true,
});

export const CENSOR_TYPE = CensorType.Word;