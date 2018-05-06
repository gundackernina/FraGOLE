/**
 * @Author: Nina Gundacker
 * @Date:   2017-06-04T10:48:10+02:00
 * @Email:  nina.gundacker@nefkom.net
 * @Project: Fragole - FrAmework for Gamified Online Learning Environments
 * @Last modified by:   Michael Bauer
 * @Last modified time: 2017-09-03T14:40:20+02:00
 * @License: MIT
 * @Copyright: Nina Gundacker
 */
const FragoleServer = require('./lib/FragoleServer.js');
const Lib = require('./lib/FragoleLib.js');
const {Game, GameController, GameState, Player, PlayerToken, Collection,
       Waypoint, Dice, Statistic, PlayerStatistic, Rating, PlayerRating,
       Progress, PlayerProgress, Prompt, Question, Card, CardStack, CardHand,
       Button, Form} = require('./objects/FragoleObjects.js');
const Lobby = require('./lib/FragoleLobby.js');
const Templates = require('./lib/FragoleTemplates.js');
const CustomTemplates = require('./content/custom_templates.js');

const ProManGameWaypoint = require('./promangame/objects/ProManGameWaypoint.js').ProManGameWaypoint;
const ProManGameRisk = require('./promangame/objects/ProManGameRisk.js').ProManGameRisk;
const ProManGameStack = require('./promangame/objects/ProManGameStack.js').ProManGameStack;
const ProManGameQuestion = require('./promangame/objects/ProManGameQuestion.js').ProManGameQuestion;
const ProManGameQuestionStack = require('./promangame/objects/ProManGameQuestion.js').ProManGameQuestionStack;
const ProManGamePlayer = require('./promangame/objects/ProManGamePlayer.js').ProManGamePlayer;
const proManGameItems = require('./promangame/content/proManGameItems.js');
const ProManGameTemplates = require('./promangame/content/promangame_templates.js');
const ProManGameLib = require('./promangame/lib/ProManGameLib.js');

const player1_Id = 'Player1';
const player2_Id = 'Player2'; 

let server = new FragoleServer.Server();
let sessions = FragoleServer.sessions;

let onePlayerFinished = false;

// ****************************************************************************
// Game definition
let game = new Game();
let controller = new GameController('game_controller1', 1, server);

game.setName('Gipfeleroberer')
    .addController(controller);
server.setGame(game);
//Port mal auf die 81 legen, damit man zwei Instanzen laufen lassen kann
server.start(81);

// STATES
let STATE_INIT = new GameState('STATE_INIT');
let STATE_SHOPPING = new GameState('STATE_SHOPPING');
let STATE_KNOWLEDGE = new GameState('STATE_KNOWLEDGE');
let STATE_RISK = new GameState('STATE_RISK');
let STATE_TASK = new GameState('STATE_TASK');
let STATE_RETROSPECTIVE = new GameState('STATE_RETROSPECTIVE');
let STATE_FINISH = new GameState('STATE_FINISH');
let STATE_SELECT_WAYPOINT = new GameState('STATE_SELECT_WAYPOINT');
let STATE_NEXT_PLAYER = new GameState('STATE_NEXT_PLAYER');
let STATE_BACK_TO_START = new GameState('STATE_BACK_TO_START');
let STATE_CHOOSE_ACTION = new GameState('STATE_CHOOSE_ACTION');


//Der erste Player ist agil, der zweite nicht
let players = {player1: new ProManGamePlayer(player1_Id, true),
    player2: new ProManGamePlayer(player2_Id, false),
};

let tokens = {playerToken1: new PlayerToken('PlayerToken1', 'playertokens', 177, 450),
    playerToken2: new PlayerToken('PlayerToken2', 'playertokens', 151, 364),
};

let stats = {
    player1Stat: new PlayerStatistic('Player1Stat', 'STATISTIK', 0, 'line chart'),
    player2Stat: new PlayerStatistic('Player2Stat', 'STATISTIK', 0, 'line chart'),
};

let equipment = {
    player1Money: new PlayerStatistic('Player1Money', 'PRO COINS', 30, 'euro sign'),
    player2Money: new PlayerStatistic('Player2Money', 'PRO COINS', 20, 'euro sign'),
    player1Bottles: new PlayerStatistic('Player1Bottles', 'WASSERFLASCHEN', 0, 'tint'),
    player2Bottles: new PlayerStatistic('Player2Bottles', 'WASSERFLASCHEN', 0, 'tint'),
    player1Umbrella: new PlayerStatistic('Player1Umbrella', 'REGENSCHIRM', false, 'umbrella'),
    player2Umbrella: new PlayerStatistic('Player2Umbrella', 'REGENSCHIRM', false, 'umbrella'),
    player1Helmet: new PlayerStatistic('Player1Helmet', 'HELM', false, 'chess queen'),
    player2Helmet: new PlayerStatistic('Player2Helmet', 'HELM', false, 'chess queen'),
    player1Rope: new PlayerStatistic('Player1Rope', 'SEIL', false, 'linkify'),
    player2Rope: new PlayerStatistic('Player2Rope', 'SEIL', false, 'linkify'),
}

let buttons = {
    btnWissenskarte : new Button('btnKnowledge', 10, 10, 'Wissenskarte ziehen und beantworten', 'green'),
    btnRisikokarte: new Button('btnRisk', 10, 50, 'Risikokarte ziehen', 'blue'),
    btnAufgabe: new Button('btnTask', 10, 90, 'Aufgabe erledigen', 'red'),
    btnRetro: new Button('btnRetro', 10, 130, 'Retrospektive durchführen', 'teal'),
    btnShopping: new Button('btnShopping', 10, 170, 'Ausrüstung einkaufen', 'yellow'),
};

let prompts = {
    chooseAction : new Prompt('chooseAction', 'Du bist dran!',
        '<p>Du kannst eine von folgenden Aktionen ausführen:</p>',
        null,
        {
            'Einkaufen':{color:'teal', icon:'shopping cart'},
            'Spielzug beenden':{color:'green', icon:'check'},
            'Aussetzen':{color:'yellow', icon:'coffee'},
        }),
}

let stacks =  {
     proManGameRiskStack: new ProManGameStack('riskStack'),
     proManGameQuestionStack: new ProManGameQuestionStack('questionStack'),
     proManGameTaskStack: new ProManGameStack('taskStack'),
     proManGameRetroStack: new ProManGameStack('retroStack'),
}

//Erst mal leer initialisieren, der String wird dann hineingesetzt
const shoppingForm = new Form('shoppingForm', 'Ausrüstung einkaufen', '');

// add (potential) players to the gameController
game.gameControllers[0].addPlayer(players.player1)
                       .addPlayer(players.player2);

let lobby = new Lobby(controller);


STATE_INIT.setHandlers({
    enter:  (src) => {
        let wps = proManGameItems.waypoints;
        let risks = proManGameItems.risks;
        let questions = proManGameItems.questions;
        let tasks = proManGameItems.tasks;
        let retros = proManGameItems.retros;
        stacks.proManGameRiskStack.addProManGameItems(risks);
        stacks.proManGameRiskStack.shuffle();
        stacks.proManGameQuestionStack.addProManGameItems(questions);
        stacks.proManGameQuestionStack.shuffle();
        stacks.proManGameTaskStack.addProManGameItems(tasks);
        stacks.proManGameTaskStack.shuffle();
        stacks.proManGameRetroStack.addProManGameItems(retros);
        stacks.proManGameRetroStack.shuffle();

        // init the controller with all items
        src.addItems(players);
        src.addItems(stats);
        src.addItems(equipment);
        src.addItems(tokens);
        src.addItems(wps);
        src.addItems(buttons);
        src.addItems(questions);
        src.addItems(risks);
        src.addItems(tasks);
        src.addItems(retros);
        src.addItems(stacks);
        src.addItems(prompts);
        src.addItems({shoppingForm});

        // init player inventories
        let items = src.items;
        //Statistik + Token
        items.player1.addInventoryEx([items.playerToken1, items.player1Stat]);
        items.player2.addInventoryEx([items.playerToken2, items.player2Stat]);
        //die Ausrüstung hinzufügen
        items.player1.addInventoryEx([items.player1Money, items.player1Bottles, items.player1Umbrella, items.player1Helmet, items.player1Rope]);
        items.player2.addInventoryEx([items.player2Money, items.player2Bottles, items.player2Umbrella, items.player2Helmet, items.player2Rope]);

        for (let p of src.joinedPlayers) {
            //Listener auf das jeweilige Inventory registrieren
            p.subscribe('stat', p.getInventory({id: p.id + 'Stat'}));
            //p.subscribe('prog', p.getInventory({id: p.id + 'Prog'}));
            p.subscribe('money', p.getInventory({id: p.id + 'Money'}));
            p.subscribe('bottles', p.getInventory({id: p.id + 'Bottles'}));
            p.subscribe('umbrella', p.getInventory({id: p.id + 'Umbrella'}));
            p.subscribe('helmet', p.getInventory({id: p.id + 'Helmet'}));
            p.subscribe('rope', p.getInventory({id: p.id + 'Rope'}));

            //Die Ausrüstung auf die entsprechenden Werte setzen
            //Da man zu Beginn erst mal Einkaufen gehen muss, sind nur die 
            //30 ProCoins vorhanden
            p.set('stat', 10);
            //p.set('prog', 50);
            p.set('money', 30);
            p.set('bottles', 0);    
            p.set('umbrella', false);
            p.set('helmet', false);
            p.set('rope', false);     
        }

        items.playerToken1.waypoint = items.wpStartZiel;
        items.playerToken2.waypoint = items.wpStartZiel;

        proManGameItems.connectWaypoints();
        
        for (let p of src.joinedPlayers) {
            console.log(p.name);
            p.session.setBackgroundImage('assets/background.jpg');
        };

        //alles zeichnen lassen
        src.setupBoard();

        //Alle Spieler fangen beim Shoppen an
        src.nextState(STATE_SHOPPING);
    },
});


STATE_SHOPPING.setHandlers({
    enter: () => {
        controller.items.btnShopping.activate();
        controller.items.btnAufgabe.deactivate();
        controller.items.btnRisikokarte.deactivate();
        controller.items.btnWissenskarte.deactivate();
        controller.items.btnRetro.deactivate();
    },

    click: (id, item, clientId) => {
        // get the player that clicked the button
        let controller = item.gameController;
        let player = controller.playersId[clientId];
        
        switch(id) {
            case 'btnShopping':
                controller.items.btnShopping.deactivate();
                let shopForm = controller.items.shoppingForm;
                shopForm.context.content = ProManGameLib.getShoppingFormString(player);
                shopForm.show(player);
                break;
            default:
                break;
        }
    },

    formPost: (id, data, form, clientId) => {
        let player = form.gameController.playersId[clientId];
        let failed = false;
        //der erste Array-Eintrag ist immer der Wasserflaschen Eintrag
        let shoppingItemWater = data[0];
        //Popup ausgeben, das man zu Beginn definitiv Wasser einkaufen muss
        if (shoppingItemWater.value == 0 && player.firstShoppingCall) {
            controller.sendPopup({
                header:'Auswahl anpassen',
                msg:'Zu Beginn muss zwingend Wasser gekauft werden.',
                icon:'warning circle',
                players:player, x:150, y:100, color:'red'});
            failed = true;             
        } else {
            let ok = ProManGameLib.checkAndChargeShopping(player, data);  
            //Popup ausgeben, dass man nicht mehr so viel Geld hat um alles zu kaufen
            if (!ok){
                controller.sendPopup({
                    header:'Auswahl anpassen',
                    msg:'Nicht genug ProCoins, um alles zu kaufen.',
                    icon:'warning circle',
                    players:player, x:150, y:100, color:'red'});
                failed = true;
            }
        }

        if (failed) {
            controller.nextState(STATE_SHOPPING);
        //Einkauf erfolgreich
        } else {
            player.firstShoppingCall = false;
            controller.nextState(STATE_NEXT_PLAYER);
        }

    },

    formCancel: (id, data, form, clientId) => {
        let player = form.gameController.playersId[clientId];
        //Wenn es für diesen Player der erste Aufruf war und er abbricht, 
        //Meldung ausgeben und sagen, dass er zumindest Wasser einkaufen muss
        if (player.firstShoppingCall) {
            controller.sendPopup({
                header:'Auswahl anpassen',
                msg:'Zu Beginn muss zwingend Wasser gekauft werden.',
                icon:'warning circle',
                players:player, x:150, y:100, color:'red'});
            controller.nextState(STATE_SHOPPING);
        //nicht der erste Aufruf, hier ist abbrechen erlaubt
        } else {
            controller.nextState(STATE_NEXT_PLAYER);
        }
        form.gameController.sendLog(player.name, {content:'hat die Formulareingabe abgebrochen', icon:'inverted red edit outline'});

    },

    exit: () => {
    }
});

STATE_KNOWLEDGE.setHandlers({
    enter: () => {
        //TODO: nur fuer bestimmten Player aktivieren
        controller.items.btnWissenskarte.activate();
        controller.items.btnRisikokarte.deactivate();
        controller.items.btnAufgabe.deactivate();
        controller.items.btnShopping.deactivate();
        controller.items.btnRetro.deactivate();
    },

    click: (id, item, clientId) => {
        // get the player that clicked the button
        let controller = item.gameController;
        let player = controller.playersId[clientId];
        
        switch(id) {
            case 'btnKnowledge':
                controller.items.btnWissenskarte.deactivate();
                let category = 'Test'
                let question = controller.items.proManGameQuestionStack.getProManGameQuestion(category);
                question.show(player);
                break;
            default:
                break;
        }
    },

    //Falsche Antwort
    questionWrong: (id, option, value, question, clientId) => {
        let player = question.gameController.playersId[clientId];
        question.showResult(player);
        controller.nextState(STATE_NEXT_PLAYER);
    },

    //Richtige Antwort
    questionCorrect: (id, option, value, question, clientId) => {
        let player = question.gameController.playersId[clientId];
        controller.set('roll_result', value);
        question.showResult(player);
        controller.nextState(STATE_SELECT_WAYPOINT);
    },
});

//Risikokarte ziehen
STATE_RISK.setHandlers({
    enter: () => {
        controller.items.btnRisikokarte.activate();
        controller.items.btnWissenskarte.deactivate();
        controller.items.btnAufgabe.deactivate();
        controller.items.btnShopping.deactivate();
        controller.items.btnRetro.deactivate();
    },

    click: (id, item, clientId) => {
        // get the player that clicked the button
        let controller = item.gameController;
        let player = controller.activePlayer;
        
        switch(id) {
            case 'btnRisk':
                controller.items.btnRisikokarte.deactivate();
                //zufaellig eine Karte holen
                let risk = controller.items.proManGameRiskStack.getProManGameStackItem();
                risk.show(player);
                break;
            default:
                break;
        }
    },

    //Normales Aussetzen
    skip: (id, option, value, risk, clientId) => {
        console.log("played skip card");
        let player = risk.gameController.playersId[clientId];
        player.skipTurns = value;
        controller.nextState(STATE_NEXT_PLAYER);
    },

    //Vorwärts oder Rückwärts ziehen
    forwardOrBackward: (id, option, value, risk, clientId) => {
        console.log("played forward/backward card");
        let player = risk.gameController.playersId[clientId];
        controller.set('roll_result', value);
        controller.nextState(STATE_SELECT_WAYPOINT);
    },

    //Wasser hergeben oder bekommen
    water: (id, option, value, risk, clientId) => {
        console.log("played water card");
        let player = risk.gameController.playersId[clientId];
        ProManGameLib.waterAdd(player, value);
        controller.nextState(STATE_NEXT_PLAYER);
    },
    
    //proCoins hergeben oder bekommen
    proCoins: (id, option, value, risk, clientId) => {
        console.log("played proCoins card");
        let player = risk.gameController.playersId[clientId];
        ProManGameLib.proCoinsAdd(player, value);
        controller.nextState(STATE_NEXT_PLAYER);
    },

    //entweder alles ok, oder aussetzen, weil Player keinen 
    //Regenschirm hat
    noUmbrella: (id, option, value, risk, clientId) => {
        console.log("played noUmbrella card");
        let player = risk.gameController.playersId[clientId];
        let umbrella = player.getInventory({id: player.id + 'Umbrella'});
        if (umbrella.context.value === false) {
            player.skipTurns = value;
        }
        controller.nextState(STATE_NEXT_PLAYER);
    },

    //entweder alles ok, oder aussetzen, weil Player kein 
    //Seil hat
    noRope: (id, option, value, risk, clientId) => {
        console.log("played noRope card");
        let player = risk.gameController.playersId[clientId];
        let rope = player.getInventory({id: player.id + 'Rope'});
        if (rope.context.value === false) {
            player.skipTurns = value;
        }
        controller.nextState(STATE_NEXT_PLAYER);
    },

    //entweder alles ok, oder aussetzen, weil Player keinen
    //Helm hat
    noRope: (id, option, value, risk, clientId) => {
        console.log("played noHelmet card");
        let player = risk.gameController.playersId[clientId];
        let helmet = player.getInventory({id: player.id + 'Helmet'});
        if (helmet.context.value === false) {
            player.skipTurns = value;
        }
        controller.nextState(STATE_NEXT_PLAYER);
    },

    //Zurueck zum Start
    backToStart: (id, option, value, risk, clientId) => {
        console.log("played backToStart card");
        controller.nextState(STATE_BACK_TO_START);
    },
});

//Eine Aufgabe erledigen
STATE_TASK.setHandlers({
    enter: () => {
        controller.items.btnAufgabe.activate();
        controller.items.btnWissenskarte.deactivate();
        controller.items.btnRisikokarte.deactivate();
        controller.items.btnShopping.deactivate();
        controller.items.btnRetro.deactivate();
    },

    click: (id, item, clientId) => {
        // get the player that clicked the button
        let controller = item.gameController;
        let player = controller.activePlayer;
        
        switch(id) {
            case 'btnTask':
                controller.items.btnAufgabe.deactivate();
                let task = controller.items.proManGameTaskStack.getProManGameStackItem();
                //TODO: Aufgabe beiden Playern anzeigen
                task.show(player);
                break;
            default:
                break;
        }
    },

    //Falsche Antwort
    questionWrong: (id, option, value, question, clientId) => {
        let player = question.gameController.playersId[clientId];
        question.showResult(player);
        //5 ProCoins abziehen
        ProManGameLib.proCoinsAdd(player, -5);
        controller.nextState(STATE_NEXT_PLAYER);
    },

    //Richtige Antwort
    questionCorrect: (id, option, value, question, clientId) => {
        let player = question.gameController.playersId[clientId];
        controller.set('roll_result', value);
        //10 ProCoins addieren
        question.showResult(player);
        ProManGameLib.proCoinsAdd(player, 10);
        controller.nextState(STATE_SELECT_WAYPOINT);
    },
});

//Eine Retrospektive durchführen
STATE_RETROSPECTIVE.setHandlers({
    enter: () => {
        controller.items.btnRetro.activate();
        controller.items.btnAufgabe.deactivate();
        controller.items.btnWissenskarte.deactivate();
        controller.items.btnRisikokarte.deactivate();
        controller.items.btnShopping.deactivate(); 
    },

    click: (id, item, clientId) => {
        // get the player that clicked the button
        let controller = item.gameController;
        let player = controller.activePlayer;
        
        switch(id) {
            case 'btnRetro':
                controller.items.btnRetro.deactivate();
                let retro = controller.items.proManGameRetroStack.getProManGameStackItem();
                retro.show(player);    
                break;
            default:
                break;
        }
    },

    //Falsche Antwort
    questionWrong: (id, option, value, question, clientId) => {
        let player = question.gameController.playersId[clientId];
        question.showResult(player);
        //5 ProCoins abziehen
        ProManGameLib.proCoinsAdd(player, -5);
        controller.nextState(STATE_NEXT_PLAYER);
    },

    //Richtige Antwort
    questionCorrect: (id, option, value, question, clientId) => {
        let player = question.gameController.playersId[clientId];
        controller.set('roll_result', value);
        question.showResult(player);
        //5 ProCoins addieren
        ProManGameLib.proCoinsAdd(player, 5);
        controller.nextState(STATE_SELECT_WAYPOINT);
    },
});

STATE_SELECT_WAYPOINT.setHandlers({
    enter: () => {
        let playToken = controller.activePlayer.getInventory({category:'playertokens'})[0];
        let valuePoints = controller.get('roll_result');
        let wps = ProManGameLib.getProManGameWaypointsAtRange(playToken.waypoint, valuePoints, 
                                                                controller.activePlayer);
        if (wps.size > 0) {
            controller.set('wps', wps);
            for (let wp of controller.get('wps')) {
                wp.activate(controller.activePlayer);
                wp.highlight(controller.activePlayer);
            }   
        }      
    },

    selectWaypoint: (id, item, clientId) => {
        controller.activePlayer.getInventory({category:'playertokens'})[0].moveToWaypoint(item);
        controller.sendLog(controller.activePlayer.name, {content:'zieht zu ' + item.id +'!', icon:'inverted yellow location arrow'});
        for (let wp of controller.get('wps'))  {
            wp.deactivate(controller.activePlayer);
            wp.unhighlight(controller.activePlayer);
        }
    },

     passWaypoint: (id, clientId, wp) => {
        console.log("Passiere einen Wegpunkt");
        let player = controller.activePlayer;
        let noMoreWaterLeft = ProManGameLib.addOrRemoveInventory(wp, player);
        controller.set('noMoreWater', noMoreWaterLeft);
     },

    enterWaypoint: (id, wp, item, clientId) => {
        //hier auf den naechsten State switchen
        item.gameController.sendLog(item.owner.name, {content:'erreicht ' + wp.id +'!', icon:'inverted yellow location arrow'});
        //Prüfen ob aktueller Spieler sich nun im Ziel befindet
        let currentWaypoint = ProManGameLib.getActivePlayerWaypoint(controller, player1_Id);
        //SPIEL BEENDET?
        if (currentWaypoint.template instanceof CustomTemplates.WAYPOINT_GREEN &&
            controller.activePlayer.hoherAlpsteinPassed){
            console.log("Spiel wird beendet");
            controller.nextState(STATE_FINISH);
        //SPIEL GEHT WEITER
        } else {
            //Inventory ggf. abziehen 
            let backToStart = ProManGameLib.addOrRemoveInventory(currentWaypoint, controller.activePlayer);
            //auch miteinbeziehen, ob unterwegs schon kein Wasser mehr verfügbar war
            let noMoreWater = controller.get('noMoreWater');
            //prüfen, ob der Spieler wieder zum Start zurück muss, weil er kein Wasser mehr hat
            if (backToStart || noMoreWater) {
                controller.set('noMoreWater', true);
                controller.nextState(STATE_BACK_TO_START);
            } else {
                //Wenn Player auf einem Shopping Punkt steht darf er einkaufen gehen
                //oder er ist agil, die dürfen immer
                if (currentWaypoint.shopping || controller.activePlayer.agil) {
                    controller.nextState(STATE_CHOOSE_ACTION);
                } else {
                    controller.nextState(STATE_NEXT_PLAYER);
                }
            }
        }    
    },

    exit: () => {
        //Aufraeumen
        controller.set('wps', null);
        controller.set('roll_result', null);
    }
});


STATE_NEXT_PLAYER.setHandlers({
    enter: () => {
        controller.nextPlayer();
        //falls der jetzige Player, das Spiel schon beendet hat, 
        //noch mal eins weiter schalten
        if (controller.activePlayer.finished){
            controller.nextPlayer();
        }
        currentWaypoint = ProManGameLib.getActivePlayerWaypoint(controller, player1_Id);
        let currentTemplate = currentWaypoint.template;
        //Risikopunkt => nächster State: RISK
        if (currentTemplate instanceof ProManGameTemplates.WAYPOINT_RISK) {
            controller.nextState(STATE_RISK);
        //Aufgabenpunkt => nächster State: TASK
        } else if (currentTemplate instanceof ProManGameTemplates.WAYPOINT_TASK) {
            controller.nextState(STATE_TASK);
        //Retropunkt + Spieler ist agil => nächster State: RETRO
        } else if (currentTemplate instanceof ProManGameTemplates.WAYPOINT_RETROSPECTIVE && 
                    controller.activePlayer.agil) {
            controller.nextState(STATE_RETROSPECTIVE);                    
        } else {
            controller.nextState(STATE_KNOWLEDGE);
        }

    }, 
});

//Ein Spieler erreicht das Ziel
STATE_FINISH.setHandlers({
    enter: () => {
        let player = controller.activePlayer;
        controller.sendPopup({
            header:'Popup',
            msg:'Ihr habt das Ziel erreicht!',
            icon:'info circle',
            players:player, x:150, y:100, color:'green'});
        //Es sind noch nicht alle Player im Ziel angekommen
        if (!onePlayerFinished) {
            PorManGameLib.proCoinsAdd(player, 15);
            player.finished = true;
            onePlayerFinshed = true;
            controller.nextState(STATE_NEXT_PLAYER);
        //Es sind alle im Ziel angekommen, Gewinner wird ermittelt
        } else {
            let proCoinsPlayer1 = controller.player1.getInventory({id: player1_Id + 'Money'});
            let proCoinsPlayer2 = controller.player2.getInventory({id: player2_Id + 'Money'});
            let message = "";
            if (proCoinsPlayer1.context.value > proCoinsPlayer2.context.value) {
                message = 'Player 1 gewinnt das Spiel!';
            } else if (proCoinsPlayer1.context.value == proCoinsPlayer2.context.value){
                message = 'Unentschieden!';
            } else {
                message = 'Player 2 gewinnt das Spiel!';
            }
            controller.sendPopup({
                header:'Popup',
                msg:message,
                icon:'info circle',
                players:controller.player1, x:150, y:100, color:'green'});
            controller.sendPopup({
                header:'Popup',
                msg:message,
                icon:'info circle',
                players:controller.player2, x:150, y:100, color:'green'});
        }
    }, 
});

//Player hat unterwegs kein Wasser mehr gehabt, er muss zum Start zurück
STATE_BACK_TO_START.setHandlers({
    enter: () => {
        let player = controller.activePlayer;
        let playerNoWater = controller.get('noMoreWater');
        //PopUp nur ausgeben, wenn dem Spieler tatsächlich das Wasser ausging
        //er kann nämlich auch per Risiko-Karte auf den Start gesetzt werden
        if (playerNoWater) {
            controller.sendPopup({
            header:'Kein Wasser mehr',
            msg:'Ihr habt kein Wasser mehr! Es geht zurück zum Start.',
            icon:'warning circle',
            players:player, x:150, y:100, color:'red'});
        }
        player.getInventory({category:'playertokens'})[0].moveToWaypoint(controller.items.wpStartZiel);
        controller.nextState(STATE_SHOPPING);     
    }, 

    exit: () => {
        //Aufraeumen
        controller.set('noMoreWater', null);
    }
});

//Player muss sich entscheiden, ob er Wasser nachkaufen will, aussetzen oder SpielzugBeenden
STATE_CHOOSE_ACTION.setHandlers({
    enter: () => {
        controller.items.chooseAction.show(controller.activePlayer);        
    }, 

    prompt(src, option, prompt) {
        switch(option) {
            case 'Einkaufen':
                controller.nextState(STATE_SHOPPING);
                break;
            case 'Spielzug beenden':    
                controller.nextState(STATE_NEXT_PLAYER);
                break;
            case 'Aussetzen':
                //Für freiwilliges Aussetzen gibt es drei ProCoins zusätzlich
                ProManGameLib.proCoinsAdd(controller.activePlayer, 3);
                controller.activePlayer.skipTurns = 1;
                controller.nextState(STATE_NEXT_PLAYER);
        default:
            break;
        }
    },
});

// *****************************************************************************
// Game-Lobby
controller.on( 'joinPlayer', (player) => { lobby.joinPlayer(player); } );

lobby.on('allPlayersReady', () => {
    lobby.quit();
    console.log('all players ready');
    controller.nextState(STATE_INIT);
});
