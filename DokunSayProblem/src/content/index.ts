/**
 * DokunSay Problem — İÇERİK MOTORU dış API'si. Arayüz yalnız buradan import eder.
 * Sözleşme: ./types.ts (DESIGN §4).
 */
export * from './types';
export { generateProblem, generateSet } from './generate';
export type { SetOptions } from './generate';
export { SCHEMA_META, ROLE_LABEL } from './meta';
export type { SchemaMeta } from './meta';
export { equationOf, checkSchema, checkModel, checkEquation, checkAnswer, classifyWrongAnswer } from './evaluate';
export type { EqToken } from './evaluate';
export { hintFor, feedbackFor, selfTalk } from './hints';
export { renderAnswer, sentenceText, sentenceSpeech } from './text';
export {
  paraphraseFor, erroneousSolutionFor, unsolvableFor, reasonableItemsFor, remainderSetFor, wordTrapPairFor,
  posingPrompts, checkPosedProblem, POSING_FRAMES, fillFrame,
} from './modules';
export type { FillValues } from './posing';
export { VOCAB, vocabInSentence } from './vocab';
export type { VocabEntry } from './vocab';
export { MISCONCEPTIONS } from './misconceptions';
export type { Misconception } from './misconceptions';
export { LADDER } from './ladder';
export type { LadderStep } from './ladder';
export { GRADE_RULES, validateProblem, ALL_COMBOS, combosFor, isAllowed } from './curriculum';
export type { GradeRule, Combo } from './curriculum';
