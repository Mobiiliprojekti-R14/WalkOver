const isValidFormat = (input: string): boolean => {
  /*
  * Checks whether input string is a valid hex color code

  * valid formats: 
  * "#abc", "#ABC", "#aabbcc", "#AABBCC", (rgb without opacity)
  * "#abcd", "#ABCD", "#aabbccdd", "#AABBCCDD" (rgb with opacity)
  */

  const valid1 = /^#[0-9a-f]{3}$/i //3 character hex with no transparency
  const valid2 = /^#[0-9a-f]{6}$/i //6 character hex with no transparency
  const valid3 = /^#[0-9a-f]{4}$/i //3 character hex with transparency
  const valid4 = /^#[0-9a-f]{8}$/i //6 character hex with with transparency

  return valid1.test(input) || valid2.test(input) || valid3.test(input) || valid4.test(input)
}

const setOpacity = (input: string, opacity: string, defaultOutput?: string): string => {
  /*
  * Adds opacity to a non-transparent input string ("#aabbcc" --> "#aabbcc67")
  * OR changes the opacity of a transparent input string ("#aabbcc66" --> "#aabbcc77")

  * input: valid hex color string (either 3, 4, 6, or 8 chars)
  * opacity: valid hex string (2 chars) (00...ff)
  * defaultOutput (optional parameter): in case of faulty input/opacity, function will return a default color string instead of input
  */

  const BACKUP_DEFAULT_COLOR = '#0000'
  const validOpacity = /^[0-9a-z]{2}$/i

  if (!isValidFormat(input)) {
    console.log("setOpacity: invalid input string: ", input)

    if (!defaultOutput) return input;

    if (isValidFormat(defaultOutput)) return defaultOutput;
    else return BACKUP_DEFAULT_COLOR;
  }

  if (!validOpacity.test(opacity)) {
    console.log("setOpacity: invalid opacity: ", opacity)

    if (!defaultOutput) return input

    if (isValidFormat(defaultOutput)) return defaultOutput;
    else return BACKUP_DEFAULT_COLOR;
  }

  let output = "";

  if (input.length === 4 || input.length === 5) {
    //input format: "#abc" or "#abcd"
    output = input[0] + input[1] + input[1] + input[2] + input[2] + input[3] + input[3] + opacity
  } else if (input.length === 7) {
    //input format: "#aabbcc"
    output = input + opacity
  } else if (input.length === 9) {
    //input format: "#aabbccdd"
    output = input.slice(0,7) + opacity
  } else {
    console.log(`setOpacity: could not set opacity ${opacity} to string ${input}`)
    if (!defaultOutput) { output = input }
    else if (isValidFormat(defaultOutput)) { output = defaultOutput }
    else { output = BACKUP_DEFAULT_COLOR }
  }

  return output
}

export { setOpacity }