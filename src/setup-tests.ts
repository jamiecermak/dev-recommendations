import "@testing-library/jest-dom/extend-expect";
import { TextEncoder } from "util";

// Set global TextEncoder for React-Email testing
global.TextEncoder = TextEncoder;
