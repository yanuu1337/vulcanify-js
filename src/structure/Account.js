const { packageData } = require("../util/Constants")


module.exports = class Account {


    constructor() {

    }
    /**
     * 
     * @param {string} token The register Token 
     * @param {string} symbol The school's symbol name
     * @param {string} pin The register PIN 
     */
    async register(token, symbol, pin) {
        token = token.toUpperCase()
        symbol = symbol.toLowerCase()
        
        const body = {
            ...packageData,
            "DeviceModel": ""
        }
    }
}