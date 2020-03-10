import React from 'react'
import { Button, Container } from 'semantic-ui-react'

import TimeInput from './TimeInput.jsx'
import TimeDisplay from './TimeDisplay.jsx'
import { dom } from '../js/core.js'

const TimerStates = {
  Start: 1,
  Pause: 2,
  Stop: 3
}

export default class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      componentState: TimerStates.Stop,
      secondDate: null,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      alarm: false,
      settings: {
        hours: 0,
        minutes: 10,
        seconds: 0,
      }
    }
  }

  componentDidMount() {
    const inputMinutes = dom.select('.time-display-input input.minutes')

    inputMinutes.focus()
    inputMinutes.selectionStart = 0
    inputMinutes.selectionEnd = 0
  }

  componentWillUnmount() {
    dom.removeClass(app, 'alarm')
    clearInterval(this.interval)
  }

  updateSettings(key, value) {
    var newSettings = Object.assign({}, this.state.settings)

    newSettings[key] = value
    this.setState({ settings: newSettings })

    // console.log(arguments, key, this.state.settings);
  }

  start() {
    if (this.state.componentState == TimerStates.Pause) {
      this.state.secondDate = new Date() - this.state.milliseconds
    } else {
      this.state.secondDate = new Date()
      this.reset()
    }
    this.interval = setInterval(() => this.tick(), 100)
    this.setState({
      componentState: TimerStates.Start,
      alarm: false
    })
  }
  pause() {
    clearInterval(this.interval)
    this.setState({
      componentState: TimerStates.Pause
    })
  }
  stop() {
    clearInterval(this.interval)
    this.reset()
    this.setState({
      componentState: TimerStates.Stop,
      alarm: false
    })
  }

  reset() {
    this.setState(state => ({
      hours: state.settings.hours,
      minutes: state.settings.minutes,
      seconds: state.settings.seconds,
      milliseconds: 0,
      alarm: false
    }))
    this.updateAlarm()
  }

  updateAlarm() {
    const app = dom.select('#app')

    if (this.state.alarm) {
      dom.toggleClass(app, 'alarm')
    } else {
      clearInterval(this.interval)
    }
  }

  tick() {
    const tickTime = new Date() - this.state.secondDate

    this.setState({
      milliseconds: tickTime % 1000
    })

    if (tickTime >= 1000) {
      this.state.secondDate = new Date() - tickTime % 1000
      this.state.seconds = this.state.seconds - 1

      if (this.state.seconds <= 0 && this.state.minutes <= 0 && this.state.hours <= 0) {
        this.pause()
        this.setState({
          alarm: true
        })
        this.interval = setInterval(() => this.updateAlarm(), 500)
      } else if (this.state.seconds < 0) {
        this.state.seconds = 59
        this.state.minutes = this.state.minutes - 1

        if (this.state.minutes < 0) {
          this.state.minutes = 59
          this.state.hours = this.state.hours - 1
        }
      }

      this.render()
    }
  }

  render() {
    const state = this.state.componentState

    if (!this.state.alarm)
      dom.removeClass(app, 'alarm')

    return (
      <Container fluid>
        <Container fluid className={
            state == TimerStates.Stop ? 'fade-in' : 'hide'
          }>
          <TimeInput
            settings={this.state.settings}
            update={this.updateSettings.bind(this)}
            start={this.start.bind(this)}
          />
        </Container>
        <Container className={
            state == TimerStates.Pause || state == TimerStates.Start
            ? 'fade-in' : 'hide'
          }>
          <TimeDisplay
            hours={this.state.hours}
            minutes={this.state.minutes}
            seconds={this.state.seconds}
          />
        </Container>
        <Container
          className={
            this.props.appState.uiActive || state != TimerStates.Start
            ? 'fade-in-hide' : 'fade-out-hide-center'
          }>
          <Button icon='play' labelPosition='left' color="green" content='Start' inverted
            className={state == TimerStates.Start ? 'hide' : 'fade-in'}
            onClick={() => this.start()}
          />
          <Button icon='pause' labelPosition='left' color="yellow" content='Pause' inverted
            className={
              state == TimerStates.Pause || state == TimerStates.Stop
              ? 'hide' : 'fade-in'
            }
            onClick={() => this.pause()}
          />
          <Button icon='stop' labelPosition='left' color="red" content='Stop' inverted
            className={state == TimerStates.Stop ? 'hide' : 'fade-in'}
            onClick={() => this.stop()}
          />
          <Button inverted
            className={state == TimerStates.Stop ? 'hide' : 'fade-in'}
            onClick={() => this.reset()}>Reset</Button>
        </Container>
      </Container>
    )
  }
}