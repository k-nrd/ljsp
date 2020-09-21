import * as Parser from './ljsp-parser'

export default function ljspTag (code) {
  return Parser.parse(`(begin ${code.raw[0]})`)
}
