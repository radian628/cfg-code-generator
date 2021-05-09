import { CFGRule } from "./cfg-generator.js";

const regexes = {
    ws: /s+/g,
    variable: /\$/g,
    identifier: /[^\|;$\s+]+/g,
    concatenator: /\+/g,
    separator: /;/g,
    or: /\|/g,
    define: /::=/g
};

// Object.keys(regexes).forEach(key => {
//     let regex = regexes[key];
//     let regex2 = new RegExp(regex.toString, "gd");
// });

function getRegexTokens(str) {
    let tokens = [];
    Object.keys(regexes).forEach(key => {
        let regex = regexes[key];
        let matches = str.matchAll(regex);
        matches = matches.map(match => {return{ str: match[0], index: match.index, type: key }});
        tokens = tokens.concat(matches);
    });
    tokens.sort((a, b) => a.index > b.index);
    return tokens;
}

export function parseCFGeneratorString(str) {
    let tokens = getRegexTokens(str);

    let quoteMode = false;

    let ruleset = [];
    let currentRule;
    let lastIdentifier;

    tokens.forEach((token, i) => {
        ({
            ws: () => {

            },
            variable: () => {
                quoteMode = !quoteMode;
            },
            identifier: () => {
                lastIdentifier = token;
            },
            concatenator: () => {

            },
            separator: () => {

            },
            or: () => {

            },
            define: () => {

            }
        })[token.type]();
    });
}