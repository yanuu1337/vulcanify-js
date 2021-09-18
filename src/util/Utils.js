const { default: axios } = require("axios");
const Constants = require("./Constants");
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
      const {firebaseData, firebaseHeaders, firebaseUrl} = require('./Constants')
      console.log(firebaseData, firebaseHeaders)
      const firebaseResponse = await axios.post(firebaseUrl, firebaseData, {
          headers: firebaseHeaders
      })
      if (firebaseResponse.status !== 200) {
        throw new Error(`API_INVALID_CODE`, response.status);
      }
      return firebaseResponse.data
  }

  static async getVulcanComponents() {
    let response = await axios.get(`${Constants.ROUTING_RULES_URL}`);
    if (response.status !== 200) {
      throw new Error(`API_INVALID_CODE`, response.status);
    }

    if (response?.headers["content-type"] !== "text/plain") {
      throw new Error(
        `INVALID_CONTENT_TYPE`,
        "text/plain",
        response.headers["content-type"]
    );
    }
    const components = {}
    for(let i of response.data.split('\r\n')) {
        let componentCode = i.split(',')[0]
        let componentUrl = i.split(',')[1]
        if(componentUrl === undefined) break;
        Object.assign(components, {[`${componentCode}`]: componentUrl})
    }
    return components
  }
};
