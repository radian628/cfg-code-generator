export function choose(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function choosew(choices, key) {
	let sum = choices.reduce((prev, cur) => prev + cur[key], 0);
	let choice = Math.random() * sum;
	let i = 0;
	while (i < choices.length) {
		choice -= choices[i][key];
		if (choice < 0) break;
		i++;
	}
	return choices[i];
}

export class CFGToken {
	constructor (content, isString) {
    	this.content = content;
        this.isString = isString;
    }
}

export class CFGReplacement {
	constructor (tokens, weight, limitWeight) {
		this.tokens = tokens;
		this.weight = (weight === undefined) ? 1 : weight;
		this.limitWeight = (limitWeight === undefined) ? 1 : limitWeight;
        this.isConcrete = (this.tokens.length == 1) && this.tokens[0].isString;
    }
}

export class CFGRule {
	constructor(identifier, replacements) {
    	this.identifier = identifier;
        this.replacements = replacements;
    }
    
    replace (list, limit) {
    	let newList = [];
    	for (let i = 0; list.length > i; i++) {
        	if (!list[i].isString && list[i].content == this.identifier) {
            	let replacement = choosew(this.replacements, limit ? "limitWeight" : "weight");
                newList.push(...replacement.tokens);
            } else {
            	newList.push(list[i]);
            }
        }
        return newList;
    }
}

export class CFGRuleset {
    constructor (rules) {
        this.rules = rules;
    }

    static fromJSON(json) {
        let rules = [];

        Object.keys(json).forEach(key => {
            let replacements = [];
            json[key].forEach(replacementJSON => {
				let tokens = [];
				let weight = 1;
				let limitWeight = 1;

				if (Array.isArray(replacementJSON)) {
					replacementJSON.forEach(tokenJSON => {
						tokens.push(new CFGToken(tokenJSON[0], tokenJSON[1]));
					});
				} else {
					weight = replacementJSON.weight;
					limitWeight = replacementJSON.limitWeight;
					replacementJSON.tokens.forEach(tokenJSON => {
						tokens.push(new CFGToken(tokenJSON[0], tokenJSON[1]));
					});
				}

                replacements.push(new CFGReplacement(tokens, weight, limitWeight));
            });

            let rule = new CFGRule(key, replacements);
            rules.push(rule);
        });

        return new CFGRuleset(rules);
    }

    makeString(startRule, iters, lengthLimit) {
		if (!lengthLimit) lengthLimit = Infinity;
		let i = 0;
		let concrete = false;

		let limitReached = false;

		let doIteration = () => {
			concrete = true;
            this.rules.forEach(rule => {
                startRule = rule.replace(startRule, limitReached);
			});
			startRule.forEach(stmt => { if (!stmt.isString) concrete = false });
		}

		while (i < iters && !concrete && startRule.length < lengthLimit) {
			doIteration();
			i++;
		}

		i = 0;
		limitReached = true;
		while (i < iters && !concrete) {
			doIteration();
			i++;
		}

        return CFGConcretify(startRule);
    }
}

export function CFGConcretify(arr) {
	return arr.map(elem => {
    	return (elem.isString) ? elem.content : "";
    }).join("");
}