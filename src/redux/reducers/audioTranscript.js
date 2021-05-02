import { LOAD_TRANSCRIPT } from "../actionTypes";

const initialState = {
  startTimes: [],
  endTimes: [],
  transcriptData: []
};

const loadTranscript = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TRANSCRIPT: {
      return {
        ...state,
        ...action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export default loadTranscript;
