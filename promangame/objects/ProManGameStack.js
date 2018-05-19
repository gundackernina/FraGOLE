/**
 * @Author: Nina Gundacker
 * @Date:   2018-05-06T10:48:10+02:00
 * @Email:  nina.gundacker@nefkom.net
 * @Project: ProManGameWithFraGOLE
 * @Last modified by:   Nina Gundacker
 * @Last modified time: 2018-05-06T10:48:10+02:00
 * @License: MIT
 * @Copyright: Nina Gundacker
 */
const Component = require('../../objects/Component.js').Component;
const Collection = require('../../objects/Collection.js').Collection;
const Templates = require('../../lib/FragoleTemplates.js');

/** Class ProManGameStack
* Stack represents an orderd stack of ProManGame-Objects
* ProManGame-Objects may be added to the stack
* the stack can also be shuffled
* @extends {module:Component~Component}
*/
class ProManGameStack extends Component {
    /**
    * create a ProManGameRiskStack
    * @param {string} id - unique id
    */
    constructor(id, template=Templates.CARD_STACK_DEFAULT) {
        super(id, template);
        this.context.contentId = 'proManGame_stack_' + id;
        //die ProManGameItems die im Stapel vorhanden sein sollen
        this.proManGameItems = new Collection();
        //die Ids der ProManGameRisks
        this.stack = [];
    }

    /**
    * add ProManGameItem(s) to the stack
    * @param {Array<ProManGameQuestion>|Array<ProManGameRisk} proManGameItems an Array of ProManGameRisk ord ProManGameQuestion-objects
    */
    addProManGameItems(proItems) {
        for(let elem in proItems) {
            let proItem = proItems[elem];
            this.stack.push(proItem.id);
            this.proManGameItems.addItem(proItem);
        }
    }

    /**
    * shuffle the stack
    * every ProManGameRisk will be moved to a new, random position within the stack
    */
    shuffle() {
        for (let i = this.stack.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [this.stack[i - 1], this.stack[j]] = [this.stack[j], this.stack[i - 1]];
        }
    }

    /**
     * get one random ProManGameItem from the stack 
     */
    getProManGameStackItem() {
        let max = this.stack.length;
        let index = Math.floor(Math.random() * (max));
        return this.proManGameItems.getItem(this.stack[index]);
    } 
}

module.exports.ProManGameStack = ProManGameStack;