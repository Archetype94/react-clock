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
  var
    value = props.value

  function onChange(event) {
    props.update(event.target.value)
  }

  function beforeMaskedValueChange(newState, oldState, userInput) {
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

  function onKeyUp(event) {
    if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
      const
        allInputs = dom.selectAll('.time-display-input input'),
        target = event.target,
        targetSelectionIndex = target.selectionStart,
        equalsTarget = (element) => element == target

      var
        nextInputIndex,
        nextInput

      if (event.key == 'ArrowLeft' && targetSelectionIndex == 0) {
        nextInputIndex = Array.from(allInputs).findIndex(equalsTarget) - 1
      } else if (event.key == 'ArrowRight' && targetSelectionIndex == target.value.length) {
        nextInputIndex = Array.from(allInputs).findIndex(equalsTarget) + 1
      }

      nextInput = nextInputIndex < allInputs.length ? allInputs[nextInputIndex] : null

      if (nextInput) {
        nextInput.select()
      }
    } else if (event.key == 'Enter') {
      props.start()
    }
  }

  return (
    <div className="ui input">
      <InputMask
        mask="99"
        maskChar="0"
        alwaysShowMask={true}
        className={props.name}
        value={value}
        onKeyUp={onKeyUp}
        onChange={onChange}
        beforeMaskedValueChange={beforeMaskedValueChange}
      />
    </div>
  )
}