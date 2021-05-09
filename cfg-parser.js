import { CFGRule } from "./cfg-generator.js";

const regexes = {
    ws: /s+/g,
    quote: /"/g,
    identifier: /[^"\|;\s]+/g,
    separator: /;/g,
    or: /\|/g
};

Object.keys(regexes).forEach(key => {
    let regex = regexes[key];
    let regex2 = new RegExp(regex.toString, "gd");
});

export function parseCFG(str) {

}