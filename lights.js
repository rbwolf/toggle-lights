#!/usr/local/bin/node
const EventEmitter = require('events');
const LifxClient = require('node-lifx').Client
const util = require('util')
const debug = util.debuglog('app')
const client = new LifxClient()

// Constants
const LIGHTS_READY = 'lights-ready'
const NEW_LIGHT = 'light-new'
const NUM_LIGHTS = 4
const CHANGE_DURATION = 0
const DISCOVER_TIMEOUT = 1000

// Global variables
let existingTimeout = null
let action = process.argv[2]
client.init()

// Util classes
class LightList extends EventEmitter {
    lights = []
    addLight = light => {
        this.lights.push(light)
        if (this.lights.length == NUM_LIGHTS) {
            this.emit(LIGHTS_READY)
        }
    }
}
var lightList = new LightList()

// Functions
const setState = action => {
    let promises = []
    lightList.lights.forEach(light => {
        promises.push(new Promise((res, rej) => {
            action == 'on' ?
                light.on(CHANGE_DURATION, () => res(`Turned on ${light.id}`)) :
                light.off(CHANGE_DURATION, () => res(`Turned off ${light.id}`))
        }))
    })
    Promise.all(promises).then(() => process.exit(0))
}

const setTimeoutAction = () => {
    return setTimeout(() => {
            debug('Timeout expired, continuing')
            setState(action)
    }, DISCOVER_TIMEOUT)
}

// Main event listeners
client.on(NEW_LIGHT, light => {
    debug(`New light found. ${light.id}`)
    lightList.addLight(light)
    if (existingTimeout) {
        clearTimeout(existingTimeout)
        existingTimeout = setTimeoutAction()
    } else {
        debug('Setting timeout...')
        existingTimeout = setTimeoutAction()
    }
})

lightList.on(LIGHTS_READY, () => {
    debug('All lights found!')
    if (action != 'on' && action != 'off') {
        debug(`'${action}' is not a valid argument`)
        process.exit(1)
    } else {
        setState(action)
    }
})