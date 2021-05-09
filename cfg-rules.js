export const Rules = {
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
    ],
    signedDigit: [
        [
            ["-", true],
            ["digit"]
        ],
        [
            ["digit"]
        ]
    ],
    expression: function (exprName, operName, baseName, noParenWeight, parenWeight, baseWeight) {
        return [
            {
                tokens: [
                    [exprName],
                    [" ", true],
                    [operName],
                    [" ", true],
                    [exprName]
                ],
                weight: noParenWeight,
                limitWeight: 0
            },
            {
                tokens: [
                    ["(", true],
                    [exprName],
                    [" ", true],
                    [operName],
                    [" ", true],
                    [exprName],
                    [")", true]
                ],
                weight: parenWeight,
                limitWeight: 0
            },
            {
                tokens: [
                    [[baseName]]
                ],
                weight: baseWeight
            }
        ]
    },
    strChoices: function(...strings) {
        return strings.map(str => [[str, true]]);
    }
}