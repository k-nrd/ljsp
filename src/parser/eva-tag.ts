//@ts-ignore
import * as evaParser from './eva-parser'
import {List} from '../lib/types'

export default function evaTag(code: TemplateStringsArray): List {
  return evaParser.parse(code.raw[0])
}
