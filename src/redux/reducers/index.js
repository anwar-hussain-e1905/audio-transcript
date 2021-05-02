import { combineReducers } from 'redux';
import audio from './audioLoader';
import controlAudio from './controlAudio'
import transcript from './audioTranscript'

export default combineReducers({ audio, controlAudio, transcript });
