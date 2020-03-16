import React from 'react'
import { Container, Header } from 'semantic-ui-react'

import { base } from '../js/core.js'

export default class TimeDisplay extends React.Component {
  render() {
    return (
      <Container fluid>
        <Header className="time-display" inverted>
          <span className={this.props.hours == 0 ? 'fade-out-hide' : 'fade-in'}>
            <TimeDisplaySegment segment={this.props.hours}/>:
          </span>
          <span className={
              this.props.minutes == 0 && this.props.hours == 0 ?
              'fade-out-hide' : 'fade-in'
            }>
            <TimeDisplaySegment
              segment={this.props.minutes}
              trailingZeros={this.props.hours != 0}
            />:
          </span>
          <TimeDisplaySegment
            segment={this.props.seconds}
            trailingZeros={this.props.hours != 0 || this.props.minutes != 0 }
          />
          {this.props.milliseconds || this.props.milliseconds == 0 ?
          <span className='fade-in'>
            .<TimeDisplaySegment
              segment={this.props.milliseconds}
              trailingZeros
              noAnimation
            />
          </span>
          : null}
        </Header>
      </Container>
    )
  }
}

class TimeDisplaySegment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: null,
      segment: [],
      digits: 2,
      tickTimeout: null
    }

    if (base.isEmpty(props.digits)) {
      for (var i = 0; i < 2; i++) {
        this.state.segment.push(this.initDigit())
      }
    } else {
      this.state.digits = props.digits
      for (var i = 0; i < props.digits; i++) {
        this.state.segment.push(this.initDigit())
      }
    }

    this.prevState = Object.assign({}, this.state)
  }

  initDigit() {
    return {
      char: '0',
      changed: false
    }
  }

  formatTime(time) {
    time = String(time)
    var output = time

    if (this.props.trailingZeros) {
      const zeros = this.state.digits - time.length

      for (var i = 0; i < zeros; i++) {
        output = '0' + output
      }
    }

    return output
  }

  update() {
    this.state.segment = []

    this.formatTime(this.props.segment).split('').forEach((char, i) => {
      this.updateDigit(this.state.segment, this.prevState.segment[i], char, i)
    })

    this.prevState = Object.assign({}, this.state)
  }

  updateDigit(segment, prevSegment, char, i) {
    if (this.props.noAnimation || prevSegment == undefined) {
      segment.push({
        char: char,
      })
    } else {
      const changed = (char != prevSegment.char)

      segment.push({
        char: char,
        changed: changed,
        prevChar: prevSegment.char
      })

      if (changed) {
        clearTimeout(this.state.tickTimeout)
        this.state.tickTimeout = setTimeout(function() {
          var updatedSegment = this.state.segment.slice()

          updatedSegment[i].changed = false
          this.setState({
            segment: updatedSegment
          })
        }.bind(this), 500)
      }
    }
  }

  render() {
    var index = 0

    if (this.props.segment != this.state.prevInput) {
      this.state.prevInput = this.props.segment
      this.update()
    }

    return this.state.segment.map(digit => {
      const key = index

      index++

      return (
        <span key={key} className={
            (digit.changed && !this.props.noAnimation ? 'tick ' : '')
            + 'time-display-digit'
          }>
          {this.props.noAnimation ? null :
            <span className='time-display-digit-old'>
              {digit.prevChar}
            </span>
          }
          <span className='time-display-digit-new'>
            {digit.char}
          </span>
        </span>
      )
    })
  }
}