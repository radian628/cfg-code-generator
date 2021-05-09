import { CFGRuleset } from "./cfg-generator.js";
import { Rules } from "./cfg-rules.js";

let addSubtractRules = CFGRuleset.fromJSON({
    expr: Rules.expression("expr", "operation", "signedDigit", 6, 3, 1),
    operation: Rules.strChoices("-", "+"),
    digit: Rules.digit,
    signedDigit: Rules.signedDigit
});

let booleanRules = CFGRuleset.fromJSON({
    boolExpr: (() => {
        let rule = Rules.expression("boolExpr", "logicOperator", "bool", 5, 3, 1);
        rule[1].tokens.splice(0, 0, ["maybeNot"]);
        return rule;
    })(),
    bool: Rules.strChoices("true", "false"),
    maybeNot: Rules.strChoices("", "!"),
    logicOperator: Rules.strChoices("&&", "||")
});

let test = [
    {
        content: "boolExpr",
        isString: false
    }
    ];

for (let i = 2; 50 > i; i++) {
    let str = booleanRules.makeString(test, 10, i);
    console.log(str);
    console.log(eval(str));
}