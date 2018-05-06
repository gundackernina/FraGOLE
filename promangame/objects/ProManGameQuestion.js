// /**
//  * @Author: Michael Bauer
//  * @Date:   2017-05-20T09:25:44+02:00
//  * @Email:  mb@bauercloud.de
//  * @Project: Fragole - FrAmework for Gamified Online Learning Environments
// * @Last modified by:   Michael Bauer
// * @Last modified time: 2017-09-03T10:22:41+02:00
// * @License: MIT
// * @Copyright: Michael Bauer
// */

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
        //if (typeof category === 'undefined') {
            let max = this.stack.length;
            let index = Math.floor(Math.random() * (max));
            return this.proManGameItems.getItem(this.stack[index]);
        //} else {
            //
        //}
    } 
}

module.exports  = {
    ProManGameQuestion: ProManGameQuestion,
    ProManGameQuestionStack: ProManGameQuestionStack,
};
