const Constants = require("./Constants");
const centra = require('centra')
const { Error, TypeError } = require("../errors");
module.exports = class Utils {
  constructor() {
      
    throw new Error(`CLASS_INSTANTIATED_ERROR`, 
      this.constructor.name
    );
  }

  /**
   *
   * @param {string} token
   */
  static async getBaseUrl(token) {
    let tokenCode = token.slice(0, 3);
    let components = await this.getVulcanComponents()
    
    if(!components[tokenCode]) throw new TypeError(`INVALID_TOKEN_CODE`)
  }

  static async getFirebaseToken() {
      const {firebaseUrl: url, firebaseHeaders: headers, firebaseData} = require('./Constants')

      const firebaseResponse = await centra(url, 'POST').header(headers).body(firebaseData, 'form').send()

      if (firebaseResponse.statusCode !== 200) {
        throw new Error(`FIREBASE_API_ERROR`, firebaseResponse.statusCode);
      }
      return firebaseResponse.text()
  }

  static async getVulcanComponents() {
    let response = await centra(`${Constants.ROUTING_RULES_URL}`).send();
    if (response.statusCode !== 200) {
      throw new Error(`FIREBASE_API_ERROR`, response.statusCode);
    }

    if (response?.headers["content-type"] !== "text/plain") {
      throw new Error(
        `INVALID_CONTENT_TYPE`,
        "text/plain",
        response.headers["content-type"]
    );
    }
    const components = {}
    for(let i of response.text().split('\r\n')) {
        let componentCode = i.split(',')[0]
        let componentUrl = i.split(',')[1]
        if(componentUrl === undefined) break;
        Object.assign(components, {[`${componentCode}`]: componentUrl})
    }
    return components
  }
};
