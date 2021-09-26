const { register } = require("./VulcanifyError");
const ErrorMessages = {
  FIREBASE_API_ERROR: (received) =>
    `Unexpected response status code from the Firebase API: ${received}`,
  VULCAN_API_ERROR: (received) => `Unexpected response from the Vulcan API: ${received}`,
  INVALID_CONTENT_TYPE: (received, required) =>
    `Received an unexpected Content-Type header in the response: ${received} (expected ${required})`,
    INVALID_TOKEN_CODE: `Specify a valid and correct token code!`,
    CLASS_INSTANTIATED_ERROR: (className) => `Class ${className} cannot be instantiated!`
};

for (const [name, message] of Object.entries(ErrorMessages))
  register(name, message);
