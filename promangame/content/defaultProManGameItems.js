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
  * Default-Componentes for ProManGame (Gipfeleroberer)
  * Default-Components are used, when no JSON configuration path was commited 
  * or the JSON configuration files for the individual componentes are not found
  * werden
  */
const Lib = require('../../lib/FragoleLib.js');
const Question = require('../../objects/Prompt.js').Question;
const CustomTemplates = require('../../content/custom_templates.js');

const ProManGameWaypoint = require('../objects/ProManGameWaypoint.js').ProManGameWaypoint;
const ProManGameRisk = require('../objects/ProManGameRisk.js').ProManGameRisk;
const ProManGameQuestion = require('../objects/ProManGameQuestion.js').ProManGameQuestion;
const ProManGameTemplates = require('./promangame_templates.js');

// Waypoints
let defaultWaypoints = {
    //NORMALWEG
    wpStartZiel:    new ProManGameWaypoint('wpStartZiel', 'path1', 177, 450, false, true, false, false, CustomTemplates.WAYPOINT_GREEN),
    wp2:            new ProManGameWaypoint('wp2', 'path1', 151, 364, false, false, false, false, ProManGameTemplates.WAYPOINT_NORMAL),
    wp3:            new ProManGameWaypoint('wp3', 'path1', 198, 311, false, false, false, false, ProManGameTemplates.WAYPOINT_NORMAL),
    wp4:            new ProManGameWaypoint('wp4', 'path1', 201, 254, false, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wpSplit5:       new ProManGameWaypoint('wpSplit5', 'path1', 218, 212, false, false, false, false, CustomTemplates.WAYPOINT_GOLD),
    wp6:            new ProManGameWaypoint('wp6', 'path1', 239, 151, false, false, false, false, ProManGameTemplates.WAYPOINT_NORMAL),
    wp7:            new ProManGameWaypoint('wp7', 'path1', 269, 102, false, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wp8:            new ProManGameWaypoint('wp8', 'path1', 341, 74, false, false, false, false, ProManGameTemplates.WAYPOINT_NORMAL),
    wpSplit9:       new ProManGameWaypoint('wpSplit9', 'path1', 398, 76, false, false, false, false, CustomTemplates.WAYPOINT_GOLD),
    wp10:           new ProManGameWaypoint('wp10', 'path1', 471, 81, false, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wp11:           new ProManGameWaypoint('wp11', 'path1', 540, 74, false, false, false, false, ProManGameTemplates.WAYPOINT_RISK),
    wp12:           new ProManGameWaypoint('wp12', 'path1', 605, 68, false, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wpShopWater13:  new ProManGameWaypoint('wpShopWater13', 'path1', 681, 106, false, false, false, true, ProManGameTemplates.WAYPOINT_ADD_COINS),
    wpSplit14:      new ProManGameWaypoint('wpSplit14', 'path1', 765, 77, false, false, false, false, CustomTemplates.WAYPOINT_GOLD),
    wp15:           new ProManGameWaypoint('wp15', 'path1', 803, 164, false, false, false, false, ProManGameTemplates.WAYPOINT_RISK),
    wp16:           new ProManGameWaypoint('wp16', 'path1', 858, 221, false, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wp17:           new ProManGameWaypoint('wp17', 'path1', 927, 253, false, false, false, false, ProManGameTemplates.WAYPOINT_NORMAL),
    wpShopWater18:  new ProManGameWaypoint('wpShopWater18', 'path1', 1006, 250, false, false, false, true, ProManGameTemplates.WAYPOINT_ADD_COINS),
    wp19:           new ProManGameWaypoint('wp19', 'path1', 995, 332, false, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wp20:           new ProManGameWaypoint('wp20', 'path1', 963, 400, false, false, false, false, ProManGameTemplates.WAYPOINT_TASK),
    wp21:           new ProManGameWaypoint('wp21', 'path1', 995, 487, false, false, false, false, ProManGameTemplates.WAYPOINT_RISK),
    wpShopWater22:  new ProManGameWaypoint('wpShopWater23', 'path1', 952, 574, false, false, false, true, ProManGameTemplates.WAYPOINT_ADD_COINS),
    wp23:           new ProManGameWaypoint('wp23', 'path1', 930, 679, false, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wp24:           new ProManGameWaypoint('wp24', 'path1', 870, 679, false, false, false, false, ProManGameTemplates.WAYPOINT_NORMAL),
    wp25:           new ProManGameWaypoint('wp25', 'path1', 842, 769, false, false, false, false, ProManGameTemplates.WAYPOINT_RISK),
    wp26:           new ProManGameWaypoint('wp26', 'path1', 770, 769, false, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wpStop:         new ProManGameWaypoint('wpStop', 'path1', 695, 744, false, false, false, false, ProManGameTemplates.WAYPOINT_STOP),
    wp28:           new ProManGameWaypoint('wp28', 'path1', 570, 741, false, false, false, false, ProManGameTemplates.WAYPOINT_TASK),
    wp29:           new ProManGameWaypoint('wp29', 'path1', 476, 752, false, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wp30:           new ProManGameWaypoint('wp30', 'path1', 375, 748, false, false, false, false, ProManGameTemplates.WAYPOINT_ADD_COINS),
    wp31:           new ProManGameWaypoint('wp31', 'path1', 292, 729, false, false, false, false, ProManGameTemplates.WAYPOINT_RISK),
    wp32:           new ProManGameWaypoint('wp32', 'path1', 225, 718, false, false, false, false, ProManGameTemplates.WAYPOINT_NORMAL),
    wp33:           new ProManGameWaypoint('wp33', 'path1', 136, 724, false, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wp34:           new ProManGameWaypoint('wp34', 'path1', 133, 637, false, false, false, false, ProManGameTemplates.WAYPOINT_RETROSPECTIVE),
    wp35:           new ProManGameWaypoint('wp35', 'path1', 135, 552, false, false, false, false, ProManGameTemplates.WAYPOINT_RISK),
    wp36:           new ProManGameWaypoint('wp36', 'path1', 178, 509, false, false, false, false, ProManGameTemplates.WAYPOINT_WATER),

    //HOELLENSTEIG
    wp37: new ProManGameWaypoint('wp37', 'path2', 285, 197, true, false, true, false, ProManGameTemplates.WAYPOINT_NORMAL),
    wp38: new ProManGameWaypoint('wp38', 'path2', 317, 243, true, false, true, false, ProManGameTemplates.WAYPOINT_WATER),
    wp39: new ProManGameWaypoint('wp39', 'path2', 328, 290, true, false, true, false, ProManGameTemplates.WAYPOINT_RISK),
    wp40: new ProManGameWaypoint('wp40', 'path2', 381, 314, true, false, true, false, ProManGameTemplates.WAYPOINT_NORMAL),
    wp41: new ProManGameWaypoint('wp41', 'path2', 412, 373, true, false, true, false, ProManGameTemplates.WAYPOINT_ADD_COINS),
    wp42: new ProManGameWaypoint('wp42', 'path2', 476, 419, true, false, true, false, ProManGameTemplates.WAYPOINT_WATER),
    wp43: new ProManGameWaypoint('wp43', 'path2', 496, 465, true, false, true, false, ProManGameTemplates.WAYPOINT_RISK),
    wp44: new ProManGameWaypoint('wp44', 'path2', 489, 517, true, false, true, false, ProManGameTemplates.WAYPOINT_WATER),
    wp45: new ProManGameWaypoint('wp45', 'path2', 513, 569, true, false, true, false, ProManGameTemplates.WAYPOINT_RISK),
    wp46: new ProManGameWaypoint('wp46', 'path2', 554, 609, true, false, true, false, ProManGameTemplates.WAYPOINT_WATER),
    wp47: new ProManGameWaypoint('wp47', 'path2', 595, 658, true, false, true, false, ProManGameTemplates.WAYPOINT_RISK),
    wp48: new ProManGameWaypoint('wp48', 'path2', 638, 696, true, false, true, false, ProManGameTemplates.WAYPOINT_WATER),

    //FERNBLICKWEG
    wp49: new ProManGameWaypoint('wp49', 'path3', 861, 83, false, false, false, false, ProManGameTemplates.WAYPOINT_RISK),
    wp50: new ProManGameWaypoint('wp50', 'path3', 950, 64, false, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wp51: new ProManGameWaypoint('wp51', 'path3', 1031, 65, false, false, false, false, ProManGameTemplates.WAYPOINT_ADD_EXTRA_COINS),
    wp52: new ProManGameWaypoint('wp52', 'path3', 1064, 125, false, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wp53: new ProManGameWaypoint('wp53', 'path3', 1011, 176, false, false, false, false, ProManGameTemplates.WAYPOINT_RISK),

    //WASSERFALLSTEIG
    wp54:       new ProManGameWaypoint('wp54', 'path4', 434, 165, true, false, true, false, ProManGameTemplates.WAYPOINT_WATER),
    wp55:       new ProManGameWaypoint('wp55', 'path4', 495, 206, true, false, true, false, ProManGameTemplates.WAYPOINT_NORMAL),
    wp56:       new ProManGameWaypoint('wp56', 'path4', 578, 221, true, false, true, false, ProManGameTemplates.WAYPOINT_RISK),
    wpSplit57:  new ProManGameWaypoint('wpSplit57', 'path4', 687, 259, true, false, true, false, CustomTemplates.WAYPOINT_GOLD),
    wp58:       new ProManGameWaypoint('wp58', 'path4', 667, 337, true, false, true, false, ProManGameTemplates.WAYPOINT_WATER),
    wp59:       new ProManGameWaypoint('wp59', 'path4', 660, 402, true, false, true, false, ProManGameTemplates.WAYPOINT_RISK),
    wp60:       new ProManGameWaypoint('wp60', 'path4', 711, 460, true, false, true, false, ProManGameTemplates.WAYPOINT_WATER),
    wpSplit61:  new ProManGameWaypoint('wpSplit61', 'path4', 730, 512, true, false, true, false, CustomTemplates.WAYPOINT_GOLD),
    wp62:       new ProManGameWaypoint('wp62', 'path4', 717, 560, true, false, true, false, ProManGameTemplates.WAYPOINT_RISK),
    wp63:       new ProManGameWaypoint('wp63', 'path4', 729, 626, true, false, true, false, ProManGameTemplates.WAYPOINT_WATER),
    wp64:       new ProManGameWaypoint('wp64', 'path4', 732, 687, true, false, true, false, ProManGameTemplates.WAYPOINT_NORMAL),

    //PANORAMAWEG
    wp65:       new ProManGameWaypoint('wp65', 'path5', 733, 233, true, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wp66:       new ProManGameWaypoint('wp66', 'path5', 789, 252, true, false, false, false, ProManGameTemplates.WAYPOINT_NORMAL),
    wp67:       new ProManGameWaypoint('wp67', 'path5', 829, 279, true, false, false, false, ProManGameTemplates.WAYPOINT_RISK),
    wp68:       new ProManGameWaypoint('wp68', 'path5', 880, 298, true, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
    wp69:       new ProManGameWaypoint('wp69', 'path5', 946, 289, true, false, false, false, ProManGameTemplates.WAYPOINT_NORMAL),

    //GEMSENWEG
    wp70:       new ProManGameWaypoint('wp70', 'path6', 813, 493, true, false, false, false, ProManGameTemplates.WAYPOINT_NORMAL),
    wp71:       new ProManGameWaypoint('wp71', 'path6', 875, 531, true, false, false, false, ProManGameTemplates.WAYPOINT_WATER),
};

//Risko-Karten
let defaultRisks = {
    risk1: new ProManGameRisk('risk1', 'Risiko',
        '<p>Einmal aussetzen</p>',
        '',
        {
            // eslint-disable-next-line quote-props
            'OK':{action:'skip', value:1},
        }),
    risk2: new ProManGameRisk('risk2', 'Risiko',
        '<p>Die Gruppe findet eine Abkürzung. 2 Felder vor.</p>',
        '',
        {
            // eslint-disable-next-line quote-props
            'OK':{action:'forward', value:2},
        }),
    risk3: new ProManGameRisk('risk3', 'Risiko',
        '<p>Sie haben Ihren Geldbeutel liegen lassen: 3 Felder zurück</p>',
        '',
        {
            // eslint-disable-next-line quote-props
            'OK':{action:'backward', value:3},
        }), 
    risk4: new ProManGameRisk('risk4', 'Risiko',
        '<p>Sie finden eine Wasserflasche</p>',
        '',
        {
            // eslint-disable-next-line quote-props
            'OK':{action:'water', value:1},
        }), 
    risk5: new ProManGameRisk('risk5', 'Risiko',
        '<p>Sie machen eine Pause und bekommen dafür 2 ProCoins.</p>',
        '',
        {
            // eslint-disable-next-line quote-props
            'OK':{action:'proCoins', value:2},
        }), 
    risk6: new ProManGameRisk('risk6', 'Risiko',
        '<p>Es fängt an zu regnen, wenn Sie keinen Regenschirm mitgenommen haben<br>müssen Sie eine Runde aussetzen.</p>',
        '',
        {
            // eslint-disable-next-line quote-props
            'OK':{action:'noUmbrella', value:1},
        }), 
    risk7: new ProManGameRisk('risk7', 'Risiko',
        '<p>Ein Steinschlag hält ihre Risikogruppe auf.<br>Wenn Sie keinen Helm mitgenommen haben<br>müssen Sie zwei Runden aussetzen.</p>',
        '',
        {
            // eslint-disable-next-line quote-props
            'OK':{action:'noHelmet', value:2},
        }), 
    risk8: new ProManGameRisk('risk8', 'Risiko',
        '<p>Eine steile Felswand behindert ihr Vorwärtskommen.<br>Wenn sie kein Seil mitgenommen haben<br>müssen Sie drei Runden aussetzen.</p>',
        '',
        {
            // eslint-disable-next-line quote-props
            'OK':{action:'noRope', value:3},
        }),
    risk9: new ProManGameRisk('risk9', 'Risiko',
        '<p>Sie haben ihren Rucksack im Auto liegen lassen.<br>Sie müssen zurück zum Start.</p>',
        '',
        {
            // eslint-disable-next-line quote-props
            'OK':{action:'backToStart', value:0},
        }),
    risk10: new ProManGameRisk('risk10', 'Risiko',
        '<p>Die Hütte ist in Sicht: 1 Feld vorwärts</p>',
        '',
        {
            // eslint-disable-next-line quote-props
            'OK':{action:'forward', value:1},
        }),   
};

//Frage-Karten
let defaultQuestions = {
    question1: new ProManGameQuestion('question1', 'Frage',
        '<p>Welche Grunddatentypen kennen Sie?</p><p>Wert: 4</p>',
        '',
        {
            'Integer, Float, Char, Boolean':{correct:true, value:4},
            'Array, List, Set':{correct:false, value:0},
        }, 'Test'),
    question2: new ProManGameQuestion('question2', 'Frage',
        '<p>Nennen Sie fünf verschiedene Bestandteile der Peripherie eines Computers?</p><p>Wert: 2</p>',
        '',
        {
            'Tastatur, Maus, USB-Stick, Drucker, Mikrophon':{correct:false, value:0},
            'Tastatur, Maus, Lautsprecher, Drucker, Mikrophon':{correct:true, value:2},
            'Tastatur, Maus, Lautsprecher, Mikrophon, externe Festplatte':{correct:false, value:0},
        }, 'Test'),
    question3: new ProManGameQuestion('question3', 'Frage',
        '<p>Was bedeutet ASCII?</p<p>Wert: 3</p>',
        '',
        {
            'American Standard for Coded Intelligence Interchange':{correct:false, value:0},
            'American Standard for Coded Information Intelligence':{correct:false, value:0},
            'American Standard for Coded Information Interchange':{correct:true, value:3},
        }, 'Test'),
};

let defaultTasks = {
    task1: new Question('task1', 'Aufgabe',
        '<p>Wie sieht die binäre Zahl 101110 in der Hexadezimalen-Schreibweise aus?</p>',
        '',
        {
            // eslint-disable-next-line quote-props
            'B2':{correct:false, value:0},
            // eslint-disable-next-line quote-props
            '2E':{correct:true, value:1},
            // eslint-disable-next-line quote-props
            '1F':{correct:false, value:0},
        }),
    task2: new Question('task2', 'Aufgabe',
        '<p>Wie schreibt man die dezimale Zahl 144 im oktaler Schreibweise?</p>',
        '',
        {
            // eslint-disable-next-line quote-props
            '120':{correct:false, value:0},
            // eslint-disable-next-line quote-props
            '432':{correct:false, value:0},
            // eslint-disable-next-line quote-props
            '220':{correct:true, value:1},
        }),
};

let defaultRetros = {
    retro1: new Question('retro1', 'Retrospektive',
        '<p>An welchem Wegpunkt muss eine agile Gruppe einen ProCoin für Beratungsaufwand abgeben?</p>',
        '',
        {
            'Gelber Wegpunkt':{correct:true, value:1},
            'Hellblauer Wegpunkt':{correct:true, value:0},
            'Grüner Wegpunkt':{correct:false, value:0},
        }),
    retro2: new Question('retro2', 'Retrospektive',
        '<p>Welchen Wegpunkt müssen alle Gruppen zwingend passieren?</p>',
        '',
        {
            'Alpsteinhütte (Weiß)':{correct:false, value:0},
            'Gipfel Hoher Alpstein (Dunkelrot)':{correct:true, value:1},
            'Fernblickweg Zum Großen Weißer (Weiß)':{correct:false, value:0},
        }),
};

function defaultConnectWaypoints(wps) {
    let paths = {};

    for (let k in wps) {
        let wp= wps[k];
        if (paths[wp.category] instanceof Array) {
            paths[wp.category].push(wp);
        } else {
            paths[wp.category]=[wp];
        }
    }
    Lib.connectWaypoints(paths['path1'], true);
    Lib.connectWaypoints(paths['path2'], true);
    Lib.connectWaypoints(paths['path3'], true);
    Lib.connectWaypoints(paths['path4'], true);
    Lib.connectWaypoints(paths['path5'], true);
    Lib.connectWaypoints(paths['path6'], true);

    //connect paths
    //Normalweg Rundlauf
    Lib.connectWaypoints([wps.wp36, wps.wpStartZiel], true);

    //Connect Hoellensteig with Normalweg
    Lib.connectWaypoints([wps.wpSplit5, wps.wp37], true);
    Lib.connectWaypoints([wps.wp48, wps.wpStop], true);

    //Connect Fernblickweg with Normalweg
    Lib.connectWaypoints([wps.wpSplit14, wps.wp49], true);
    Lib.connectWaypoints([wps.wp53, wps.wpShopWater18], true);

    //Connect Wasserfallsteig with Normalweg
    Lib.connectWaypoints([wps.wpSplit9, wps.wp54], true);
    Lib.connectWaypoints([wps.wp64, wps.wpStop], true);

    //Connect Panoramaweg with Wasserfallsteig and Normalweg
    Lib.connectWaypoints([wps.wpSplit57, wps.wp65], true);
    Lib.connectWaypoints([wps.wp69, wps.wpShopWater18], true);

    //Connect Gemsenweg with Wasserfallsteig and Normalweg
    Lib.connectWaypoints([wps.wpSplit61, wps.wp70], true);
    Lib.connectWaypoints([wps.wp71, wps.wpShopWater22], true);
}

module.exports = {
    defaultWaypoints: defaultWaypoints,
    defaultConnectWaypoints: defaultConnectWaypoints,
    defaultRisks: defaultRisks,
    defaultQuestions: defaultQuestions,
    defaultTasks: defaultTasks,
    defaultRetros: defaultRetros,
};