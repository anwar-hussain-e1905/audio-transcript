import React, { Component } from 'react'
import { connect } from "react-redux";
import { playAudio, highlightWord } from '../../redux/actions';
import classNames from 'classnames';
import './AudioBlock.css';
const FORWARD_BACKWARD_TIME = 2; // In seconds
class AudioBlock extends Component {
  constructor(props) {
    super(props);
    this.animateProgress = this.animateProgress.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.statusRef = React.createRef();
    this.currentTimeRef = React.createRef();
    this.isHighlightStarted = false;
    // Find the exact transcript word in 0(nlogn) complexity while audio playing
    this.nextSpeakerIndex = 0;
    this.nextWordIndex = 0;
    // helps t find exact transcript word on audio time change
    this.renderTranscriptSpeaker = 0;
    this.renderTranscriptWord = 0;
    this.reachedEnd = false;
  }

  componentDidUpdate () {
    this.renderTranscriptSpeaker = 0;
    this.renderTranscriptWord = 0;
    this.registerEndEvent();
    const { play } = this.props;
    if (play) {
      this.rafId = requestAnimationFrame(this.animateProgress.bind(this));
    }
  }

  registerEndEvent () {
    if (this.endEvent) return false;
    this.props.elemRef && this.props.elemRef.addEventListener('ended', () => {
      // Reset Transcript
      this.nextSpeakerIndex = 0;
      this.nextWordIndex = 0;
      this.props.playAudio(false);
    });
    this.endEvent = true;
  }

  animateProgress (forceUpdate = false) {
    const currentSpeaker = this.nextSpeakerIndex;
    const currentWord = this.nextWordIndex;
    const { duration, elemRef, play, transcriptData } = this.props;
    const currentTime = elemRef.currentTime;
    const completed = ((currentTime/duration) * 100).toFixed(2);
    const speakerConv = transcriptData[this.nextSpeakerIndex];
    const nextWord = speakerConv && speakerConv[this.nextWordIndex];
    const lastSpeaker = transcriptData[transcriptData.length - 1];
    const updateNextSpeaker = () => {
      if (speakerConv.length - 1 === this.nextWordIndex) {
        this.nextSpeakerIndex++;
        this.nextWordIndex = 0;
      } else {
        this.nextWordIndex++;
      }
    };
    const dispatchNextHighlight = () => {
      if (!this.isHighlightStarted) {
        this.isHighlightStarted = true;
        this.props.highlightWord(transcriptData[0][0]);
      } else if (currentWord !== this.nextWordIndex) {
        this.props.highlightWord(transcriptData[currentSpeaker][currentWord]);
      }
    }
    if (nextWord) {
      if (currentTime >= nextWord.startTime && currentTime <= nextWord.endTime) {
        updateNextSpeaker();
        dispatchNextHighlight();
      } else if (currentTime > nextWord.endTime) {
        updateNextSpeaker();
        dispatchNextHighlight();
      }
    } else if (!this.reachedEnd && currentTime >= lastSpeaker[lastSpeaker.length - 1].endTime) {
      this.reachedEnd = !this.reachedEnd;
      this.props.highlightWord({endReached: true});
    }
    if (this.statusRef && this.statusRef.current) {
      this.statusRef.current.style.width = `${completed}%`;
    }
    if (this.currentTimeRef && this.currentTimeRef.current) {
      this.currentTimeRef.current.innerText = currentTime.toFixed(2);
    }
    if ((play || forceUpdate) && completed < 100) {
      this.rafId = requestAnimationFrame(this.animateProgress.bind(this));
    } else {
      cancelAnimationFrame(this.rafId);
    }
  }

  getNextWordIndex(direction, checkTime, speakerIndex, wordIndex) {
    const { transcriptData } = this.props;
    const speakerConv = transcriptData[speakerIndex];
    const nextWord = speakerConv && speakerConv[wordIndex];
    if (nextWord && !(checkTime >= nextWord.startTime && checkTime <= nextWord.endTime)) {
      if (direction === 'up') {
        wordIndex++;
        if (wordIndex === speakerConv.length) {
          wordIndex = 0;
          speakerIndex++;
        }
      } else {
        wordIndex--;
        if (wordIndex === -1) {
          speakerIndex--;
          const speakerConv = transcriptData[speakerIndex];
          if (speakerConv) {
            wordIndex = speakerConv.length - 1;
          }
        }
      }
      this.getNextWordIndex(direction, checkTime, speakerIndex, wordIndex);
    } else if (nextWord) { // When match found
      this.nextSpeakerIndex = speakerIndex;
      this.nextWordIndex = wordIndex;
    } else {
      const findSpeakerConv = transcriptData.find((words, index) => {
        if (checkTime < words[0].startTime) {
          this.nextSpeakerIndex = index;
          return true;
        } else {
          return false;
        }
      });
      if (findSpeakerConv) {
        this.nextWordIndex = 0;
      } else {
        this.nextSpeakerIndex = transcriptData.length - 1;
        this.nextWordIndex = this.nextSpeakerIndex.length - 1;
      }
    }
  }

  getSnapshotBeforeUpdate (prevProps) {
    const { moveForward, moveBackward, playbackRateIndex, elemRef } = this.props;
    if (prevProps.moveForward !== moveForward) {
      elemRef.currentTime += FORWARD_BACKWARD_TIME;
      this.getNextWordIndex('up', elemRef.currentTime, this.nextSpeakerIndex, this.nextWordIndex);
      this.animateProgress(true);
    } else if (prevProps.moveBackward !== moveBackward) {
      elemRef.currentTime -= FORWARD_BACKWARD_TIME;
      this.getNextWordIndex('down', elemRef.currentTime, this.nextSpeakerIndex, this.nextWordIndex);
      this.animateProgress(true);
    }
    // Contorl Playback Rate
    if (prevProps.playbackRateIndex !== playbackRateIndex) {
      elemRef.playbackRate = 1 + (0.5 * (playbackRateIndex % 3));
    }
    return null;
  }

  changeTime (e) {
    const { elemRef } = this.props;
    const target = e.nativeEvent.target;
    const { time, transcriptIndex } = target.dataset; 
    if (time) {
      if (transcriptIndex) {
        const spakerAndWord = transcriptIndex.split('|');
        this.nextSpeakerIndex = Number(spakerAndWord[0]) || 0;
        this.nextWordIndex = Number(spakerAndWord[1]) || 0;
      }
      elemRef.currentTime = time;
      this.animateProgress(true);
    }
  }

  componentWillUnmount () {
    //  Cancel the animation frame when component destroy
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  // Get the transcript word while changing time to find in 0(1) complexity
  getTranscritpIndex (checkTime, isEmptyBlock, i) {
    if (isEmptyBlock) return ''; // For Optimization
    const { transcriptData } = this.props;
    const speakerConv = transcriptData[this.renderTranscriptSpeaker];
    const nextWord = speakerConv && speakerConv[this.renderTranscriptWord];
    const returnIndex = `${this.renderTranscriptSpeaker}|${this.renderTranscriptWord}`;
    if (nextWord) {
      if (checkTime >= nextWord.startTime && checkTime <= nextWord.endTime) {
        if (checkTime === nextWord.endTime) {
          if (this.renderTranscriptWord < speakerConv.length - 1) {
            this.renderTranscriptWord++;
          }
        }
        return returnIndex;
      } else if (checkTime < nextWord.startTime){
        return returnIndex;
      } else if (checkTime > nextWord.endTime) {
        if (this.renderTranscriptWord === speakerConv.length - 1) {
          this.renderTranscriptSpeaker++;
          this.renderTranscriptWord = 0;
        } else {
          this.renderTranscriptWord++;
        }
        this.getTranscritpIndex(...arguments);
      }
    } else {
      // Fallback : end Rached | Finding error while running test until the condition is robust
      return returnIndex;
    }
  }

  render () {
    const { duration, aggregateData } = this.props;
    let totalBlocks = duration;
    // Default block counts on 1s interval
    let multiplier = 1;
    if (duration < 20) {
      // Chunk blocks to 0.1 interval when duration is less than 20
      totalBlocks *= 10;
      multiplier = 0.1;
    } else if (duration < 60) {
      // Chunk blocks to 0.5 interval when duration is less than 60
      totalBlocks *= 2;
      multiplier = 0.5;
    }
    const isEmptyBlock =  (speakerType, checkTime) => {
      const isVisible = aggregateData[speakerType].some(x => {
        if (checkTime >= x.startTime && checkTime <= x.endTime) {
          return true;
        }
        return false;
      });
      return !isVisible;
    };
    const blocks = new Array(Math.ceil(totalBlocks)).fill('');
    const generateBlocks = (speakerType) => {
        return blocks.map((v,i) => {
          const blockTime = Math.round((i * multiplier) * 10) / 10
          const checkEmptyBlock = isEmptyBlock(speakerType, i * multiplier);
          return (
            <span 
              key={i}
              data-time={blockTime}
              data-transcript-index={this.getTranscritpIndex(blockTime, checkEmptyBlock, i)}
              title={(i * multiplier).toFixed(2) + 's' }
              className={classNames({
                'audio-block__block': true,
                'audio-block__empty': checkEmptyBlock
              })}></span>
          ) 
        }
        )
    };
    const separator = (isLast = false) => (
      <>
        <div className={classNames({
            'audio-block__separator': true,
            'audio-block__separator--last': isLast
          })}></div>
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
          <div className="audio-block__render audio-block__render--progress"></div>
          <div
            className="audio-block__render audio-block--completed-state"
            ref={this.statusRef}></div>
          <div className="audio-block__block-wrapper">
            <div className="audio-block__one">
              { generateBlocks('speaker1') }
            </div>
            <div className="audio-block--break"></div>
            { separator() }
            <div className="audio-block--break"></div>
            { separator(true) }
            <div className="audio-block__two">
              { generateBlocks('speaker2') }
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
  const { aggregateData, transcriptData } = state.transcript;
  const { play, moveForward, moveBackward, playbackRateIndex } = state.controlAudio;
  return { duration,
           elemRef,
           play,
           moveForward,
           moveBackward,
           playbackRateIndex,
           aggregateData,
           transcriptData
          };
}

export default connect(mapStateToProps, {
  playAudio,
  highlightWord
})(AudioBlock);