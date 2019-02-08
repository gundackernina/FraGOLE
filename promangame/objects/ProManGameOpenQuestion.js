const Form = require('../../objects/Prompt.js').Form;
const Templates = require('../../lib/FragoleTemplates.js');

class ProManGameOpenQuestion extends Form {
    /**
    * @param {string} header - header-text
    * @param {string} content - content of the form => HTML (just the part between <form> & </form>)
    * @param {string} defaultAnswer - content of correct answer
    * @param {integer} value - value of the Question
    * @param {string} postBtn - text of the button that submits the form
    * @param {string} cancelBtn - test oft the button that cancels te form
    */
    constructor(id, header, content, defaultAnswer, value, postBtn = 'ok', cancelBtn = 'Weiß nicht', template = Templates.FORM_DEFAULT) {
        super(id, header, content, postBtn, cancelBtn, template);
        this.defaultAnswer = defaultAnswer;
        this.value = value;
    }
}
module.exports.ProManGameOpenQuestion = ProManGameOpenQuestion;