## ProManGame V0.1.0 based on FraGOLE Framework V0.1.0

# Installation
--------------
1. Install Node.js (v8.10.0 was used for development)
2. run "npm install" in ProManGameWithFraGOLE folder

# Run ProManGame with default configuration
-------------------------------------
1. start the demo-server with "node GipfelerobererMain.js" in ProManGameWithFraGOLE folder
2. The demo-server is reachable at port 80 (e.g. http://localhost:80)

# Run ProManGame with user-defined configuration
------------------------------------------
It is possible to configure the following objects with individual JSON Files
- ProManGameWaypoint
- ProManGameRisk
- ProManGameQuestion
- WaypointConnect
- ProManGameRetro
- ProManGameTask
- BackgroundImage
There are default JSON Files for each object in the /promangame/config folder
Also it is possible to set an individual server port.
To run the game with these two additional settings you have to start the demo-server with two params
=> first param: port-number (Number)
=> second param: path to json-config-directory
=> e.g "node GipfelerobererMain.js 81 C:\Temp\testconfig"
=> the demo-server for this example is then reachable at port 81 (e.g. http://localhost:81)

# Run FraGOLE Framework Demo with default configuration
-------------------------------------
1. start the demo-server with "node FragoleMain.js" in ProManGameWithFraGOLE folder
2. The demo-server is reachable at port 80 (e.g. http://localhost:80)

# Run FraGOLE Framework Demo with user-defined configuration
------------------------------------------
It is possible to configure the following objects with individual JSON Files
- Waypoint
- WaypointConnect
- Question
- Prompt
- BackgroundImage
There are default JSON Files for each object in the /config folder
Also it is possible to set an individual server port.
To run the game with these two additional settings you have to start the demo-server with two params
=> first param: port-number (Number)
=> second param: path to json-config-directory
=> e.g "node FragoleMain.js 81 C:\Temp\testconfig"
=> the demo-server for this example is then reachable at port 81 (e.g. http://localhost:81)

# Acknowledgements
------------------
FraGOLE uses public domain game assets by https://kenney.nl/

# License
---------
Copyright   
=> FraGOLE    2017,2018 by Michael Bauer und Nina Gundacker
=> ProManGame 2018 by Nina Gundacker
=> concept and rules of ProManGame 2017 by Klemens Waldhör and Ilse Hartmann

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
