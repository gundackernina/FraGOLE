/**
 * @Author: Nina Gundacker
 * @Date:   2018-05-10T11:09:28+02:00
 * @Email:  nina.gundacker@nefkom.net
 * @Project: ProManGameWithFraGOLE
 * @Last modified by:   Nina Gundacker
 * @Last modified time: 2018-05-10T11:09:28+02:00
 * @License: MIT
 * @Copyright: Nina Gundacker
 */

 /**
 * Common functionalities for ProManGame
 */
const ProManGameTemplates = require('../content/promangame_templates.js');
const CustomTemplates = require('../../content/custom_templates.js');

/**
 * Content String for the shopping dialog
 */
const shoppingFormString = `
    <div class="field">
        <label>Wasserflaschen</label> 
        <select name="select_bottles" class="ui fluid dropdown">
        <option selected="selected" value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        </select>
    </div>
    <div class="field">
        <div class="ui checkbox">
            <input name="checkbox_umbrella" disabled type="checkbox">
            <label>Regenschirm?</label>
        </div>
    </div>
    <div class="field">
        <div class="ui checkbox">
            <input name="checkbox_rope" disabled type="checkbox">
            <label>Seil?</label>
        </div>
    </div>
    <div class="field">
        <div class="ui checkbox">
            <input name="checkbox_helmet" disabled type="checkbox">
            <label>Helm?</label>
        </div>
    </div>`;
module.exports.shoppingFormString = shoppingFormString;

/**
 * Returns the content-String for the shopping dialog in dependency of the already existing
 * inventories of a player.
 * If the player already has an umbrella the checkbox can stay disabled
 * Otherwise it has to be enabled
 * @param {ProManGamePlayer} player 
 */
function getShoppingFormString(player) {
    let umbrella = player.getInventory({id: player.id + 'Umbrella'});
    let helmet = player.getInventory({id: player.id + 'Helmet'});
    let rope = player.getInventory({id: player.id + 'Rope'});
    let result = shoppingFormString;

    //Das Einkaufen eines Schirms nur aktivieren wenn
    //Player agil ist und noch keinen hat ODER
    //Player den Shopping-Dialog das erste Mal aufruft
    if ((player.agil && !umbrella.context.value) || player.firstShoppingCall) {
        result = result.replace("umbrella\" disabled ", "umbrella\" ");
    }
    if ((player.agil && !helmet.context.value) || player.firstShoppingCall) {
        result = result.replace("helmet\" disabled ", "helmet\" ");
    }
    if ((player.agil && !rope.context.value) || player.firstShoppingCall) {
        result = result.replace("rope\" disabled ", "rope\" ");
    }
    return result;
}
module.exports.getShoppingFormString = getShoppingFormString;

/**
 * Checks and calculates the purchase of a player
 * If the player wants more items than he has proCoins left, no items are added to
 * his inventory.
 * If the player has enough proCoins left, the items are added to his inventory and
 * the proCoins were moved from his proCoin wallet
 * @param {ProManGamePlayer} player 
 * @param {Array} data 
 */
function checkAndChargeShopping(player, data) {
    let anzBottles = 0;
    let rope = 0;
    let helmet = 0;
    let umbrella = 0;
    //Inventory Control - which items does the player want to buy?
    for (let index = 0; index < data.length; index++) {
        let shoppingItem = data[index];
        if (shoppingItem.name === 'select_bottles' && shoppingItem.value !== ""){
            anzBottles = shoppingItem.value;
        } else if (shoppingItem.name === 'checkbox_umbrella') {
            umbrella = 1;
        } else if (shoppingItem.name === 'checkbox_rope') {
            rope = 1;
        } else if (shoppingItem.name === 'checkbox_helmet') {
            helmet = 1;
        }
    }
    //now calculate if there are enough proCoins left
    let proCoins = player.getInventory({id: player.id + 'Money'});
    let gesamtKosten = (parseInt(anzBottles) * 1) + (rope * 3) + (umbrella * 3) + (helmet * 3);
    
    //Cost to high, player can not afford purchase
    if (gesamtKosten > proCoins.context.value) {
        return false;
    //everything ok, add inventories and move proCoins from the players wallet
    } else {
        let bottles = player.getInventory({id: player.id + 'Bottles'});
        let bottlesAfter = bottles.context.value + parseInt(anzBottles);
        player.set('bottles', bottlesAfter);
        if (umbrella == 1){
            player.set('umbrella', true);
        }
        if (rope == 1){
            player.set('rope', true);
        }
        if (helmet == 1){
            player.set('helmet', true);
        }

        let proCoinsAfter = proCoins.context.value - gesamtKosten;
        player.set('money', proCoinsAfter);
        return true;
    }
}
module.exports.checkAndChargeShopping = checkAndChargeShopping;

/**
 * Adds or removes in dependency of waypoint items to the players inventory
 * @param {ProManGameWaypoint} wp 
 * @param {ProManGamePlayer} player 
 */
function addOrRemoveInventory(wp, player) {
    let playerBackToStartWp = false;
    //REMOVE WATER
    if (wp.template instanceof ProManGameTemplates.WAYPOINT_WATER) {    
        //On certain Waypoints the player has to pay extra Water 
        let noBottlesLeft;
        if (wp.extraWater) {
            noBottlesLeft = waterAdd(player, -2); 
        } else {
            noBottlesLeft = waterAdd(player, - 1);
        }
        //Check water stock, if there is no water left, go back to start
        if (noBottlesLeft) {
            playerBackToStartWp = true;
        }
    //ADD PROCOINS
    } else if (wp.template instanceof ProManGameTemplates.WAYPOINT_ADD_COINS ||
                wp.template instanceof ProManGameTemplates.WAYPOINT_ADD_EXTRA_COINS) {     
        //Add 3 ProCoins
        if (wp.template instanceof ProManGameTemplates.WAYPOINT_ADD_COINS) {
            proCoinsAdd(player, 3);      
        //Add 10 ProCoins
        } else {
            proCoinsAdd(player, 10);
        }    
    //REMOVE PROCOINS - only if player is agil and the Waypoint is a Entscheidungspunkt
    } else if (wp.template instanceof CustomTemplates.WAYPOINT_GOLD &&
                player.agil) {
        proCoinsAdd(player, -1);
    //ADD OR REMOVE PROCOINS - only if the player is agil and the waypoint is a Retrospektive-Punkt
    } else if (wp.template instanceof ProManGameTemplates.WAYPOINT_RETROSPECTIVE &&
                player.agil) {
        console.log("ProCoins Retrospektive");
    //set Flag, if player has reached the peak "Hoher Alpstein", otherwise he cannot win
    } else if (wp.template instanceof ProManGameTemplates.WAYPOINT_STOP) {
        player.hoherAlpsteinPassed = true;
    }

    return playerBackToStartWp;
}
module.exports.addOrRemoveInventory = addOrRemoveInventory;

/**
 * Adds or removes ProCoins to the inventory of the delivered player
 * if anzProCoins is positive number = add ProCoins
 * if anzProCoins is negative number = remove ProCoins
 * @param {ProManGamePlayer} player 
 * @param {int} anzProCoins 
 */
function proCoinsAdd(player, anzProCoins) {
    let proCoins = player.getInventory({id: player.id + 'Money'});
    let proCoinsAfter = proCoins.context.value;
    console.log("ProCoins zuvor: " + proCoinsAfter);
    proCoinsAfter = proCoins.context.value + anzProCoins;
    player.set('money', proCoinsAfter);
    console.log("ProCoins danach: " + proCoinsAfter);
}
module.exports.proCoinsAdd = proCoinsAdd;

/**
 * Adds or removes WaterBottles to the inventory of the delivered player
 * if anzWater is positive number = add WaterBottles
 * if anzWater is negative number = remove WaterBottles
 * Furthermore the function checks if the player has enough water bottles left 
 * and returns this result as boolean
 * @param {ProManGamePlayer} player 
 * @param {int} anzWater 
 * @returns boolean
 */
function waterAdd(player, anzWater) {
    let bottles = player.getInventory({id: player.id + 'Bottles'});
    let bottlesAfter = bottles.context.value;
    console.log("Wasser zuvor: " + bottlesAfter);
    bottlesAfter = bottles.context.value + anzWater;     
    player.set('bottles', bottlesAfter);
    console.log("Wasser danach: " + bottlesAfter);

    //no Water left?
    if (bottlesAfter > 0) {
        return false;
    //Water left
    } else {
        return true;
    }
}
module.exports.waterAdd = waterAdd;

/**
 * Returns the waypoint of the current active player
 * @param {GameController} controller 
 * @param {String} player1_Id 
 * @returns {ProManGameWaypoint} waypoint
 */
function getActivePlayerWaypoint(controller, player1_Id) {
    let player = controller.activePlayer;
    let waypoint;
    if (player.id.valueOf() === player1_Id.valueOf()){
        waypoint = controller.items.playerToken1.waypoint;
    } else {
        waypoint = controller.items.playerToken2.waypoint;
    }
    return waypoint;
}
module.exports.getActivePlayerWaypoint = getActivePlayerWaypoint;

/**
* Determine which Waypoints are reachable from a root Waypoint with a give number of moves
* @param {Waypoint} root - the starting Waypoint
* @param {number} depth - number of moves
* @param {ProManGamePlayer} player - to determine if the player is agile and has ClimbingEquipement
*/
function getProManGameWaypointsAtRange(root, depth, player) {
    let currDepth = 0;
    let unvisitedChilds = {};
    let visited = new Set();
    let currWp = root;
    let tempWp;
    let currPath = [root];
    let res = new Set();
    let proManGameSpecial = false;
    let equipement = hasPlayerClimbingEquipement(player);

    while (currDepth>=0) {
        visited.add(currWp.id);
        if (unvisitedChilds[currWp.id] instanceof Array) {
            if(currDepth === depth || proManGameSpecial) {
                //Waypoint darf nur ins Ergebnis eingefügt werden, wenn
                //player = agil + player hat Bergsteigerausrüstung + Kletter-Waypoint(= Eigenschaft extraWater) ODER
                //player = agil + kein Kletter-Waypoint ODER
                //player = wasserfall und kein agiler Waypoint
                if ((player.agil && equipement && currWp.extraWater) ||
                    (player.agil && currWp.extraWater === false) || 
                    (player.agil === false  && (currWp.agil === false))) {
                    res.add(currWp);  // add wp to result
                }
            }
            if (currDepth === depth || 
                    proManGameSpecial ||
                    currWp.next === [] || 
                    unvisitedChilds[currWp.id].length === 0) {     
                tempWp = currPath.pop(); // back-track
                if( tempWp === currWp) {
                    continue;
                }
                if(!tempWp) {
                    break;
                }
                currWp = tempWp;
                currDepth--;
                proManGameSpecial = false;
            } else {
                tempWp = unvisitedChilds[currWp.id].pop();
                if(!tempWp || visited.has(tempWp.id)) {
                    continue;
                }
                currWp = tempWp;
                //Die agilen muessen an den Waypoints GOLD anhalten
                //bei den anderen vieren müssen alle anhalten
                if ((player.agil && (currWp.template instanceof CustomTemplates.WAYPOINT_GOLD)) || 
                        currWp.template instanceof ProManGameTemplates.WAYPOINT_ADD_COINS ||
                        currWp.template instanceof ProManGameTemplates.WAYPOINT_ADD_EXTRA_COINS ||
                        currWp.template instanceof ProManGameTemplates.WAYPOINT_STOP ||
                        currWp.template instanceof CustomTemplates.WAYPOINT_GREEN) {
                    proManGameSpecial = true;
                }
                currDepth++;
            }
        } else {
            unvisitedChilds[currWp.id] = currWp.next.slice();
            continue;
        }
        // add node to the current path
        currPath.push(currWp);
    }
    return res;
}
module.exports.getProManGameWaypointsAtRange = getProManGameWaypointsAtRange;

function hasPlayerClimbingEquipement(player) {
    let rope = player.getInventory({id: player.id + 'Rope'});
    let helmet = player.getInventory({id: player.id + 'Helmet'});
    if (rope.context.value && helmet.context.value) {
        return true;
    } else {
        return false;
    }
}
module.exports.hasPlayerClimbingEquipement = hasPlayerClimbingEquipement;
