import React from 'react'
import { Checkbox as Semantic } from 'semantic-ui-react'

export default class Checkbox extends Semantic {
  constructor(props) {
    super(props)
    this.state = {
      var: this.props.var
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      var: !prevState.var
    }))
  }

  render() {
    //this.props.var = this.state.var
    return (
      <Semantic
        onChange={this.toggle}
        checked={this.state.var}
      />
    )
  }
}