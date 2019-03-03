import { expect } from 'chai';
import {
  createAction,
  combineReducers,
  ofType,
  createReducer,
  withConfig,
} from './redux-fluent';


describe('redux-fluent', () => {
  describe('Smoke Test', () => {
    it('should export a function { createAction }', () => {
      expect(createAction)
        .to.be.a('function');
    });

    it('should export a function { combineReducers }', () => {
      expect(combineReducers)
        .to.be.a('function');
    });

    it('should export a function { ofType }', () => {
      expect(ofType)
        .to.be.a('function');
    });

    it('should export a function { createReducer }', () => {
      expect(createReducer)
        .to.be.a('function');
    });

    it('should export a function { withConfig }', () => {
      expect(withConfig)
        .to.be.a('function');
    });
  });
});
