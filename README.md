# cfg-code-generator
A JSON-based DSL that can generate code given a set of rules.

## How does this work?
This program can procedurally generate code given a set of rules, and could be used for programming assignments (e.g. using it to generate programs for which students can predict their output). It uses a JSON-based system semantically similar to Backus-Naur Form to generate the code.

This JSON-based system is built on a system of replacement rules. Each **rule** is composed of a **name** and **replacers**, where each replacer is a set of **tokens**. When the code is run, it is given an **instance of a rule** (or multiple of them). An "instance of a rule" is essentially a block of data that says "replace me based on this rule!". As the name would suggest, this means that the instance of the rule is replaced with all of the tokens from one of the rule's replacers. Tokens can be strings, or other instances of a rule. For example, you could have an instance of the `digit` rule, which is replaced with any of the strings `"0"`, `"1"`, `"2"`, `"3"`, `"4"`, `"5"`, `"6"`, `"7"`, `"8"`, or `"9"`. A more complex example would be an instance of the `signedDigit` rule, which is replaced with either a `"-"` or a `"+"`, followed by a `digit`. As you can probably tell, these rules are applied recursively, allowing for very complex structures.

## Usage
The `fromJSON` static member of the `CFGRuleset` class allows JSON expressions to be parsed into language rules. The keys of the root object identify the **rule** names. In this case, "expr", "operation", "digit", and "signedDigit" are rules, as you may be able to tell. 

The value of each of these keys is an array of **replacers**. A single replacer can take one of two forms- an array or an object. If a replacer is an array, the array represents a sequence of **tokens**. Each token is an array as well, where the first element is the name of the token, and the second element determines whether the token is a string. If the second element is `true`, the first element is treated as a string. If the second element is `false`, the first element is treated as the name of a rule.

If the replacer is an object, it has three properties- `tokens`, `weight`, and `limitWeight`. `tokens` is just a list of tokens. `weight` describes how likely this replacer is to be chosen (defaults to 1). `limitWeight` describes how likely this replacer is to be chosen, given that a user-defined limit to the number of tokens has been reached (also defaults to 1). By strategically setting `limitWeight`s to zero, you can take a set of rules that would normally lead to arbitrarily-large output, limit its size, and prevent its output from being full of unparseable rule instances (in the end, only strings can be in the output).

As an example, here is a rule that generates arbitrary mathematical expressions containing addition and subtraction between single digits.
```js
import { CFGRuleset } from "./cfg-generator.js";
import { Rules } from "./cfg-rules.js";

let addSubtractRules = CFGRuleset.fromJSON({
    expr: [
        {
            tokens: [ //convert expr into two exprs, added or subtracted from each other.
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
            tokens: [ //same as last one, but with parentheses
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
        { //evaluates to a single signed digit
            tokens: [["signedDigit"]],
            weight: 1
        }
    ],
    operation: [ //operations can be either addition or subtraction
        [["+", true]],
        [["-", true]]
    ],
    digit: Rules.digit, //taken from cfg-rules.js
    signedDigit: Rules.signedDigit
});
```

To apply the rules themselves (and generate some code), you first have to create a rule object. This can be done as follows. Just change the `content` property to whatever rule you want to start out with.
```js
let ruleObj = [
    {
        content: "expr", //<-- Change this to whichever rule you want to start out with.
        isString: false
    }
];
```

Now call the `makeString` function of your `CFGRuleset` object, and you will have your generated code segment!
```js
let str = addSubtractRules.makeString(ruleObj, 10 /*Maximum number of replacement iterations*/, 50 /*Maximum number of tokenx before limitWeight is used.*/);
console.log(str);
```