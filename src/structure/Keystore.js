const {deviceModel: defaultDeviceModel} = require('../util/Constants')
const Util = require('../util/Util')
module.exports = class Keystore {
    
    /**
     * 
     * @param {string} deviceModel Device model (if not default) 
     * @param {string} firebaseToken Firebase token  
     */
    async init(deviceModel = defaultDeviceModel, firebaseToken) {
        if(!firebaseToken) {
            firebaseToken = await Util.getFirebaseToken()
        }
        const {privateKey, certificate, fingerprint} = await Util.generateKeyPair()
        const 

    }
}
