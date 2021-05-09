export function choose(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export class CFGToken {
	constructor (content, isString) {
    	this.content = content;
        this.isString = isString;
    }
}

export class CFGReplacement {
	constructor (tokens) {
    	this.tokens = tokens;
        this.isConcrete = (this.tokens.length == 1) && this.tokens[0].isString;
    }
}

export class CFGRule {
	constructor(identifier, replacements) {
    	this.identifier = identifier;
        this.replacements = replacements;
    }
    
    replace (list) {
    	let newList = [];
    	for (let i = 0; list.length > i; i++) {
        	if (!list[i].isString && list[i].content == this.identifier) {
            	let replacement = choose(this.replacements);
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
                replacementJSON.forEach(tokenJSON => {
                    tokens.push(new CFGToken(tokenJSON[0], tokenJSON[1]));
                });

                replacements.push(new CFGReplacement(tokens));
            });

            let rule = new CFGRule(key, replacements);
            rules.push(rule);
        });

        return new CFGRuleset(rules);
    }

    makeString(startRule, iters) {
        for (let i = 0; iters > i; i++) {
            this.rules.forEach(rule => {
                startRule = rule.replace(startRule);
            });
        }
        return CFGConcretify(startRule);
    }
}

export function CFGConcretify(arr) {
	return arr.map(elem => {
    	return (elem.isString) ? elem.content : "";
    }).join("");
}



