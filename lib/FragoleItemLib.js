/**
 * @Author: Nina Gundacker 
 * @Date:   2018-05-19T11:09:28+02:00
 * @Email:  nina.gundacker@nefkom.net
 * @Project: Fragole - FrAmework for Gamified Online Learning Environments
 * @Last modified by:   Nina Gundacker
 * @Last modified time: 2018-05-19T11:09:28+02:00
 * @License: MIT
 * @Copyright: Nina Gundacker
 */
const Lib = require('./FragoleLib.js');
const gameItems = require('../content/gameItems.js');
const CustomTemplates = require('../content/custom_templates.js');
const DefaultTemplates = require('./FragoleTemplates.js');
const Question = require('../objects/Prompt.js').Question;
const Prompt = require('../objects/Prompt.js').Prompt;
const Waypoint = require('../objects/Waypoint.js').Waypoint;

const fs = require('fs');
const defaultImage = 'assets/background.jpg';
let usedDefaultWaypoints = false;

/**
 * Reads all Files in the given directory
 * If a file is a .json-File the content of the file
 * gets parsed 
 * @param {filePath} path 
 * @return {Array with Json Contents} resultContents
 */
function getConfigurationContentFromFiles(path){
    let resultContents = {};
    if (typeof path !== "undefined") {
        let files = fs.readdirSync(path);
        for (let i = 0; i < files.length; i++) {
            let myFile = files[i];
            if (myFile.endsWith('.json')){
                let filePath = path + '\\' + myFile;
                let jsonContent = getJSONContent(filePath);
                //The json content is valid
                if(isInvalidJsonContent(jsonContent) === false){
                    resultContents[jsonContent.object] = jsonContent.items;
                }
            }
        }
    } 
    return resultContents;
}

/**
 * Reads the content of a JSON-File and is parsing the content
 * @param {String} filename 
 * @returns content of JSON-File or errorMessage
 */
function getJSONContent(filename) {
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

/**
 * Returns the path of the backgroundImage from the given JSON content
 * if jsonContent is undefined, the defaultPath of the defaultImage is returned
 * @param {path} jsonItemContentBackgroundImage 
 */
function getBackgroundImage(jsonItemContentBackgroundImage) {
    if (typeof jsonItemContentBackgroundImage === 'undefined'){
        return defaultImage;
    } else {
        return jsonItemContentBackgroundImage;  
    }
}

/**
 * Returns Waypoint Objects from the given JSON content
 * if the JSON content is undefined the default waypoints from gameItems are returned
 * @param {jsonContent} jsonItemContentWaypoints 
 * @returns associative array with Waypoint Objects
 */
function getWaypoints(jsonItemContentWaypoints){
    if (typeof jsonItemContentWaypoints === 'undefined'){
        usedDefaultWaypoints = true;
        return gameItems.waypoints;
    } else {
        let waypoints = getWaypointObjects(jsonItemContentWaypoints);
        return waypoints;    
    }
}

/**
 * Returns Question Objects from the given JSON content
 * if the JSON content is undefined the default questions from gameItems are returned
 * @param {jsonContent} jsonItemContentQuestions 
 * @returns associative array with Question Objects
 */
function getQuestions(jsonItemContentQuestions){
    if (typeof jsonItemContentQuestions === 'undefined'){
        return gameItems.questions;
    } else {
        let questions = getQuestionObjects(jsonItemContentQuestions);
        return questions;    
    }
}

/**
 * Returns Prompt Objects from the given JSON content
 * if the JSON content is undefined the default prompts from gameItems are returned
 * @param {jsonContent} jsonItemContentPrompts 
 * @returns associative array with Prompt Objects
 */
function getPrompts(jsonItemContentPrompts) {
    if (typeof jsonItemContentPrompts === 'undefined') {
        return gameItems.prompts;
    } else {
        let prompts = getPromptObjects(jsonItemContentPrompts);
        return prompts;
    }
} 

/**
 * Parses the waypoints in JSON Notation to regular Waypoint Objects
 * @param {JSON Content} items 
 * @returns associative array with Waypoint Objects
 */
function getWaypointObjects(items) {
    let waypoints = {};
    for (let i = 0; i < items.length; i++) {
        let waypoint = items[i];
        let index = waypoint.template.indexOf('.') + 1;
        let templateString = waypoint.template.substring(index);
        let template = convertWaypointTemplate(templateString, true);
        let myWaypoint = new Waypoint(waypoint.id, waypoint.category, waypoint.x, waypoint.y, template);
        waypoints[waypoint.id] = myWaypoint;
    }
    return waypoints;
}

/**
 * Parses the prompts in JSON Notation to regular Prompt Objects
 * @param {JSON Content} items 
 * @returns associative array with Prompt Objects
 */
function getPromptObjects(items) {
    let prompts = {};
    for (let i = 0; i < items.length; i++){
        let prompt = items[i];
        let myPrompt = new Prompt(prompt.id, prompt.header, prompt.content, prompt.image, prompt.actions[0]);
        prompts[prompt.id] = myPrompt;
    }
    return prompts;
}

/**
 * Parses the questions in JSON Notation to regular Question Objects
 * @param {JSON Content} items 
 * @returns associative array with Question Objects
 */
function getQuestionObjects(items) {
    let questions = {};
    for (let i = 0; i < items.length; i++) {
        let question = items[i];
        let myQuestion = new Question(question.id, question.header, question.content, question.image, question.actions[0]);
        questions[question.id] = myQuestion;
    }
    return questions;
}

/**
 * Connects all Waypoints on the gameboard with each other
 * @param {Waypoint} wps 
 * @param {String} filenameConnectWaypoints 
 */
function connectWaypoints(wps, jsonItemContentConnectWaypoints) {
    if (usedDefaultWaypoints) {
        gameItems.connectWaypoints();
    } else if (typeof jsonItemContentConnectWaypoints === 'undefined') {
        console.log(`Es wurden Waypoints in einer JSON Datei definiert aber keine WaypointConnects.
                    Die Wegpunkte werden nicht miteinander verbunden.`);
    } else {
        connectPaths(wps);
        connectSingleWaypoints(jsonItemContentConnectWaypoints, wps);
    }
}

/**
 * Connects all Waypoints of the same category
 * @param {Waypoint} wps 
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
    //Connect the Paths
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
        console.log("WaypointFrom:" + from + " WaypointTo:" + to);
        Lib.connectWaypoints([wps[from], wps[to]], true);
    }
}

/**
 * Convertes the given JSON-Waypoint-String to its matching template Class
 * Return undefined if the call of the function is from an external js-File and no
 * template class is matching.
 * @param {String} templateString
 * @param {boolean} internalCall
 */
function convertWaypointTemplate(template, internalCall) {
    if (CustomTemplates.WAYPOINT_GREEN.name === template) {
        return CustomTemplates.WAYPOINT_GREEN;
    } else if (CustomTemplates.WAYPOINT_GOLD.name === template) {
        return CustomTemplates.WAYPOINT_GOLD;
    } else if (CustomTemplates.WAYPOINT_LIGHT_BLUE.name === template) {
        return CustomTemplates.WAYPOINT_LIGHT_BLUE;
    } else if (CustomTemplates.WAYPOINT_ORANGE.name === template) {
        return CustomTemplates.WAYPOINT_ORANGE;
    } else if (CustomTemplates.WAYPOINT_SMALL_ORANGE.name === template) {
        return CustomTemplates.WAYPOINT_SMALL_ORANGE;
    } else if (CustomTemplates.WAYPOINT_SMALL_RED.name === template) {
        return CustomTemplates.WAYPOINT_SMALL_RED;
    } else if (CustomTemplates.WAYPOINT_SMALL_WHITE.name === template) {
        return CustomTemplates.WAYPOINT_SMALL_WHITE;
    } else {
        if (internalCall) {
            return DefaultTemplates.WAYPOINT_DEFAULT;
        }
    }
}

function isInvalidJsonContent(jsonContent){
    if ((isString(jsonContent) &&
        jsonContent.startsWith('parsingError'))) {
        return true;
    } else {
        return false;
    }
}

function isString(s) {
    return typeof(s) === 'string' || s instanceof String;
}

module.exports = {
    getConfigurationContentFromFiles: getConfigurationContentFromFiles,
    getJSONContent: getJSONContent,
    getBackgroundImage: getBackgroundImage,
    getWaypoints: getWaypoints,
    getPrompts: getPrompts,
    getQuestions: getQuestions,
    getQuestionObjects: getQuestionObjects,
    getWaypointObjects: getWaypointObjects,
    getPromptObjects: getPromptObjects,
    connectWaypoints: connectWaypoints, 
    connectSingleWaypoints: connectSingleWaypoints,
    connectPaths: connectPaths,
    isInvalidJsonContent: isInvalidJsonContent,
    convertWaypointTemplate: convertWaypointTemplate,
}