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
/** @module ProManGameRisk */
const Prompt = require('../../objects/Prompt.js').Prompt;
const Component = require('../../objects/Component.js').Component;
const Collection = require('../../objects/Collection.js').Collection;
const Templates = require('../../lib/FragoleTemplates.js');
const ProManGameStack = require('./ProManGameStack.js').ProManGameStack;
const ProManGameTemplates = require('../content/promangame_templates.js');

/** Class ProManGameRisk
* @extends {module:Prompt~Prompt}
* Implements a clients-side prompt with multiple options
*/
class ProManGameRisk extends Prompt {
    constructor(id, header, content, image, actions={}, template=ProManGameTemplates.RISK_DEFAULT) {
        super(id, header, content, image, actions, template);
        this.context.contentId = 'risk_' + id;
    }

    /** display Risk to client(s) */
    show(players=undefined) {
        this.gameController.rpcServer.connect('risk_' + this.id, this.select, this);
        this.draw(players);
    }

/** gets called when an answer button is clicked */
select(option, clientId) {
    let selection = this.context.actions[option];
    let action = selection.action;
    this.context.selection = option;
    switch (action) {
        case 'skip':
            this.gameController.emit('skip', this.id, option, selection.value, this, clientId);
            break;
        case 'forward':
        case 'backward':
            this.gameController.emit('forwardOrBackward', this.id, option, selection.value, this, clientId);
            break;
        case 'water':    
            this.gameController.emit('water', this.id, option, selection.value, this, clientId);
            break;
        case 'proCoins': 
            this.gameController.emit('proCoins', this.id, option, selection.value, this, clientId);
            break;
        case 'noUmbrella': 
            this.gameController.emit('noUmbrella', this.id, option, selection.value, this, clientId);
            break;
        case 'noRope': 
            this.gameController.emit('noRope', this.id, option, selection.value, this, clientId);
            break;
        case 'noHelmet': 
            this.gameController.emit('noHelmet', this.id, option, selection.value, this, clientId);
            break;
        case 'backToStart': 
            this.gameController.emit('backToStart', this.id, option, selection.value, this, clientId);
            break;
        default:
            break;
    }
    this.gameController.rpcServer.disconnect('risk_' + this.id);
}
}

module.exports  = {
    ProManGameRisk: ProManGameRisk,
};
