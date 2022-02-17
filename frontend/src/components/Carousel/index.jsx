import React from 'react';
import Carousel from 'react-material-ui-carousel';
import autoBind from 'auto-bind';
import Paper from '@material-ui/core/Paper';

function Project(props) {
    return (
        <Paper
          className="Project"
          elevation={0}
        >
          <img 
          style={{ width: '100%' }} 
          src={process.env.PUBLIC_URL + `${props.item.imgurl}`} />
        </Paper>
    )
}

const items = [
  {
    imgurl: "/images/image1.jpg",
  },
  {
    imgurl: "/images/image2.jpg",
  },
  {
    imgurl: "/images/image3.jpg",
  },
]

export default class MyProjectsExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      autoPlay: true,
      animation: "fade",
      indicators: true,
      timeout: 500,
      navButtonsAlwaysVisible: false,
      navButtonsAlwaysInvisible: true
    }

    autoBind(this);
    }

    toggleAutoPlay() {
      this.setState({
        autoPlay: !this.state.autoPlay
      })
    }

    toggleIndicators() {
      this.setState({
        indicators: !this.state.indicators
      })
    }

    toggleNavButtonsAlwaysVisible() {
      this.setState({
        navButtonsAlwaysVisible: !this.state.navButtonsAlwaysVisible
      })
    }

    toggleNavButtonsAlwaysInvisible() {
      this.setState({
        navButtonsAlwaysInvisible: !this.state.navButtonsAlwaysInvisible
      })
    }

    changeAnimation(event) {
      this.setState({
        animation: event.target.value
      })
    }

    changeTimeout(event, value) {
      this.setState({
        timeout: value
      })
    }

    render() {
      return (
        <div>
          <Carousel
            className="SecondExample"
            autoPlay={this.state.autoPlay}
            animation={this.state.animation}
            indicators={this.state.indicators}
            timeout={this.state.timeout}
            navButtonsAlwaysVisible={this.state.navButtonsAlwaysVisible}
            navButtonsAlwaysInvisible={this.state.navButtonsAlwaysInvisible}
          >
            {
              items.map((item, index) => {
                  return <Project item={item} key={index} />
              })
            }
          </Carousel>
        </div>
      )
    }
}