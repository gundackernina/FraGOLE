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

 /**
 * Gemeinsame Funktionalitäten für das ProManGame
 */
const ProManGameTemplates = require('../content/promangame_templates.js');
const CustomTemplates = require('../../content/custom_templates.js');

/**
 * Inhaltsstring für den Shopping-Dialog
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
 * Liefert je nach bereits vorhandener Ausrüstung den Inhalts-String für den 
 * Shopping-Dialog zurueck.
 * Hat der Player z.B. schon einen Regenschirm, kann die Checkbox deaktiviert bleiben
 * sonst muss sie aktiviert werden
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
 * Prüft und Berechnet die Einkäufe eines Players
 * Kauft der Player mehr ein, als er noch ProCoins übrig hat, werden keine 
 * Ausrüstungsgegenstände gut geschrieben.
 * Sind noch genügen ProCoins vorhanden, werden die Gegenstände seinem Inventory 
 * gut geschrieben und die entsprechenden ProCoins abgezogen
 * @param {ProManGamePlayer} player 
 * @param {Array} data 
 */
function checkAndChargeShopping(player, data) {
    let anzBottles = 0;
    let rope = 0;
    let helmet = 0;
    let umbrella = 0;
    //Bestandsaufnahme, was soll alles gekauft werden
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
    //jetzt berechnen, ob für alles noch genug Geld da ist
    let proCoins = player.getInventory({id: player.id + 'Money'});
    let gesamtKosten = (parseInt(anzBottles) * 1) + (rope * 3) + (umbrella * 3) + (helmet * 3);
    
    //Kosten zu hoch, Spieler kann sich Einkauf nicht leisten
    if (gesamtKosten > proCoins.context.value) {
        return false;
    //alles passt, Einkauf verbuchen und Geld entsprechend abziehen
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
 * Fügt je nach Waypoint für den übergebenen Spieler Vorräte hinzu
 * oder zieht diese ab
 * @param {ProManGameWaypoint} wp 
 * @param {ProManGamePlayer} player 
 */
function addOrRemoveInventory(wp, player) {
    let playerBackToStartWp = false;
    //WASSER ABZIEHEN
    if (wp.template instanceof ProManGameTemplates.WAYPOINT_WATER) {    
        //Bei bestimmten Wegpunkten kann der Wasserverbrauch höher sein
        let noBottlesLeft;
        if (wp.extraWater) {
            noBottlesLeft = waterAdd(player, -2); 
        } else {
            noBottlesLeft = waterAdd(player, - 1);
        }
        //Wasserprüfung durchführen, wenn kein Wasser mehr da, wieder zurück zum Anfang.
        if (noBottlesLeft) {
            playerBackToStartWp = true;
        }
    //PLUS PROCOINS
    } else if (wp.template instanceof ProManGameTemplates.WAYPOINT_ADD_COINS ||
                wp.template instanceof ProManGameTemplates.WAYPOINT_ADD_EXTRA_COINS) {     
        //Add 3 ProCoins
        if (wp.template instanceof ProManGameTemplates.WAYPOINT_ADD_COINS) {
            proCoinsAdd(player, 3);      
        //Add 10 ProCoins
        } else {
            proCoinsAdd(player, 10);
        }    
    //MINUS PROCOINS - nur bei agil
    } else if (wp.template instanceof CustomTemplates.WAYPOINT_GOLD &&
                player.agil) {
        proCoinsAdd(player, -1);
    //MINUS oder PLUS PROCOINS - nur bei agil und Retrospektive
    } else if (wp.template instanceof ProManGameTemplates.WAYPOINT_RETROSPECTIVE &&
                player.agil) {
        console.log("ProCoins Retrospektive");
    //Flag setzen, dass Player beim hohen Alpstein angekommen ist, vorher darf er nicht gewinnen
    } else if (wp.template instanceof ProManGameTemplates.WAYPOINT_STOP) {
        player.hoherAlpsteinPassed = true;
    }

    return playerBackToStartWp;
}
module.exports.addOrRemoveInventory = addOrRemoveInventory;

/**
 * Fügt ProCoins zum Vorrat des übergebenen Players hinzu oder zieht diese ab.
 * Wird anzProCoins als positiver Wert übergeben = Addition
 * Wird anzProCoins als negativer Wert übergeben = Subtraktion
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
 * Fügt Wasserflaschen zum Vorrat des übergebenen Players hinzu oder zieht diese ab.
 * Wird anzWater als positiver Wert übergeben = Addition
 * Wird anzWater als negativer Wert übergeben = Subtraktion
 * Prüft außerdem ob der Player überhaupt noch Wasserflaschen vorrätig hat und liefert
 * dieses Ergebnis als boolean Variable zurück
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

    //kein Wasser mehr vorrätig?
    if (bottlesAfter > 0) {
        return false;
    //noch Wasser vorrätig
    } else {
        return true;
    }
}
module.exports.waterAdd = waterAdd;

/**
 * Liefert den Waypoint zurück, auf dem der aktive Spieler gerade steht
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
                //HIER BEGINN
                //Die agilen muessen an den Waypoints GOLD anhalten
                //bei den anderen vieren müssen alle anhalten
                if ((player.agil && (currWp.template instanceof CustomTemplates.WAYPOINT_GOLD)) || 
                        currWp.template instanceof ProManGameTemplates.WAYPOINT_ADD_COINS ||
                        currWp.template instanceof ProManGameTemplates.WAYPOINT_ADD_EXTRA_COINS ||
                        currWp.template instanceof ProManGameTemplates.WAYPOINT_STOP ||
                        currWp.template instanceof CustomTemplates.WAYPOINT_GREEN) {
                    proManGameSpecial = true;
                }
                //HIER ENDE
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
