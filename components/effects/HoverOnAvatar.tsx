import React, { Component, RefObject } from 'react'

interface HoverOnAvatarProps {
  activeClass: string
  render: (arg: HoverOnAvatar) => JSX.Element
}

export default class HoverOnAvatar extends Component<HoverOnAvatarProps> {
  anchorRef: RefObject<HTMLLIElement>
  activeClass: string
  hoverTimeout: number
  state: {
    currentClass: string
  }

  constructor(props: HoverOnAvatarProps) {
    super(props)
    this.anchorRef = React.createRef<HTMLLIElement>()
    this.activeClass = this.props.activeClass
    this.hoverTimeout = 0
    this.state = {
      currentClass: ''
    }
  }

  componentDidMount() {
    this.anchorRef?.current?.addEventListener(`mouseout`, this.onHoverOut, { passive: true })
    this.anchorRef?.current?.addEventListener(`mouseover`, this.onHoverIn, { passive: true })
  }

  componentWillUnmount() {
    clearTimeout(this.hoverTimeout)
    this.anchorRef?.current?.removeEventListener(`mouseover`, this.onHoverIn)
    this.anchorRef?.current?.removeEventListener(`mouseout`, this.onHoverOut)
  }

  onHoverIn = () => {
    clearTimeout(this.hoverTimeout)
    this.setState({ currentClass: this.activeClass })
  }

  onHoverOut = () => {
    // no delay for multiple authors
    this.hoverTimeout = setTimeout(() => {
      this.setState({ currentClass: `` })
    }, 50)
  }

  render() {
    return this.props.render(this)
  }
}
