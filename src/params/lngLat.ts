import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string): param is `${string},${string}` => {
  return param.split(',').map(Number).filter(Number.isFinite).length === 2;
};
