//@ts-ignore
import * as Parser from './eva-parser'
import {List} from '../lib/types'

export default function evaTag (code: TemplateStringsArray): List {
  return Parser.parse(`(begin ${code.raw[0]})`)
}
