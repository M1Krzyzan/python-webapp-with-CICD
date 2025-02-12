import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "util";

// Add type declaration for `global` to avoid TS errors
declare global {
  // Extend NodeJS.Global interface with TextEncoder and TextDecoder
  namespace NodeJS {
    interface Global {
      TextEncoder: typeof TextEncoder;
      TextDecoder: typeof TextDecoder;
    }
  }
}

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;