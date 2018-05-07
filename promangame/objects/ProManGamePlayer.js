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
/** @module Player */
const Player = require('../../objects/Player.js').Player;

/** Class ProManGamePlayer
* @extends {module:Player~Player}
* logical representation of a ProManGamePlayer
* has an Inventory => Collection of GameObject
*/
class ProManGamePlayer extends Player {
    constructor(id, agil) {
        super(id);
        this.agil = agil;
        this.finished = false;
        this.firstShoppingCall = true;
        this.hoherAlpsteinPassed = false;
    }
}

module.exports.ProManGamePlayer = ProManGamePlayer;