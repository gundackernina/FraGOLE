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
/** @module Player */
const Player = require('../../objects/Player.js').Player;

/** Class ProManGamePlayer
* @extends {module:Player~Player}
* logical representation of a ProManGamePlayer
* a ProManGamePlayer has a boolean property if he is an agile Player or not
* a ProManGamePlayer has a boolean property if he has finished the game or not
* a ProManGamePlayer has a boolean property if he is shopping for the first time or not
* a ProManGamePlayer has a boolean property if he has passed the peak hoher Alpstein or not
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