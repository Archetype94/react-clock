import React from 'react'
import { Button, Container } from 'semantic-ui-react'

import TimeDisplay from './TimeDisplay.jsx'

const StopwatchStates = {
  Start: 1,
  Pause: 2,
  Stop: 3
}

// TODO: Add Space/Enter onKeyUp event to Start/Stop 
export default class Stopwatch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      componentState: StopwatchStates.Stop,
      secondDate: null,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  start() {
    if (this.state.componentState == StopwatchStates.Pause) {
      this.state.secondDate = new Date() - this.state.milliseconds
    } else {
      this.state.secondDate = new Date()
    }
    this.interval = setInterval(() => this.tick(), 10)
    this.setState({
      componentState: StopwatchStates.Start
    })
  }
  pause() {
    clearInterval(this.interval)
    this.setState({
      componentState: StopwatchStates.Pause
    })
  }
  stop() {
    clearInterval(this.interval)
    this.reset()
    this.setState({
      componentState: StopwatchStates.Stop
    })
  }

  reset() {
    this.setState({
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    })
  }

  tick() {
    const tickTime = new Date() - this.state.secondDate

    this.setState({
      milliseconds: tickTime % 1000
    })

    if (tickTime >= 1000) {
      this.state.secondDate = new Date() - tickTime % 1000
      this.setState(state => ({
        seconds: state.seconds + 1
      }))

      if (this.state.seconds >= 60) {
        this.setState(state => ({
          seconds: 0,
          minutes: state.minutes + 1
        }))

        if (this.state.minutes >= 60) {
          this.setState(state => ({
            minutes: 0,
            hours: state.hours + 1
          }))
        }
      }
    }
  }

  render() {
    const state = this.state.componentState

    return (
      <Container fluid>
        <TimeDisplay
          hours={this.state.hours}
          minutes={this.state.minutes}
          seconds={this.state.seconds}
          milliseconds={Math.floor(this.state.milliseconds / 10)}
        />
        <Container
          className={
            this.props.appState.uiActive || state != StopwatchStates.Start
            ? 'fade-in-hide' : 'fade-out-hide-center'
          }>
          <Button icon='play' labelPosition='left' color="green" content='Start' inverted
            className={state == StopwatchStates.Start ? 'hide' : 'fade-in'}
            onClick={() => this.start()}
          />
          <Button icon='pause' labelPosition='left' color="yellow" content='Pause' inverted
            className={
              state == StopwatchStates.Pause || state == StopwatchStates.Stop
              ? 'hide' : 'fade-in'
            }
            onClick={() => this.pause()}
          />
          <Button icon='stop' labelPosition='left' color="red" content='Stop' inverted
            className={state == StopwatchStates.Stop ? 'hide' : 'fade-in'}
            onClick={() => this.stop()}
          />
          <Button inverted
            onClick={() => this.reset()}>Reset</Button>
        </Container>
      </Container>
    )
  }
}