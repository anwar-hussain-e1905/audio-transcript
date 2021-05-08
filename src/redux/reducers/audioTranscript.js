import { LOAD_TRANSCRIPT, HIGHLIGHT_WORD } from "../actionTypes";

const initialState = {
  startTimes: [],
  endTimes: [],
  highlightWord: {},
  transcriptData: [],
  aggregateData: {
    speaker1: [],
    speaker2: []
  }
};

const loadTranscript = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TRANSCRIPT: {
      return {
        ...state,
        ...action.payload
      };
    }
    case HIGHLIGHT_WORD: {
      return {
        ...state,
        highlightWord: action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export default loadTranscript;
