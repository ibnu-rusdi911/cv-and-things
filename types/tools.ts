// types/tools.ts
  
export interface Winner {
    name: string;
    timestamp: string;
  }
  
  export interface RandomNamePickerState {
    names: string[];
    inputText: string;
    isSpinning: boolean;
    currentDisplay: string;
    winners: Winner[];
    numberOfWinners: number;
    removeAfterPick: boolean;
    showConfetti: boolean;
  }