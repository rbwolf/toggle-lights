toggle-lights
========
Toggle all LIFX lights on your local network using [node-lifx](https://www.npmjs.com/package/node-lifx). 

Execute
-------
Update the NUM_LIGHTS (lights.js:11) constant to match the number of LIFX bulbs attached to your network (set to four by default).
The script only takes one argument: `on` or `off`
  * `node lights.js on`
  * `node lights.js off`
  
If the script fails to discover the specified number of bulbs within the allotted time (`DISCOVER_TIMEOUT`, default of 1s), it will toggle the bulbs that it *did* discover.

Debug
-------
Enable debug logging by setting the environment variable: `export NODE_DEBUG=app`
