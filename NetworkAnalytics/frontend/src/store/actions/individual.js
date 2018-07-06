import { ADD_MODULE } from './actionTypesIndividual';

export const addModule = (module) => {
  return {
    type: ADD_MODULE,
    module: module
  };
};
