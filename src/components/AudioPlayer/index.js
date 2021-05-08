import React, { Component } from 'react'
import AudioControl from '../AudioControl';
import AudioBlock from '../AudioBlock';
import AudioTranscript from '../AudioTranscript';
import transcriptData from '../../transcripts/transcript.json';
import './AudioPlayer.css';
import { connect } from "react-redux";
import { loadAudio, loadTranscript } from '../../redux/actions'

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.url = '/59e106639d79684277df770d.wav';
    this.audio = new Audio(this.url);
  }

  componentDidMount () {
    this.audio.addEventListener('loadeddata', () => {
      this.props.loadAudio(this.audio.duration, this.audio);
      this.props.loadTranscript(transcriptData);
    });
  }

  componentDidUpdate () {
    const { play } = this.props;
    if (play) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  render () {
    return (
      <>
        <AudioControl />
        <AudioBlock />
        <AudioTranscript />
      </>
    )
  }
}

const mapStateToProps = state => {
  const { play } = state.controlAudio;
  return { play }
}

export default connect(mapStateToProps, {
  loadAudio,
  loadTranscript
})(AudioPlayer);