const maxAPI = require('max-api');
const http = require('http');

const ip = '';
const key = '';

var lights = {};
var lastState = {};
const state = {
    on: 1,
    smooth: 0,
    bri: 0,
    red: 0,
    blue: 0,
    green: 0,
    trimBri: 1,
};

var requestRunning = false;

function init() {
    setInterval(() => {
        updateLights();
    }, 100);
}

maxAPI.addHandlers({
    setState: (key, value) => {
        state[key] = Math.round(value);
    },
    setTrim: (key, value) => {
        state[key] = value;
    },
    setSelectedLight: (index, light) => {
        if(light > 0) {
            lights[index] = light;
        } else {
            delete lights[index];
        }
    },
});

function updateLights() {
    lightsArray = Object.values(lights);
    if(lightsArray.length && !requestRunning && !isEqual(state, lastState)) {
        lightsArray.forEach((lightId) => {
            lastState = Object.assign({}, state);
            requestRunning = true;
            const options = {
                hostname: ip,
                path: '/api/' + key + '/lights/' + lightId + '/state',
                method: 'PUT',
            }
            const req = http.request(options, res => {
                res.on('data', () => {});
                res.on('end', () => {
                    requestRunning = false;
                });
            });
            var xy =  toXY(state.red, state.green, state.blue);
            req.write('{"on": '+ !!state.on +', "bri": ' + Math.round(state.bri*state.trimBri) + ', "xy": ['+xy[0]+', '+xy[1]+'], "transitiontime": '+ state.smooth + '}');
            req.end();
        })
    }
}

function toXY(red,green,blue){
    //Gamma correctie
    red = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
    green = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
    blue = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);

    //Apply wide gamut conversion D65
    var X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
    var Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
    var Z = red * 0.000088 + green * 0.072310 + blue * 0.986039;

    var fx = X / (X + Y + Z);
    var fy = Y / (X + Y + Z);
    if (isNaN(fx)) {
        fx = 0.0;
    }
    if (isNaN(fy)) {
        fy = 0.0;
    }

    return [fx.toPrecision(4), fy.toPrecision(4)];
}

function isEqual(stateA, stateB) {
    return stateA.on === stateB.on &&
           stateA.smooth === stateB.smooth &&
           stateA.bri === stateB.bri &&
           stateA.trimBri === stateB.trimBri &&
           stateA.red === stateB.red &&
           stateA.green === stateB.green &&
           stateA.blue === stateB.blue;
}

init();