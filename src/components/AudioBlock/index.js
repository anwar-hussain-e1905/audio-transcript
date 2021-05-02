import React, { Component } from 'react'
import { connect } from "react-redux";
import { playAudio } from '../../redux/actions'
import './AudioBlock.css';

class AudioBlock extends Component {
  constructor(props) {
    super(props);
    this.animateProgress = this.animateProgress.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.statusRef = React.createRef();
    this.currentTimeRef = React.createRef();
  }

  componentDidUpdate () {
    this.registerEndEvent();
    const { play, elemRef } = this.props;
    if (play) {
      this.rafId = requestAnimationFrame(this.animateProgress.bind(this));
    }
  } 

  registerEndEvent () {
    if (this.endEvent) return false;
    this.props.elemRef.addEventListener('ended', () => {
      this.props.playAudio(false);
    });
    this.endEvent = true;
  }

  animateProgress (forceUpdate = false) {
    const { duration, elemRef, play } = this.props;
    const completed = ((elemRef.currentTime/duration) * 100).toFixed(2);
    if (this.statusRef && this.statusRef.current) {
      this.statusRef.current.style.width = `${completed}%`;
    }
    if (this.currentTimeRef && this.currentTimeRef.current) {
      this.currentTimeRef.current.innerText = elemRef.currentTime.toFixed(2);
    }
    if ((play || forceUpdate) && completed < 100) {
      this.rafId = requestAnimationFrame(this.animateProgress.bind(this));
    } else {
      cancelAnimationFrame(this.rafId);
    }
  }

  changeTime (e) {
    const { elemRef } = this.props;
    const target = e.nativeEvent.target;
    const targetDataset = target.dataset;
    if (targetDataset.time) {
      elemRef.currentTime = targetDataset.time;
      this.animateProgress(true);
    }
  }

  componentWillUnmount () {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  render () {
    const { duration, ref } = this.props;
    let totalBlocks = duration;
    let multiplier = 1;
    if (duration < 60) {
      totalBlocks *= 10;
      multiplier = 0.1;
    }
    const blocks = new Array(Math.ceil(totalBlocks)).fill('');
    const generateBlocks = () => {
        return blocks.map((v,i) => (
          <span 
            key={i}
            data-time={(i * multiplier)}
            title={(i * multiplier).toFixed(2) + 's' }
            className="audio-block__block"></span>
        ))
    };
    const separator = () => (
      <>
        <div className="audio-block__separator"></div>
        <div className="audio-block--break"></div>
      </>
    );
    return (
      <>
        <div className="audio-duration-wrapper mx-auto">
          <div className="audio-duration-status p-0-5 br-5">
            <span ref={this.currentTimeRef}>0:00</span> / {duration.toFixed(2)}
          </div>
        </div>
        <div className="audio-block my-6 mx-0">
          <div onClick={this.changeTime} className="audio-block__inner-wrapper">
          <div className="audio-block__render"></div>
          <div className="audio-block__render audio-block__render--two"></div>
          <div
            className="audio-block__render audio-block--completed-state"
            ref={this.statusRef}></div>
          <div className="audio-block__block-wrapper">
            <div className="audio-block__one">
              { generateBlocks() }
            </div>
            <div className="audio-block--break"></div>
            { separator() }
            <div className="audio-block__two">
              { generateBlocks() }
            </div>
          </div>
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = state => {
  const { duration, elemRef } = state.audio;
  const { play } = state.controlAudio;
  return { duration, elemRef, play }
}

export default connect(mapStateToProps, {
  playAudio
})(AudioBlock);