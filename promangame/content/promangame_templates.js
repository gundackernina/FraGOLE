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
const Templates = require('../../lib/FragoleTemplates.js');

class RISK_DEFAULT extends Templates.ComponentTemplate {
    constructor() {
        super('./promangame/components/promangamerisk.pug', 'board_div');
    }
}

class WAYPOINT_STOP extends Templates.ShapeTemplate {
    constructor() {
        super({shape:Templates.shapes.CIRCLE, fill:'firebrick', stroke:'black', layer: 'back', radius:24});
    }
}

class WAYPOINT_RETROSPECTIVE extends Templates.WAYPOINT_DEFAULT {
    constructor() {
        super();
    }
}

class WAYPOINT_ADD_COINS extends Templates.WAYPOINT_DEFAULT {
    constructor() {
        super();
    }
}

class WAYPOINT_ADD_EXTRA_COINS extends Templates.WAYPOINT_DEFAULT {
    constructor() {
        super();
    }
}

class WAYPOINT_NORMAL extends Templates.ShapeTemplate {
    constructor() {
        super({shape:Templates.shapes.CIRCLE, fill:'white', stroke:'black', layer: 'back', radius:11});
    }
}

class WAYPOINT_TASK extends Templates.ShapeTemplate {
    constructor() {
        super({shape:Templates.shapes.CIRCLE, fill:'darkslateblue', stroke:'black', layer:'back', radius:13});
    }
}

class WAYPOINT_WATER extends Templates.ShapeTemplate {
    constructor() {
        super({shape:Templates.shapes.CIRCLE, fill:'cyan', stroke:'black', layer: 'back', radius:11});
    }
}

class WAYPOINT_RISK extends Templates.ShapeTemplate {
    constructor() {
        super({shape:Templates.shapes.CIRCLE, fill:'red', stroke:'black', layer: 'back', radius:11});
    }
}

module.exports = {
    RISK_DEFAULT: RISK_DEFAULT,
    WAYPOINT_STOP: WAYPOINT_STOP,
    WAYPOINT_RETROSPECTIVE: WAYPOINT_RETROSPECTIVE,
    WAYPOINT_ADD_COINS: WAYPOINT_ADD_COINS,
    WAYPOINT_ADD_EXTRA_COINS: WAYPOINT_ADD_EXTRA_COINS,
    WAYPOINT_NORMAL: WAYPOINT_NORMAL,
    WAYPOINT_WATER: WAYPOINT_WATER,
    WAYPOINT_TASK: WAYPOINT_TASK,
    WAYPOINT_RISK: WAYPOINT_RISK,
};
