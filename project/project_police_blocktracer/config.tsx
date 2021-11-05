// const INFURA = {
//     wss: 'wss://mainnet.infura.io/ws/v3/fabbb34a11674473bc6ae8fb709ddd1a',
//     projectId: 'fabbb34a11674473bc6ae8fb709ddd1a',
//     projectSecret: '119002e28f034c3a8aec36bd286fba40'
// }

// const ETHERSCAN_BASE_URL = 'https://etherscan.io';

// export default {
//     INFURA,
//     ETHERSCAN_BASE_URL
// }
// module.exports = {
//     "roots": [
//       "<rootDir>/node/src"
//     ],
//     "moduleFileExtensions": [
//       "js",
//       "jsx",
//       "json",
//       "node"
//     ],
//     "verbose": true,
//     "testEnvironment": 'node',
//     "testURL": 'http://localhost:3000',
//     "setupFiles": ["jest-canvas-mock"],
//     "setupTestFrameworkScriptFile": "<rootDir>/src/setupTests.js"
//         //// setup file
//          //import { configure } from 'enzyme';
//          //import 'jest-canvas-mock';
//          //import Adapter from 'enzyme-adapter-react-16';
  
//          //configure({ adapter: new Adapter() });
//   }

const ETHERSCAN_API_KEY = 'RFCTFK66U7M2HSDMXUQGBNWN5UUHXGIHQK';
const INFURA = {
    wss: 'wss://mainnet.infura.io/ws/v3/fabbb34a11674473bc6ae8fb709ddd1a',
    projectId: 'fabbb34a11674473bc6ae8fb709ddd1a',
    projectSecret: '119002e28f034c3a8aec36bd286fba40'
}
const FIREBASE = {
    apiKey: "AIzaSyCrIQgelSdTG6K_Yr_gPA9KqFpu0Y50a-Q",
    authDomain: "block-tracer.firebaseapp.com",
    projectId: "block-tracer",
    storageBucket: "block-tracer.appspot.com",
    messagingSenderId: "963237749524",
    appId: "1:963237749524:web:8143e8efd9c9d5a0319801",
    measurementId: "G-G2YD2BS1X2"
}
const TRACER = {
    url: 'http://block.werapun.com:4005',
    // url: 'http://localhost:4000',
}
const ETHERSCAN_BASE_URL = 'https://etherscan.io';

export default {
    ETHERSCAN_API_KEY,
    INFURA,
    FIREBASE,
    TRACER,
    ETHERSCAN_BASE_URL
}