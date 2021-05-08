import React, { Component } from 'react'
import { connect } from "react-redux";
import { playAudio, moveBackwardAction, moveForwardAction, controlPlaybackRate } from '../../redux/actions'
import classNames from 'classnames';
import './AudioControl.css';
const playBackRates = ['1.0', '1.5', '2.0'];
class AudioControl extends Component {

  render () {
    const { play, moveBackward, moveForward, playbackRateIndex } = this.props;
    return (
      <div className="audio-control my-6 mx-auto br-5 w-100">
        <div className="audio-control__controls-wrapper p-2">
          <i className={
            classNames({
              'audio-control__control-icons': true, 
              'icon-backward': true,
              'c-pointer': true,
              // 'audio-control__disabled': !moveBackward
            })
          } onClick={() => this.props.moveBackwardAction(moveBackward + 1)}></i>
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
              // 'audio-control__disabled': !moveForward
            })
          } onClick={() => this.props.moveForwardAction(moveForward + 1)}></i>
          <span 
            onClick={() => this.props.controlPlaybackRate(playbackRateIndex + 1)}
            className="audio-control__speed ml-1 p-0-5 c-pointer br-5">
              {playBackRates[playbackRateIndex % playBackRates.length]}x</span>
        </div>
        <button className="audio-control__share mr-2 br-5 c-pointer">Share</button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { play, moveForward, moveBackward, playbackRateIndex } = state.controlAudio;
  return { play, moveForward, moveBackward, playbackRateIndex };
}

export default connect(mapStateToProps, {
  playAudio,
  moveBackwardAction,
  moveForwardAction,
  controlPlaybackRate
})(AudioControl);