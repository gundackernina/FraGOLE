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
/** @module ProManGameWaypoint */
const Waypoint = require('../../objects/Waypoint.js').Waypoint;
const Templates = require('../../lib/FragoleTemplates.js');
//const CustomTemplates = require('../content/custom_templates.js');

/** Class ProManGameWaypoint
* @extends {module:Waypoint~Waypoint}
* Displays a ProManGameWaypoint on the client-side
* a ProManGameWaypoint has a boolean property if he is an agile Waypoint or not
* a ProManGameWaypoint has a boolean property if he is a startOrFinish Waypoint or not
* a ProManGameWaypoint has a boolean property if you have to give extraWater or not
* a ProManGameWaypoint has a boolean property if can shop new Water or not
*/
class ProManGameWaypoint extends Waypoint {
    constructor(id, category, x, y, agil, startZiel, extraWater, shopping, template=Templates.WAYPOINT_DEFAULT) {
        super(id, category, x, y, template);
        //this.template = template;
        this.agil = agil;
        this.startZiel = startZiel;
        this.extraWater = extraWater;
        this.shopping = shopping;
    }

}
module.exports.ProManGameWaypoint = ProManGameWaypoint;