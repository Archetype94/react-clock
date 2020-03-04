/* Core Convenience Functions
 * @version 1.0
 * @author Aidan S
 * @license CC-BY-NC-SA-4.0
 */

export const dom = {
  select: (selector) => {
    return document.querySelector(selector)
  },

  selectAll: (selector) => {
    return document.querySelectorAll(selector)
  },

  addClass: (element, aClassName) => {
    let classList = element.className.split(' ')

    if (element.className.length == 0) {
      element.className += aClassName
    } else if (classList.indexOf(aClassName) == -1) {
      element.className += ' ' + aClassName
    }

    return element
  },

  addClassAll: (selector, aClassName) => {
    const elements = dom.selectAll(selector)

    elements.forEach(element => {
      dom.addClass(element, aClassName)
    })

    return elements
  },

  removeClass: (element, aClassName) => {
    element.className = element.className.replace(aClassName, '').trim();

    return element
  },

  removeClassAll: (selector, aClassName) => {
    const elements = dom.selectAll(selector + ' .' + aClassName)

    elements.forEach(element => {
      dom.removeClass(element, aClassName)
    })

    return elements
  },

  toggleClass: (element, aClassName) => {
    let classList = element.className.split(' ')

    if (element.className.length == 0) {
      element.className += aClassName
    } else if (classList.indexOf(aClassName) == -1) {
      element.className += ' ' + aClassName
    } else {
      dom.removeClass(element, aClassName)
    }

    return element
  },
}

export const math = {
  round: (x, precision) => {
    x = +x + (precision === undefined ? 0.5 : precision / 2)

    return x - (x % (precision === undefined ? 1 : +precision))
  },

  random: (min, max) => {
    return Math.floor((Math.random() * max) + min);
  }
}

export const base = {
  isEmpty: (variable) => {
    try {
      if (typeof variable === 'undefined' || variable == null || String(variable).replace(/(\s)*/g, '') == '')
        return true
      else
        return false
    } catch (e) {
      console.error(e)
      return true
    }
  },

  cycleArrayIndex: (i, arrayLength) => {
    if (i >= arrayLength) {
      return i - arrayLength * parseInt(i / arrayLength)
    } else {
      return i
    }
  },

  tryFunction: (f) => {
    try {
      return f()
    } catch (e) {
      console.error(e)
    }
  }
}

export const browser = (() => {
  const userAgent = navigator.userAgent
  console.log(userAgent)

  function supportsObjectFunctions() {
    var canAssignObjects = true;

    try {
      let temp = Object.assign({}, {})
    } catch (e) {
      canAssignObjects = false
      console.error(e)
    }

    return canAssignObjects
  }

  function isTerrible() {
    if (
      userAgent.indexOf('MSIE ') > 0 || // IE
      userAgent.indexOf('Trident/') > 0 // IE 11
    ) {
      return true
    }

    return false
  }

  function isAwful() {
    if (
      isTerrible() ||
      userAgent.indexOf('Edge/') > 0 // Edge
    ) {
      return true
    }

    return false
  }

  return {
    supportsObjectFunctions: supportsObjectFunctions,
    isTerrible: isTerrible,
    isAwful: isAwful
  }
})()