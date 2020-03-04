import { dom, browser } from './js/core.js'
if (browser.isTerrible() && !browser.supportsObjectFunctions()) {
  var body = dom.select('body')
  body.innerHTML = '<div id="browser-warning">Your web browser is not good! Please consider updating it or using a better one, otherwise this page (and many others) may not load correctly!</div>' + body.innerHTML
}

//import '../semantic/dist/semantic.css'
import '../semantic/dist/components/reset.css'
import '../semantic/dist/components/site.css'
import '../semantic/dist/components/container.css'
import '../semantic/dist/components/button.css'
import '../semantic/dist/components/icon.css'
import '../semantic/dist/components/segment.css'
import '../semantic/dist/components/checkbox.css'
import '../semantic/dist/components/input.css'
import '../semantic/dist/components/header.css'
import './scss/style.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  Container,
  Button,
  Icon,
  Segment,
}
from 'semantic-ui-react'
import Time from './jsx/Time.jsx'
import Stopwatch from './jsx/Stopwatch.jsx'
import Timer from './jsx/Timer.jsx'
import Checkbox from './jsx/Checkbox.jsx'

const AppStates = {
  None: 0,
  Time: 1,
  Stopwatch: 2,
  Timer: 3,
  Settings: 4
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      componentState: AppStates.Timer,
      uiActive: true
    }
  }

  componentDidMount() {
    var mousemoveTimeout

    dom.select('#app').addEventListener('mousemove', function(e) {
      this.setState(state => ({
        uiActive: true
      }))

      clearTimeout(mousemoveTimeout);
      mousemoveTimeout = setTimeout(() => {
        if (dom.select('button:hover') == undefined && this.state.componentState) {
          this.setState(state => ({
            uiActive: false
          }))
        }
      }, 3000)
    }.bind(this))
  }

  setComponentState(componentState) {
    this.setState(state => state.componentState = componentState)
  }

  render() {
    return (
      <Container fluid className={this.state.uiActive ? "ui-active" : "ui-inactive"}>
        <Container fluid className={this.state.uiActive ? "fade-in" : "fade-out-hide-center"}>
          <Button.Group>
            <Button inverted onClick={() => this.setComponentState(AppStates.Time)}>
              <Icon name="time"/>Time
            </Button>
            <Button inverted onClick={() => this.setComponentState(AppStates.Stopwatch)}>
              <Icon name="stopwatch"/>Stopwatch
            </Button>
            <Button inverted onClick={() => this.setComponentState(AppStates.Timer)}>
              <Icon name="alarm"/>Timer
            </Button>
            {/* <Button inverted onClick={() => this.setComponentState(AppStates.Alarm)}>
              <Icon name="alarm"/>Alarm
            </Button>
            <Button inverted onClick={() => this.setComponentState(AppStates.Settings)}>
              <Icon name="settings"/>Settings
            </Button> */}
          </Button.Group>
        </Container>
        {this.state.componentState == AppStates.Time ?
          <Time className="fade-in" appState={this.state}/>
        : null}
        {this.state.componentState == AppStates.Stopwatch ?
          <Stopwatch className="fade-in" appState={this.state}/>
        : null}
        {this.state.componentState == AppStates.Timer ?
          <Timer className="fade-in" appState={this.state}/>
        : null}
        {/* {this.state.componentState == AppStates.Settings ?
          <Container className="fade-in">
            <Segment inverted>
              <Checkbox label="label" var={this.state.checked}/>
              {this.state.checked ? "yes" : "no"}
            </Segment>
          </Container>
        : null} */}
      </Container>
    )
  }
}

ReactDOM.render(<App/>, dom.select('#app'))