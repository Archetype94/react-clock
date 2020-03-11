import React from 'react'
import InputMask from 'react-input-mask'
import { Container } from 'semantic-ui-react'

import { dom } from '../js/core.js'

export default class TimeInput extends React.Component {
  render() {
    const
      keys = Object.keys(this.props.settings),
      settings = keys.map((key) => {
        return this.props.settings[key]
      })

    return (
      <Container fluid className="time-display-input">
        {
          settings.map((setting, index) => {
            return (
              <span key={keys[index]}>
                {index != 0 ? ':' : null}<TimeInputSegment
                  name={keys[index]}
                  value={setting}
                  update={this.props.update.bind(this.props, keys[index])}
                  start={this.props.start}
                />
              </span>
            )
          })
        }
      </Container>
    )
  }
}

function TimeInputSegment(props) {
  function onChange(event) {
    props.update(event.target.value)
  }

  function onKeyUp(event) {
    if (event.key == 'Enter') {
      props.start()
    } else {
      const
        allInputs = dom.selectAll('.time-display-input input'),
        target = event.target,
        targetSelectionIndex = target.selectionStart,
        equalsTarget = (element) => element == target,
        inputActions = {
          Select: (input) => input.select(),
          Focus: (input) => input.focus()
        }

      var
        nextInputIndex,
        nextInput,
        inputAction

      if (targetSelectionIndex == target.value.length) {
        nextInputIndex = Array.from(allInputs).findIndex(equalsTarget) + 1
        inputAction = inputActions.Select
      } else if (event.key == 'ArrowLeft' && targetSelectionIndex == 0) {
        nextInputIndex = Array.from(allInputs).findIndex(equalsTarget) - 1
        inputAction = inputActions.Focus
      }

      nextInput = nextInputIndex < allInputs.length ? allInputs[nextInputIndex] : null

      if (nextInput) {
        inputAction(nextInput)
      }
    }
  }

  return (
    <div className="ui input">
      <InputMask
        mask="99"
        maskChar="0"
        alwaysShowMask={true}
        className={props.name}
        value={props.value}
        onKeyUp={onKeyUp}
        onChange={onChange}
      />
    </div>
  )
}