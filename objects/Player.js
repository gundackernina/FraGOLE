/**
 * @Author: Michael Bauer
 * @Date:   2017-06-04T10:48:10+02:00
 * @Email:  mb@bauercloud.de
 * @Project: Fragole - FrAmework for Gamified Online Learning Environments
 * @Last modified by:   Michael Bauer
 * @Last modified time: 2017-06-04T19:02:10+02:00
 * @License: MIT
 * @Copyright: Michael Bauer
 */

var GameObject = require('./GameObject.js').GameObject;
var Collection = require('./Collection.js').Collection;

// logical representation of a Player
// has an Inventory => Collection of GameObject
class Player extends GameObject {
    constructor (id) {
        super(id);
        this.number = ++Player.playerNumber;
        this.joined = false;
        this.session = undefined; // will be set by GameController.joinPlayer
        this.name = undefined;    // will be set by GameController.joinPlayer
        this.inventory = new Collection();
        this.inventory.owner = this;
        this.skip_turns = 0;
    }

    // add a GameObject to the Players inventory
    addInventory (item) {
        this.inventory.addItem(item);
        item.owner = this;
    }

    // get a Item / List of Items from the players inventory
    // either by id or filtered by category
    getInventory( {id='', category=''} ) {
        if (id) {
            return this.inventory.getItem(id);
        } else if (category) {
            return this.inventory.getCategory(category);
        }
    }

    // remove an Item from the players Inventory
    removeInventory (item) {
        this.inventory.deleteItem(item.id);
        item.owner = undefined;
    }

}
Player.playerNumber = 0;
module.exports.Player = Player;
