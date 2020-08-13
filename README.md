# Hue Control Node

This project is a Max for Life plugin to control Philips Hue Lights within Ableton Live.

![Device screenshot](/screenshot.png)

## Prerequisite

- Ableton Live Suite edition (only edition which has Max for Life support)
- Phillips Hue bridge connected to the same network
- Some Hue lights connected with the Hue bridge

## Installation

1. To communicate with the Hue Bridge the scripts needs a token for authentication. Follow the instructions on https://developers.meethue.com/develop/get-started-2/ until you have created an autenticated user token.
2. Open the `hue-control-node.js` file where two configurations have to be added. On line 4 add the bridge ip/host between the quotes. You should have this address if you followed the previous step. On line 5 add add the autenticated user token between the quotes.
3. Copy the hue-control-node folder (which has the .amxd and .js file) to your User Library folder: `\User Library\Presets\Instruments\Max Instrument\`
4. In Ableton from the left menu the device can be found in: `User Library->Presets->Instruments->Max Instrument`. Drag the device to the device rack to create an instance of it.

## Choose lights

Each instance can control up to five lights using the same color configuration. If you want different colors for each light you'll need to use seperate instances. In the top of the device five number boxes are shown. These numbers corrospond to the lights updates are send to. A number of zero means disabled. 

To find out the numer of a specific light navigate to http://{bride-ip}/api/{token}. The API outputs all the lights connected to the Hue Bridge. Use a JSON formatter to make the output readable for example http://jsonviewer.stack.hu/. The number on the left is the id of the light.

## Knobs

| Knobs    |      Description          |
|----------|---------------------------|
| onoff    | set the light on or off   |
| red      | controls the red color    |
| blue     | controls the blue color   |
| green    | controls the green color  |
| bri      | controls the brightness   |
| trim bri | relatively changes the brightness, when the knob is in the center no changes are made on the brightness |
| smooth   | when enabed transitions are smooth but will also add a 100ms delay   |

## Limitations

The script is optimized to only update when there is something to change. When automations slighty change the colors over time it will send an update every 0.1 second. This is the worst scenario. The limitiations depends on the Hue Bridge version and type of lights but try to send as less updates as possible. The Hue Protocol is not made for this and can easily be flooded causing updated to queue which makes it even slower.