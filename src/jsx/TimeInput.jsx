import React from 'react'
import InputMask from 'react-input-mask'

import { dom } from '../js/core.js'

export default function TimeInput(props) {
  var
    value = props.value

  function onChange(event) {
    props.setTime(event.target.value)
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

  function onKeyDown(event) {
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
      this.start()
    }
  }

  return (
    <div className="ui input">
      <InputMask
        mask="99"
        maskChar="0"
        alwaysShowMask={true}
        id={props.id}
        value={value}
        onKeyUp={onKeyDown}
        onChange={onChange}
        beforeMaskedValueChange={beforeMaskedValueChange}
      />
    </div>
  )
}