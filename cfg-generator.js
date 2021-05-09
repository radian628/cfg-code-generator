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
	constructor(identifier, replacements, settings) {
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

export function CFGConcretify(arr) {
	return arr.map(elem => {
    	return (elem.isString) ? elem.content : "";
    }).join("");
}

let testStr = [
{
	content: "test",
    isString: false
}
];

let rule = new CFGRule("test", [
	new CFGReplacement([
    	new CFGToken("test", false),
    	new CFGToken(" x ", true),
    	new CFGToken("test", false)
    ]),
	new CFGReplacement([
    	new CFGToken(" e ", true),
    ]),
]);

for (let i = 0; 6 > i; i++) {
	testStr = rule.replace(testStr);
}

console.log(CFGConcretify(testStr));

