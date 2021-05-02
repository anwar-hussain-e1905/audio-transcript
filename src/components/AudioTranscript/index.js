import React, { Component } from 'react'
import classNames from 'classnames';
import './AudioTranscript.css';
import Word from './Word';
import { connect } from "react-redux";

class AudioTranscript extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    const { transcriptData } = this.props;
    console.log('transcriptData', transcriptData);
    return (
      <div className="audio-transcript__wrapper mx-auto">
        <input 
          className="audio-transcript__search p-1-5 br-5"
          type="text" 
          placeholder="Search call transcript..." />
        {
          transcriptData.map((speaker, speakerIndex) => (
            <div className="audio-transcript__speaker-wrapper p-4 my-1 br-5">
              <div className={classNames({
                'audio-transcript__start-duration': true,
                'audio-transcript__start-duration--one': !speakerIndex % 2,
                'audio-transcript__start-duration--two': speakerIndex % 2,
                'mr-4': true,
                'pr-4': true
              })}>
                { speaker[0].startTime }
              </div>
              <div className="audio-transcript__seperator">
              </div>
              <div className="audio-transcript__speaker-data">
                { speaker.map((v, i) => <Word key={i} {...v} /> ) }
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { transcriptData } = state.transcript;
  return { transcriptData }
}

export default connect(mapStateToProps)(AudioTranscript);