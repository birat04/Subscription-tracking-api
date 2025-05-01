import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";


const aj = arcjet({
  
  key: ARCJET_KEY,
  characteristics: ["ip.src"], 
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE", 
      allow: [
        "CATEGORY:SEARCH_ENGINE", 
        
      ],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 1,
      interval: 10, 
      capacity: 3, 
    }),
  ],
});


export default aj;



