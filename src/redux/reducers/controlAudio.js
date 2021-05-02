import { PLAY_AUDIO } from "../actionTypes";

const initialState = {
  play: false,
  moveBackward: false,
  moveForward: true
};

const controlAudio = (state = initialState, action) => {
  switch (action.type) {
    case PLAY_AUDIO: {
      const { play } = action.payload;
      return {
        ...state,
        play
      };
    }
    default: {
      return state;
    }
  }
};

export default controlAudio;
