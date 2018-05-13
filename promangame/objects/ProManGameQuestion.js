/**
 * @Author: Nina Gundacker
 * @Date:   2017-06-04T10:48:10+02:00
 * @Email:  nina.gundacker@nefkom.net
 * @Project: ProManGameWithFraGOLE
 * @Last modified by:   Nina Gundacker
 * @Last modified time: 2017-09-03T14:40:20+02:00
 * @License: MIT
 * @Copyright: Nina Gundacker
 */
/** @module ProManGameQuestion */
const Question = require('../../objects/Prompt.js').Question;
const Component = require('../../objects/Component.js').Component;
const Collection = require('../../objects/Collection.js').Collection;
const Templates = require('../../lib/FragoleTemplates.js');
const ProManGameStack = require('./ProManGameStack.js').ProManGameStack;
const ProManGameTemplates = require('../content/promangame_templates.js');

/** Class ProManGameQuestion
* @extends {module:Question~Question}
// Implements a clients-side prompt with multiple options
*/
class ProManGameQuestion extends Question {
    constructor(id, header, content, image, actions={}, category, template=Templates.QUESTION_DEFAULT) {
        super(id, header, content, image, actions, template);
        this.category = category;
    }
}

/** Class ProManGameQuestionStack
* @extends {module:ProManGameStack~ProManGameStack}
*/
class ProManGameQuestionStack extends ProManGameStack {
    /**
    * create a ProManGameQuestionStack
    * @param {string} id - unique id
    */
    constructor(id, template=Templates.CARD_STACK_DEFAULT) {
        super(id, template);
    }

    /**
     * get one random ProManGameQuestion from the stack 
     * you can filter with a category
     */
    getProManGameQuestion(category) {
        //TODO: filter from category
        let max = this.stack.length;
        let index = Math.floor(Math.random() * (max));
        return this.proManGameItems.getItem(this.stack[index]);
    } 
}

module.exports  = {
    ProManGameQuestion: ProManGameQuestion,
    ProManGameQuestionStack: ProManGameQuestionStack,
};
