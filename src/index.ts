import {XorShift256Engine} from "./xor-shift-256-engine";
import {createRandomNumberGeneratorClass} from "./random-number-generator";
const XorShift256 = createRandomNumberGeneratorClass(XorShift256Engine, 'XorShift256');
export default XorShift256;