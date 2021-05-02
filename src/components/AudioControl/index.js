import React, { Component } from 'react'
import { connect } from "react-redux";
import { playAudio } from '../../redux/actions'
import classNames from 'classnames';
import './AudioControl.css';

class AudioControl extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    const { play, moveBackward, moveForward } = this.props;
    return (
      <div className="audio-control my-6 mx-auto br-5 w-100">
        <div className="audio-control__controls-wrapper p-2">
          <i className={
            classNames({
              'audio-control__control-icons': true, 
              'icon-backward': true,
              'c-pointer': true,
              'audio-control__disabled': !moveBackward
            })
          }></i>
          <i className={
            classNames({
              'audio-control__control-icons': true, 
              'audio-control__play-pause': true,
              'c-pointer': true,
              'icon-play': !this.props.play,
              'icon-pause': this.props.play
            })
          } onClick={() => this.props.playAudio(!play)}></i>
          <i className={
            classNames({
              'audio-control__control-icons': true, 
              'icon-forward': true,
              'c-pointer': true,
              'audio-control__disabled': !moveForward
            })
          }></i>
          <span className="audio-control__speed ml-1 p-0-5 c-pointer br-5">1.0x</span>
        </div>
        <button className="audio-control__share mr-2 br-5 c-pointer">Share</button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { play, moveBackward, moveForward } = state.controlAudio;
  return { play, moveBackward, moveForward };
}

export default connect(mapStateToProps, {
  playAudio
})(AudioControl);