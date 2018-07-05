/**
 * @Author: Nina Gundacker
 * @Date:   2018-05-10T11:09:28+02:00
 * @Email:  nina.gundacker@nefkom.net
 * @Project: ProManGameWithFraGOLE
 * @Last modified by:   Nina Gundacker
 * @Last modified time: 2018-05-19T11:09:28+02:00
 * @License: MIT
 * @Copyright: Nina Gundacker
 */
const Question = require('../../objects/Prompt.js').Question;
const DefaultTemplates = require('../../lib/FragoleTemplates.js');
const Lib = require('../../lib/FragoleLib.js');
const ItemLib = require('../../lib/FragoleItemLib.js');

const ProManGameRisk = require('../objects/ProManGameRisk.js').ProManGameRisk;
const ProManGameQuestion = require('../objects/ProManGameQuestion.js').ProManGameQuestion;
const ProManGameWaypoint = require('../objects/ProManGameWaypoint.js').ProManGameWaypoint;
const defaultProManGameItems = require('../content/defaultProManGameItems.js');
const ProManGameTemplates = require('../content/promangame_templates.js');
let usedDefaultWaypoints = false;

/**
 * Returns ProManGameWaypoint Objects from the given JSON content
 * if the JSON content is undefined the default proManGameWaypoints from defaultProManGameItems are returned
 * @param {jsonContent} jsonItemContentWaypoints 
 * @returns associative array with ProManGameWaypoint Objects
 */
function getProManGameWaypoints(jsonItemContentWaypoints) {      
    if (typeof jsonItemContentWaypoints === 'undefined') {
        usedDefaultWaypoints = true;
        return defaultProManGameItems.defaultWaypoints;
    } else {
        let waypoints = getProManGameWaypointObjects(jsonItemContentWaypoints);
        return waypoints;    
    }
}

/**
 * Returns ProManGameRisk Objects from the given JSON content
 * if the JSON content is undefined the default proManGameRisks from defaultProManGameItems are returned
 * @param {jsonContent} jsonItemContentRisks 
 * @returns associative array with ProManGameRisk Objects
 */
function getProManGameRisks(jsonItemContentRisks) {      
    if (typeof jsonItemContentRisks === 'undefined') {
        return defaultProManGameItems.defaultRisks;
    } else {
        let risks = getProManGameRiskObjects(jsonItemContentRisks);
        return risks;    
    }
}

/**
 * Returns ProManGameTask Objects (Question) from the given JSON content
 * if the JSON content is undefined the defaultTasks from defaultProManGameItems are returned
 * @param {jsonContent} jsonItemContentTasks 
 * @returns associative array with Question Objects
 */
function getProManGameTasks(jsonItemContentTasks) {      
    if (typeof jsonItemContentTasks === 'undefined') {
        return defaultProManGameItems.defaultTasks;
    } else {
        let tasks = ItemLib.getQuestionObjects(jsonItemContentTasks);
        return tasks; 
    }
}

/**
 * Returns ProManGameRetro Objects (Question) from the given JSON content
 * if the JSON content is undefined the defaultRetros from defaultProManGameItems are returned
 * @param {jsonContent} jsonItemContentRetros 
 * @returns associative array with Question Objects
 */
function getProManGameRetros(jsonItemContentRetros) {      
    if (typeof jsonItemContentRetros === 'undefined') {
        return defaultProManGameItems.defaultRetros;
    }  else {
        let retros = ItemLib.getQuestionObjects(jsonItemContentRetros);
        return retros;      
    }
}

/**
 * Returns ProManGameQuestion Objects from the given JSON content
 * if the JSON content is undefined the defaultQuestions from defaultProManGameItems are returned
 * @param {jsonContent} jsonItemContentProManGameQuestions 
 * @returns associative array with ProManGameQuestion Objects
 */
function getProManGameQuestions(jsonItemContentProManGameQuestions) {
    if (typeof jsonItemContentProManGameQuestions === 'undefined') {
        return defaultProManGameItems.defaultQuestions;
    } else {
        let questions = getProManGameQuestionObjects(jsonItemContentProManGameQuestions);
        return questions;
    }
}

/**
 * Connects all ProManGameWaypoints on the gameboard with each other
 * @param {ProManGameWaypoints} wps 
 * @param {String} filenameConnectWaypoints 
 */
function connectProManGameWaypoints(wps, jsonItemContentConnectWaypoints, gameController) {
    if (usedDefaultWaypoints) {
        defaultProManGameItems.defaultConnectWaypoints(wps, gameController);
    } else if (typeof jsonItemContentConnectWaypoints === 'undefined') {
        console.log(`Es wurden Waypoints in einer JSON Datei definiert aber keine WaypointConnects.
                    Die Wegpunkte werden nicht miteinander verbunden.`);
    } else {
        ItemLib.connectPaths(wps, gameController);
        ItemLib.connectSingleWaypoints(jsonItemContentConnectWaypoints, wps, gameController);
    }
}

/**
 * Parses the waypoints in JSON Notation to regular ProManGameWaypoint Objects
 * @param {JSON Content} items 
 * @returns associative array with ProManGameWaypoint Objects
 */
function getProManGameWaypointObjects(items) {
    let waypoints = {};
    for (let i = 0; i < items.length; i++) {
        let waypoint = items[i];
        let template = convertProManGameWaypointTemplate(waypoint);
        let myWaypoint = new ProManGameWaypoint(waypoint.id, waypoint.category, 
            waypoint.x, waypoint.y, waypoint.agil, waypoint.startZiel, 
            waypoint.extraWater, waypoint.shopping, template);
        waypoints[waypoint.id] = myWaypoint;
    }
    return waypoints;
}

/**
 * Parses the waypoints in JSON Notation to regular ProManGameRisk Objects
 * @param {JSON Content} items 
 * @returns associative array with ProManGameRisk Objects
 */
function getProManGameRiskObjects(items) {  
    let risks = {};
    for (let i = 0; i < items.length; i++) {
        let risk = items[i];
        let myRisk = new ProManGameRisk(risk.id, risk.header, risk.content, risk.image, risk.actions[0]);
        risks[risk.id] = myRisk;
    }
    return risks;
} 

/**
 * Parses the waypoints in JSON Notation to regular ProManGameQuestion Objects
 * @param {JSON Content} items 
 * @returns associative array with ProManGameQuestion Objects
 */
function getProManGameQuestionObjects(items) {
    let questions = {};
    for (let i = 0; i < items.length; i++) {
        let question = items[i];
        let myQuestion = new ProManGameQuestion(question.id, question.header, question.content, question.image, question.actions[0], question.category);
        questions[question.id] = myQuestion;
    }
    return questions;
}

/**
 * Convertes the given JSON-Waypoint-String to its matching template Class
 * @param {ProManGameWaypoint} waypoint in JSON notation
 */
function convertProManGameWaypointTemplate(waypoint) {
    let index = waypoint.template.indexOf('.') + 1;
    let templateString = waypoint.template.substring(index);
    //erst mit den Standard-Fragole-Templates probieren
    let tempTemplate = ItemLib.convertWaypointTemplate(templateString, false);
    if (typeof tempTemplate === 'undefined') {
        if (ProManGameTemplates.WAYPOINT_ADD_COINS.name === templateString) {
            return ProManGameTemplates.WAYPOINT_ADD_COINS;
        } else if (ProManGameTemplates.WAYPOINT_NORMAL.name === templateString) {
            return ProManGameTemplates.WAYPOINT_NORMAL;
        } else if (ProManGameTemplates.WAYPOINT_ADD_EXTRA_COINS.name === templateString) {
            return ProManGameTemplates.WAYPOINT_ADD_EXTRA_COINS;
        } else if (ProManGameTemplates.WAYPOINT_RETROSPECTIVE.name === templateString) {
            return ProManGameTemplates.WAYPOINT_RETROSPECTIVE;
        } else if (ProManGameTemplates.WAYPOINT_RISK.name === templateString) {
            return ProManGameTemplates.WAYPOINT_RISK;
        } else if (ProManGameTemplates.WAYPOINT_STOP.name === templateString) {
            return ProManGameTemplates.WAYPOINT_STOP;
        } else if (ProManGameTemplates.WAYPOINT_TASK.name === templateString) {
            return ProManGameTemplates.WAYPOINT_TASK;
        } else if (ProManGameTemplates.WAYPOINT_WATER.name === templateString) {
            return ProManGameTemplates.WAYPOINT_WATER;
        //nothing matches? then return WAYPOINT_DEFAULT Template
        } else {
            return DefaultTemplates.WAYPOINT_DEFAULT;
        }
    } else {
        return tempTemplate;
    }
}

module.exports = {
    getProManGameWaypoints: getProManGameWaypoints,
    getProManGameRisks: getProManGameRisks,
    getProManGameTasks: getProManGameTasks,
    getProManGameRetros: getProManGameRetros,
    getProManGameQuestions: getProManGameQuestions,
    connectProManGameWaypoints: connectProManGameWaypoints,
};
