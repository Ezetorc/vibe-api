import { ParsedQs } from 'qs';
export type Query = string | ParsedQs | (string | ParsedQs)[] | undefined;
