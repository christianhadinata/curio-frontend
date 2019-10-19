import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  View
} from "react-native";

// respondsive design components
import {
  deviceWidthDimension as wd,
  deviceHeigthDimension as hp
} from "../utils/responsiveDesign";

/** general add button
 *  used in groups, artefacts and selected groups pages */
class AddButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationCompleted: true,
      prevAnimation: "up"
    }
    // animation
    this.slideAnimation = new Animated.ValueXY({ x: wd(1), y: 0 });
  }

  // bounch in effect when loaded
  componentDidMount = () => {
    this.startAnimation()
  }

  // setAnimationCompleted = () => {
  //   this.setState({ animationCompleted: !this.state.animationCompleted })
  // }

  // setPrevAnimation = (input) => {
  //   this.setState(input => ({ prevAnimation: input }))
  // }

  // animation
  startAnimation = () => {

    // this.setAnimationCompleted()
    // this.PrevAnimation = (this.props.scrollDir)

    Animated.spring(this.slideAnimation, {
      toValue: { x: 0, y: 0 },
      friction: 7
    }).start();
    // }).start(() => this.setAnimationCompleted());
  }

  // reverse back animation
  // reverseAnimation = () => {

  //   // set animation in progress 
  //   this.setAnimationCompleted()
  //   this.PrevAnimation = (this.props.scrollDir)

  //   // activate animation, reset animation completed state 
  //   Animated.spring(this.slideAnimation, {
  //     toValue: { x: 100, y: 0 },
  //     friction: 7
  //   }).start(() => this.setAnimationCompleted());
  // }

  // prevAnimation = "up"

  render() {

    // (this.state.animationCompleted) ? this.reverseAnimation() : this.startAnimation()
    // (this.props.scrollDir === "down" && this.state.animationCompleted && this.prevAnimation !== this.props.scrollDir)
      // ? this.reverseAnimation() : this.startAnimation()

    return (
      <View style={styles.container}>
        <Animated.View style={this.slideAnimation.getLayout()}>
          <TouchableOpacity style={styles.add} onPress={this.props.onPress}>
            <Text style={styles.text}>+</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30, // default standard for material design
    right: 30
  },

  add: {
    width: hp(0.07),
    height: hp(0.07),
    borderRadius: hp(0.07),
    elevation: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#FF6E6E"
  },

  text: {
    fontSize: hp(0.07) / 1.7,
    color: "white"
  }
});

export default AddButton;
