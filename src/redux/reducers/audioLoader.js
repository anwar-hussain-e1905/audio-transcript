import { LOAD_AUDIO } from "../actionTypes";

const initialState = {
  duration: 0,
  elemRef: null
};

const loadAudio = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_AUDIO: {
      const { duration, elemRef } = action.payload;
      return {
        ...state,
        duration,
        elemRef
      };
    }
    default: {
      return state;
    }
  }
};

export default loadAudio;
