import { LOAD_AUDIO, PLAY_AUDIO, LOAD_TRANSCRIPT } from "./actionTypes";

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

export const loadTranscript = transcriptData => ({
  type: LOAD_TRANSCRIPT,
  payload: {
    transcriptData: transcriptData.word_timings    
  }
});
