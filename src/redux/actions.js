import { 
  LOAD_AUDIO,
  PLAY_AUDIO,
  LOAD_TRANSCRIPT,
  HIGHLIGHT_WORD,
  MOVE_FORWARD, 
  MOVE_BACKWARD,
  CONTROL_PLAYBACK
} from "./actionTypes";

export const loadAudio = (duration, elemRef) => ({
  type: LOAD_AUDIO,
  payload: {
    duration,
    elemRef
  }
});

export const playAudio = play => ({
  type: PLAY_AUDIO,
  payload: {
    play
  }
});

export const moveForwardAction = moveForward => ({
  type: MOVE_FORWARD,
  payload: {
    moveForward
  }
});

export const moveBackwardAction = moveBackward => ({
  type: MOVE_BACKWARD,
  payload: {
    moveBackward
  }
});

export const controlPlaybackRate = playbackRateIndex => ({
  type: CONTROL_PLAYBACK,
  payload: {
    playbackRateIndex
  }
});

export const loadTranscript = transcriptData => ({
  type: LOAD_TRANSCRIPT,
  payload: generatTranscriptData(transcriptData)
});


export const highlightWord = newObj => {
  return ({
    type: HIGHLIGHT_WORD,
    payload: newObj
  })
};

function generatTranscriptData (transcriptData) {
  let { word_timings } = transcriptData;
  const aggregateBlockData = {
    speaker1: [],
    speaker2: []
  };
  word_timings = word_timings.map((speakerTranscript, speakerIndex) => {
    const parseSeconds = (time) => Number(time.replace(/s$/i, ''));
    const startTime = parseSeconds(speakerTranscript[0].startTime);
    const endTime = parseSeconds(speakerTranscript[speakerTranscript.length - 1].endTime);
    if (speakerIndex % 2 === 0) {
      aggregateBlockData.speaker1.push({startTime, endTime});
    } else {
      aggregateBlockData.speaker2.push({startTime, endTime});
    }
    return speakerTranscript.map(word => {
      return {
        ...word,
        startTime: parseSeconds(word.startTime),
        endTime: parseSeconds(word.endTime)
      }
    })
  });
  // console.log('aggregateBlockData', word_timings);
  return {
    transcriptData: word_timings,
    aggregateData: aggregateBlockData
  }
}