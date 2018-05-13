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

const defaultFilenameRisks = "./promangame/config/risks.json";
const defaultFilenameTasks = "./promangame/config/tasks.json";
const defaultFilenameRetros = "./promangame/config/retros.json";
const defaultFilenameQuestions = "./promangame/config/questions.json";
const defaultFilenameWaypoints = "./promangame/config/waypoints.json";
const defaultFilenameConnectWaypoints = "./promangame/config/waypointsConnect.json";

const CustomTemplates = require('../../content/custom_templates.js');
const Question = require('../../objects/Prompt.js').Question;
const DefaultTemplates = require('../../lib/FragoleTemplates.js');
const Lib = require('../../lib/FragoleLib.js');

const ProManGameRisk = require('../objects/ProManGameRisk.js').ProManGameRisk;
const ProManGameQuestion = require('../objects/ProManGameQuestion.js').ProManGameQuestion;
const ProManGameWaypoint = require('../objects/ProManGameWaypoint.js').ProManGameWaypoint;
const defaultProManGameItems = require('../content/defaultProManGameItems.js');
const ProManGameTemplates = require('../content/promangame_templates.js');
let usedDefaultWaypoints = false;

/**
 * Liest alle Waypoints fuer das Spiel ProManGame aus einer JSON Datei aus
 * Wird kein Dateipfad uebergeben wird der defaultPfad genutzt.
 * Tritt beim Parsen ein Fehler auf, oder wird ein falscher Dateipfad uebergeben
 * werden die Standard-Waypoints aus den defaultProManGameItems zurueckgeliefert
 * @param {String} filenameWaypoints 
 */
function getProManGameWaypoints(filenameWaypoints) {      
    let filename = filenameWaypoints;
    if (typeof filename === 'undefined'){
        filename = defaultFilenameWaypoints;
    }  
    let jsonContentWaypoints = getJSONContent(filename);
    //wenn ein Fehler beim Parsen auftritt oder das File nicht
    //gefunden wird, dann die defaultWaypoints zurückgeben
    if (isInvalidJsonContent(jsonContentWaypoints, 'ProManGameWaypoint')) {
        usedDefaultWaypoints = true;
        return defaultProManGameItems.defaultWaypoints;
    } else {
        let risks = getProManGameWaypointObjects(jsonContentWaypoints.items);
        return risks;    
    }
}

/**
 * Liest alle Risikokarten fuer das Spiel ProManGame aus einer JSON Datei aus
 * Wird kein Dateipfad uebergeben wird der defaultPfad genutzt.
 * Tritt beim Parsen ein Fehler auf, oder wird ein falscher Dateipfad uebergeben
 * werden die Standard-Risikokarten aus den defaultProManGameItems zurueckgeliefert
 * @param {String} filenameRisks 
 */
function getProManGameRisks(filenameRisks) {      
    let filename = filenameRisks;
    if (typeof filename === 'undefined'){
        filename = defaultFilenameRisks;
    }  
    let jsonContentRisks = getJSONContent(filename);
    //wenn ein Fehler beim Parsen auftritt oder das File nicht
    //gefunden wird, dann die defaultRisks zurückgeben
    if (isInvalidJsonContent(jsonContentRisks, 'ProManGameRisk')) {
        return defaultProManGameItems.defaultRisks;
    } else {
        let risks = getProManGameRiskObjects(jsonContentRisks.items);
        return risks;    
    }
}

/**
 * Liest alle Tasks fuer das Spiel ProManGame aus einer JSON Datei aus
 * Wird kein Dateipfad uebergeben wird der defaultPfad genutzt.
 * Tritt beim Parsen ein Fehler auf, oder wird ein falscher Dateipfad uebergeben
 * werden die Standard-Tasks aus den defaultProManGameItems zurueckgeliefert
 * @param {String} filenameTasks 
 */
function getProManGameTasks(filenameTasks) {      
    let filename = filenameTasks;
    if (typeof filename === 'undefined'){
        filename = defaultFilenameTasks;
    }  
    let jsonContentTasks = getJSONContent(filename);
    //wenn ein Fehler beim Parsen auftritt oder das File nicht
    //gefunden wird, dann die defaultTasks zurückgeben
    if (isInvalidJsonContent(jsonContentTasks, 'Question')) {
        return defaultProManGameItems.defaultTasks;
    } else {
        let tasks = getQuestionObjects(jsonContentTasks.items);
        return tasks;
       
    }
}

/**
 * Liest alle Retros fuer das Spiel ProManGame aus einer JSON Datei aus
 * Wird kein Dateipfad uebergeben wird der defaultPfad genutzt.
 * Tritt beim Parsen ein Fehler auf, oder wird ein falscher Dateipfad uebergeben
 * werden die Standard-Retros aus den defaultProManGameItems zurueckgeliefert
 * @param {String} filenameRetros 
 */
function getProManGameRetros(filenameRetros) {      
    let filename = filenameRetros;
    if (typeof filename === 'undefined'){
        filename = defaultFilenameRetros;
    }  
    let jsonContentRetros = getJSONContent(filename);
    //wenn ein Fehler beim Parsen auftritt oder das File nicht
    //gefunden wird, dann die defaultRetros zurückgeben
    if (isInvalidJsonContent(jsonContentRetros, 'Question')) {
        return defaultProManGameItems.defaultRetros;
    } else {
        let retros = getQuestionObjects(jsonContentRetros.items);
        return retros;      
    }
}

/**
 * Liest alle ProManGameQuestions fuer das Spiel ProManGame aus einer JSON Datei aus
 * Wird kein Dateipfad uebergeben wird der defaultPfad genutzt.
 * Tritt beim Parsen ein Fehler auf, oder wird ein falscher Dateipfad uebergeben
 * werden die Standard-ProManGameQuestions aus den defaultProManGameItems zurueckgeliefert
 * @param {String} filenameQuestions 
 */
function getProManGameQuestions(filenameQuestions) {
    let filename = filenameQuestions;
    if (typeof filenmae === 'undefined'){
        filename = defaultFilenameQuestions;
    }
    let jsonContentQuestions = getJSONContent(filename);
    //wenn ein Fehler beim Parsen auftritt oder das File nicht
    //gefunden wird, dann die defaultQuestions zurückgeben
    if (isInvalidJsonContent(jsonContentQuestions, 'ProManGameQuestion')) {
        return defaultProManGameItems.defaultQuestions;
    } else {
        let questions = getProManGameQuestionObjects(jsonContentQuestions.items);
        return questions;
    }
}

/**
 * Verbindet alle Waypoints auf dem Spielfeld miteinander
 * @param {ProManGameWaypoints} wps 
 * @param {String} filenameConnectWaypoints 
 */
function connectWaypoints(wps, filenameConnectWaypoints) {
    if (usedDefaultWaypoints) {
        defaultProManGameItems.defaultConnectWaypoints(wps);
    } else {
        let filename = filenameConnectWaypoints;
        if (typeof filename === 'undefined'){
            filename = defaultFilenameConnectWaypoints;
        }  
        let jsonContentConnectWaypoints = getJSONContent(filename);
        if (isInvalidJsonContent(jsonContentConnectWaypoints, 'WaypointConnect')) {
            return "Fehler beim Parsen der JSON-Connect-Waypoints-Datei. Bitte Format überprüfen";
        } else {
            connectPaths(wps);
            connectSingleWaypoints(jsonContentConnectWaypoints.items, wps);
        }
    }
}

/**
 * Connects all Waypoints of the same category
 * @param {ProManGameWaypoints} wps 
 */
function connectPaths(wps) {
    //Pfadangaben ermitteln + Waypoints entsprechendem Array zuordnen
    let paths = {};
    for (let wp in wps) {
        let waypoint = wps[wp];
        if (paths[waypoint.category] instanceof Array) {
            paths[waypoint.category].push(waypoint);
        } else {
            paths[waypoint.category]=[waypoint];
        }
    }
    //Die Pfade connecten
    for (path in paths) {
        Lib.connectWaypoints(paths[path], true);
    }
}

/**
 * Connects single Waypoints e.g. to connect different paths with
 * each other
 * @param {WaypointsConnects} items in JSON Format
 * @param {Waypoints} wps 
 */
function connectSingleWaypoints(items, wps) {
    for (let i = 0; i < items.length; i++){
        let connect = items[i];
        let from = connect.wpFromId;
        let to = connect.wpToId;
        Lib.connectWaypoints([wps[from], wps[to]], true);
    }
}

/**
 * Reads the content of a JSON-File and is parsing the content
 * @param {String} filename 
 * @returns content of JSON-File or errorMessage
 */
function getJSONContent(filename) {
    let fs = require("fs");
    let jsonContent;
    try {
        // Get content from file
        let contents = fs.readFileSync(filename);
        jsonContent = JSON.parse(contents);
    } catch (e) {
        jsonContent = "parsingError " + e.message;
    }   
    return jsonContent;
}

function getProManGameWaypointObjects(items){
    let waypoints = {};
    for (let i = 0; i < items.length; i++) {
        let waypoint = items[i];
        let template = convertWaypointTemplate(waypoint);
        let myWaypoint = new ProManGameWaypoint(waypoint.id, waypoint.category, waypoint.x, waypoint.y,
                                                waypoint.agil, waypoint.startZiel, waypoint.extraWater,
                                                waypoint.shopping, template);
        waypoints[waypoint.id] = myWaypoint;
    }
    return waypoints;
}

function getProManGameRiskObjects(items){  
    let risks = {};
    for (let i = 0; i < items.length; i++) {
        let risk = items[i];
        let myRisk = new ProManGameRisk(risk.id, risk.header, risk.content, risk.image, risk.actions[0]);
        risks[risk.id] = myRisk;
    }
    return risks;
} 

function getQuestionObjects(items){
    let questions = {};
    for (let i = 0; i < items.length; i++) {
        let question = items[i];
        let myQuestion = new Question(question.id, question.header, question.content, question.image, question.actions[0]);
        questions[question.id] = myQuestion;
    }
    return questions;
}

function getProManGameQuestionObjects(items){
    let questions = {};
    for (let i = 0; i < items.length; i++) {
        let question = items[i];
        let myQuestion = new ProManGameQuestion(question.id, question.header, question.content, question.image, question.actions[0], question.category);
        questions[question.id] = myQuestion;
    }
    return questions;
}

function isInvalidJsonContent(jsonContent, objectString){
    if ((isString(jsonContent) &&
        jsonContent.startsWith('parsingError')) ||
        jsonContent.object !== objectString) {
        return true;
    } else {
        return false;
    }
}

function isString(s) {
    return typeof(s) === 'string' || s instanceof String;
}

/**
 * Konvertiert den uebergebenen JSON-Waypoint-Template-String in die entsprechende
 * Template Klasse
 * @param {ProManGameWaypoint} waypoint in der JSON-Notation
 */
function convertWaypointTemplate(waypoint) {
    let template = waypoint.template.split('.');
    if (ProManGameTemplates.WAYPOINT_ADD_COINS.name === template[1]){
        return ProManGameTemplates.WAYPOINT_ADD_COINS;
    } else if (ProManGameTemplates.WAYPOINT_NORMAL.name === template[1]) {
        return ProManGameTemplates.WAYPOINT_NORMAL;
    } else if (ProManGameTemplates.WAYPOINT_ADD_EXTRA_COINS.name === template[1]) {
        return ProManGameTemplates.WAYPOINT_ADD_EXTRA_COINS;
    } else if (ProManGameTemplates.WAYPOINT_RETROSPECTIVE.name === template[1]) {
        return ProManGameTemplates.WAYPOINT_RETROSPECTIVE;
    } else if (ProManGameTemplates.WAYPOINT_RISK.name === template[1]) {
        return ProManGameTemplates.WAYPOINT_RISK;
    } else if (ProManGameTemplates.WAYPOINT_STOP.name === template[1]) {
        return ProManGameTemplates.WAYPOINT_STOP;
    } else if (ProManGameTemplates.WAYPOINT_TASK.name === template[1]) {
        return ProManGameTemplates.WAYPOINT_TASK;
    } else if (ProManGameTemplates.WAYPOINT_WATER.name === template[1]) {
        return ProManGameTemplates.WAYPOINT_WATER;
    } else if (CustomTemplates.WAYPOINT_GREEN.name === template[1]) {
        return CustomTemplates.WAYPOINT_GREEN;
    } else if (CustomTemplates.WAYPOINT_GOLD.name === template[1]) {
        return CustomTemplates.WAYPOINT_GOLD;
    } else if (CustomTemplates.WAYPOINT_LIGHT_BLUE.name === template[1]) {
        return CustomTemplates.WAYPOINT_LIGHT_BLUE;
    } else if (CustomTemplates.WAYPOINT_ORANGE.name === template[1]) {
        return CustomTemplates.WAYPOINT_ORANGE;
    } else if (CustomTemplates.WAYPOINT_SMALL_ORANGE.name === template[1]) {
        return CustomTemplates.WAYPOINT_SMALL_ORANGE;
    } else if (CustomTemplates.WAYPOINT_SMALL_RED.name === template[1]) {
        return CustomTemplates.WAYPOINT_SMALL_RED;
    } else if (CustomTemplates.WAYPOINT_SMALL_WHITE.name === template[1]) {
        return CustomTemplates.WAYPOINT_SMALL_WHITE;
    //es passt gar nichts? Dann das Standard-Waypoint-Template zurueckgeben
    } else {
        return DefaultTemplates.WAYPOINT_DEFAULT;
    }
}

module.exports = {
    getProManGameWaypoints: getProManGameWaypoints,
    getProManGameRisks: getProManGameRisks,
    getProManGameTasks: getProManGameTasks,
    getProManGameRetros: getProManGameRetros,
    getProManGameQuestions: getProManGameQuestions,
    connectWaypoints: connectWaypoints,
}
