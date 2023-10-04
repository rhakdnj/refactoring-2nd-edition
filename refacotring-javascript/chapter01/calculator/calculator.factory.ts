import { TragedyCalculator } from './tragedy.calculator';
import { ComedyCalculator } from './comedy.calculator';
import { PerformanceCalculator } from './performance.calculator';

export const createPerformanceCalculator = (performance: any, play: any) => {
  switch (play.type) {
    case 'tragedy':
      return new TragedyCalculator(performance, play);
    case 'comedy':
      return new ComedyCalculator(performance, play);
    default:
      return new PerformanceCalculator(performance, play);
  }
};
