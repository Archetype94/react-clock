import React from 'react'
import TimeDisplay from './TimeDisplay.jsx'

export default class Time extends React.Component {
  constructor(props) {
    const time = new Date()

    super(props)
    this.state = {
      hours: time.getHours(),
      minutes: time.getMinutes(),
      seconds: time.getSeconds()
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  tick() {
    const time = new Date()

    this.setState(state => ({
      hours: time.getHours(),
      minutes: time.getMinutes(),
      seconds: time.getSeconds()
    }))
  }

  render() {
    return (
      <TimeDisplay
        hours={this.state.hours}
        minutes={this.state.minutes}
        seconds={this.state.seconds}
      />
    )
  }
}