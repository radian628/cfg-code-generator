import { CFGRule, CFGReplacement, CFGToken, CFGRuleset } from "./cfg-generator.js";
import { Rules } from "./cfg-rules.js";

let addSubtractRules = CFGRuleset.fromJSON({
    expr: [
        {
            tokens: [
                ["expr"],
                [" ", true],
                ["operation"],
                [" ", true],
                ["expr"]
            ],
            weight: 5,
            limitWeight: 0
        },
        {
            tokens: [
                ["(", true],
                ["expr"],
                [" ", true],
                ["operation"],
                [" ", true],
                ["expr"],
                [")", true]
            ],
            weight: 2,
            limitWeight: 0
        },
        {
            tokens: [["signedDigit"]],
            weight: 1
        }
    ],
    operation: [
        [["+", true]],
        [["-", true]]
    ],
    digit: Rules.digit,
    signedDigit: Rules.signedDigit
});

let booleanRules = CFGRuleset.fromJSON({
    boolExpr: [
        {
            tokens: [
                ["boolExpr"],
                [" ", true],
                ["logicOperator"],
                [" ", true],
                ["boolExpr"]
            ],
            weight: 5,
            limitWeight: 0
        },
        {
            tokens: [
                ["maybeNot"],
                ["(", true],
                ["boolExpr"],
                [" ", true],
                ["logicOperator"],
                [" ", true],
                ["boolExpr"],
                [")", true]
            ],
            weight: 3,
            limitWeight: 0
        },
        {
            tokens: [
                [["bool"]]
            ],
            weight: 1
        }
    ],
    bool: [
        [["true", true]],
        [["false", true]]
    ],
    maybeNot: [
        [["!", true]],
        [["", true]]
    ],
    logicOperator: [
        [["&&", true]],
        [["||", true]]
    ]
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