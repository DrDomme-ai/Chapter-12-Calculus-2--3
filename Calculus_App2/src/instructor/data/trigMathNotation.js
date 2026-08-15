export const TRIG_TICKS = Object.freeze([
  {value:-2*Math.PI,latex:'-2\\pi'},{value:-3*Math.PI/2,latex:'-\\frac{3\\pi}{2}'},
  {value:-Math.PI,latex:'-\\pi'},{value:-Math.PI/2,latex:'-\\frac{\\pi}{2}'},
  {value:0,latex:'0'},{value:Math.PI/2,latex:'\\frac{\\pi}{2}'},{value:Math.PI,latex:'\\pi'},
  {value:3*Math.PI/2,latex:'\\frac{3\\pi}{2}'},{value:2*Math.PI,latex:'2\\pi'},
])

export const SPECIAL_TRIG_VALUES = Object.freeze({
  piSix:{value:Math.PI/6,latex:'\\frac{\\pi}{6}',degrees:30},
  piFour:{value:Math.PI/4,latex:'\\frac{\\pi}{4}',degrees:45},
  piThree:{value:Math.PI/3,latex:'\\frac{\\pi}{3}',degrees:60},
  half:{value:1/2,latex:'\\frac12'},
  sqrtTwoHalf:{value:Math.SQRT1_2,latex:'\\frac{\\sqrt2}{2}'},
  sqrtThreeHalf:{value:Math.sqrt(3)/2,latex:'\\frac{\\sqrt3}{2}'},
})
