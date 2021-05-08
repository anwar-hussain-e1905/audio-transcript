import { PLAY_AUDIO, MOVE_FORWARD, MOVE_BACKWARD, CONTROL_PLAYBACK } from "../actionTypes";

const initialState = {
  play: false,
  playbackRateIndex: 0,
  moveBackward: 0,
  moveForward: 0
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
    case MOVE_FORWARD: {
      const { moveForward } = action.payload;
      return {
        ...state,
        moveForward
      };
    }
    case MOVE_BACKWARD: {
      const { moveBackward } = action.payload;
      return {
        ...state,
        moveBackward
      };
    }
    case CONTROL_PLAYBACK: {
      const { playbackRateIndex } = action.payload;
      return {
        ...state,
        playbackRateIndex
      };
    }
    default: {
      return state;
    }
  }
};

export default controlAudio;
