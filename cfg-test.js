import { CFGRule, CFGReplacement, CFGToken, CFGRuleset } from "./cfg-generator.js";



// let rule = new CFGRule("test", [
// 	new CFGReplacement([
//     	new CFGToken("test", false),
//     	new CFGToken(" x ", true),
//     	new CFGToken("test", false)
//     ]),
// 	new CFGReplacement([
//     	new CFGToken(" e ", true),
//     ]),
// ]);

// let ruleset = CFGRuleset.fromJSON({
//     test: [
//         [
//             ["test"],
//             [" x ", true],
//             ["test"]
//         ],
//         [
//             [" e ", true]
//         ]
//     ]
// });

let ruleset = CFGRuleset.fromJSON({
    expr: [
        [
            ["expr"],
            [" ", true],
            ["operation"],
            [" ", true],
            ["expr"]
        ],
        [
            ["(", true],
            ["expr"],
            [" ", true],
            ["operation"],
            [" ", true],
            ["expr"],
            [")", true]
        ],
        [
            ["digit"]
        ]
    ],
    operation: [
        [["+", true]],
        [["-", true]]
    ],
    digit: [
        [["0", true]],
        [["1", true]],
        [["2", true]],
        [["3", true]],
        [["4", true]],
        [["5", true]],
        [["6", true]],
        [["7", true]],
        [["8", true]],
        [["9", true]],
    ]
});

console.log(ruleset);


let testStr = [
    {
        content: "expr",
        isString: false
    }
    ];
let str = ruleset.makeString(testStr, 4);

console.log(str);