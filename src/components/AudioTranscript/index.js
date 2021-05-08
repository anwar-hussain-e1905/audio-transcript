import React, { Component } from 'react'
import classNames from 'classnames';
import './AudioTranscript.css';
import Word from './Word';
import { connect } from "react-redux";
// const highlightColor = '#81cdf9';
class AudioTranscript extends Component {

  shouldComponentUpdate (nextProps) {
    const { highlightWord } = nextProps;
    if (Object.keys(highlightWord).length > 0) {
      document.querySelectorAll('span.active').forEach(item => item.classList.remove('active'));
      if (!highlightWord.endReached) {
        document.querySelectorAll(`span[data-start="${ highlightWord.startTime }"]`).forEach(item => item.classList.add('active'));
      }
      return false;
    }
    return true;
  }

  render () {
    const { transcriptData } = this.props;
    return (
      <div className="audio-transcript__wrapper mx-auto">
        {/* <style scoped>
          {`span[data-start="${ highlightWord.startTime }"] { background-color: ${highlightColor}; }`}
        </style> */}
        <input 
          className="audio-transcript__search p-1-5 br-5"
          type="text" 
          placeholder="Search call transcript..." />
        {
          transcriptData.map((speaker, speakerIndex) => (
            <div className={ classNames({
              'audio-transcript__speaker-wrapper': true,
              'audio-transcript__start-duration--one': !speakerIndex % 2,
              'audio-transcript__start-duration--two': speakerIndex % 2,
              'p-4': true,
              'my-1': true,
              'br-5': true
            })} key={speakerIndex}>
              <div className="audio-transcript__start-duration mr-4 pr-4">
                { speaker[0].startTime.toFixed(2) }
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
  const { transcriptData, highlightWord} = state.transcript;
  return { transcriptData, highlightWord }
}

export default connect(mapStateToProps)(AudioTranscript);