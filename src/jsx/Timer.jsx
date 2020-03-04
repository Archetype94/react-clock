import React from 'react'
import InputMask from 'react-input-mask'
import { Button, Container } from 'semantic-ui-react'
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
      setHours: 0,
      setMinutes: 0,
      setSeconds: 0,
      alarm: false
    }
  }

  componentDidMount() {
    const inputMinutes = dom.select('.time-display-input input[name=setMinutes]')

    inputMinutes.focus()
    inputMinutes.selectionStart = 0
    inputMinutes.selectionEnd = 0
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  start() {
    if (this.state.componentState == TimerStates.Pause) {
      this.state.secondDate = new Date() - this.state.milliseconds
    } else {
      this.state.secondDate = new Date()
      this.reset()
    }
    this.interval = setInterval(() => this.tick(), 10)
    this.setState(() => ({
      componentState: TimerStates.Start,
      alarm: false
    }))
  }
  pause() {
    clearInterval(this.interval)
    this.setState(() => ({
      componentState: TimerStates.Pause
    }))
  }
  stop() {
    clearInterval(this.interval)
    this.reset()
    this.setState(() => ({
      componentState: TimerStates.Stop,
      alarm: false
    }))
  }

  reset() {
    this.setState(state => ({
      hours: state.setHours,
      minutes: state.setMinutes,
      seconds: state.setSeconds,
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
      dom.removeClass(app, 'alarm')
      clearInterval(this.interval)
    }
  }

  tick() {
    const
      tickTime = new Date() - this.state.secondDate,
      milliseconds = this.state.milliseconds,
      seconds = this.state.seconds,
      minutes = this.state.minutes,
      hours = this.state.hours

    this.setState(state => ({
      milliseconds: tickTime % 1000
    }))

    if (tickTime >= 1000) {
      this.state.secondDate = new Date() - tickTime % 1000

      if (
        seconds <= 0 &&
        minutes <= 0 &&
        hours <= 0
      ) {
        this.pause()
        this.setState(() => ({ alarm: true }))
        this.interval = setInterval(() => this.updateAlarm(), 500)
      } else {
        this.setState(() => ({
          seconds: seconds - 1
        }))

        if (seconds <= 0) {
          this.setState(() => ({
            seconds: 59,
            minutes: minutes - 1
          }))

          if (minutes <= 0) {
            this.setState(() => ({
              minutes: 59,
              hours: hours - 1
            }))
          }
        }
      }
    }
  }

  beforeMaskedValueChange = (newState, oldState, userInput) => {
    const { value } = newState
    const selection = newState.selection

    if (userInput) {
      const
        newSelection = selection ? selection.start : null,
        oldSelection = oldState.selection ? oldState.selection.start : null

      if (newSelection == 2 && oldSelection == 1) {
        const
          allInputs = dom.selectAll('.time-display-input input'),
          nextInputIndex = (() => {
            for (let i = 0; i < allInputs.length; i++) {
              if (allInputs[i] == document.activeElement) {
                return i + 1
              }
            }
          })(),
          nextInput = nextInputIndex < allInputs.length ? allInputs[nextInputIndex] : null

        if (nextInput) {
          nextInput.select()
        }
      }
    }

    return {
      value,
      selection
    }
  }

  onChange = (event) => {
    const
      target = event.target,
      value = target.type === 'checkbox' ? target.checked : target.value,
      name = target.name

    this.setState({
      [name]: value
    })
  }

  onKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const
        allInputs = dom.selectAll('.time-display-input input'),
        target = event.target,
        targetSelectionIndex = target.selectionStart,
        equalsTarget = (element) => element == target

      var
        nextInputIndex,
        nextInput

      if (event.key === 'ArrowLeft' && targetSelectionIndex == 0) {
        nextInputIndex = Array.from(allInputs).findIndex(equalsTarget) - 1
      } else if (event.key === 'ArrowRight' && targetSelectionIndex == target.value.length) {
        nextInputIndex = Array.from(allInputs).findIndex(equalsTarget) + 1
      }

      nextInput = nextInputIndex < allInputs.length ? allInputs[nextInputIndex] : null
      if (nextInput) {
        nextInput.select()
      }
    }
  }

  renderInput(segment) {
    return (
      <div className="ui input">
        <InputMask
          mask="99"
          maskChar="0"
          alwaysShowMask={true}
          name={segment}
          onKeyUp={this.onKeyDown}
          onChange={this.onChange}
          beforeMaskedValueChange={this.beforeMaskedValueChange}
        />
      </div>
    )
  }

  render() {
    return (
      <Container fluid>
        <Container fluid className={
            (this.state.componentState == TimerStates.Stop
            ? 'fade-in' : 'hide') + ' time-display-input'
          }>
          {this.renderInput('setHours')}:{this.renderInput('setMinutes')}:{this.renderInput('setSeconds')}
        </Container>
        <Container className={
            this.state.componentState == TimerStates.Pause
            || this.state.componentState == TimerStates.Start
            ? 'fade-in' : 'hide'
          }>
          <TimeDisplay
            hours={this.state.hours}
            minutes={this.state.minutes}
            seconds={this.state.seconds}
          />
        </Container>
        <Container
          className={this.props.appState.uiActive || this.state.componentState != TimerStates.Start ? 'fade-in-hide' : 'fade-out-hide-center'}>
          <Button icon='play' labelPosition='left' color="green" content='Start' inverted
            className={
              this.state.componentState == TimerStates.Start
              ? 'hide' : 'fade-in'
            }
            onClick={() => this.start()}
          />
          <Button icon='pause' labelPosition='left' color="yellow" content='Pause' inverted
            className={
              this.state.componentState == TimerStates.Pause
              || this.state.componentState == TimerStates.Stop
              ? 'hide' : 'fade-in'
            }
            onClick={() => this.pause()}
          />
          <Button icon='stop' labelPosition='left' color="red" content='Stop' inverted
            className={
              this.state.componentState == TimerStates.Stop
               ? 'hide' : 'fade-in'
            }
            onClick={() => this.stop()}
          />
          <Button inverted
            className={
              this.state.componentState == TimerStates.Stop
              ? 'hide' : 'fade-in'
            }
            onClick={() => this.reset()}>Reset</Button>
        </Container>
      </Container>
    )
  }
}