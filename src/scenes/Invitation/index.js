import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getSelectedUser } from "../../actions/userActions";
import {
  getSelectedGroup,
  addMemberToGroup,
  removeInviteFromGroup,
  getUserGroups
} from "../../actions/groupsActions";
import { getUserNotifications } from "../../actions/notificationActions";

import {
  StyleSheet,
  View,
  Image,
  Text,
  Animated,
  TouchableOpacity
} from "react-native";

// import the loader modal to help show loading process
import ActivityLoaderModal from "../../component/ActivityLoaderModal";

// custom component
import MySmallerButton from "../../component/MySmallerButton";

// import reusable components
import {
  deviceHeigthDimension as hp,
  deviceWidthDimension as wd
} from "../../utils/responsiveDesign";

class Invitation extends Component {
  constructor(props) {
    super(props);
    this.fadeAnimation = new Animated.Value(0);
    // setup initial state
    this.state = {
      loading: false,
      admin: {},
      group: {}
    };
    this.getRequiredData();
  }

  // get selected group data asynchronously
  getRequiredData = async () => {
    const { notif } = this.props.navigation.state.params;
    const { data, refId } = notif;
    const adminId = data.otherUser;
    // reload everything at once
    return Promise.all([
      this.props.getSelectedUser(adminId),
      this.props.getSelectedGroup(refId)
    ])
      .then(values => {
        const admin = values[0];
        const group = values[1];
        // set data into local state and start showing data
        this.setState({ admin, group }, () => this.startShowing());
      })
      .catch(err => {
        console.log("Error loading invitation data: " + err.response.data);
        err.response.data === "Not Found"
          ? alert("Group has been deleted")
          : alert("Error loading invitation data");
      });
  };

  // Nav bar details
  static navigationOptions = {
    headerStyle: {
      elevation: 0
    }
  };

  // animation trigger
  startShowing = () => {
    Animated.timing(this.fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  // setter function for "loading" to show user that something is loading
  setLoading = loading => {
    this.setState({
      loading
    });
  };

  onAcceptInvite = async () => {
    // extract all required data
    const groupId = this.state.group._id;
    const userId = this.props.user.userData._id;
    const { replace } = this.props.navigation;

    // show user the loading modal
    this.setLoading(true);
    // do bunch of api requests and data loading
    await this.props.addMemberToGroup(groupId, userId);
    await this.props.removeInviteFromGroup(groupId, userId);
    await this.props.getUserNotifications(userId);
    this.props.getUserGroups(userId);
    // close modal
    this.setLoading(false);
    // pop current screen and navigate to selectedGroup
    // so user cannot "back" into this invitation screen
    replace("SelectedGroup", { origin: "Notification", groupId });
  };

  onDeclineInvite = async () => {
    // extract all required data
    const groupId = this.state.group._id;
    const userId = this.props.user.userData._id;
    const { navigate } = this.props.navigation;

    // show user the loading modal
    this.setLoading(true);
    // do bunch of api requests and data loading
    await this.props.removeInviteFromGroup(groupId, userId);
    await this.props.getUserNotifications(userId);
    this.setLoading(false);
    // navigate back
    navigate("Notification");
  };

  render() {
    // get required data
    const { notif } = this.props.navigation.state.params;

    const imageSource = !notif.thumbnailURL
      ? require("../../../assets/images/default-profile-pic.png")
      : { uri: notif.thumbnailURL };

    return (
      <Animated.View
        style={[styles.container, { opacity: this.fadeAnimation }]}
      >
        <ActivityLoaderModal loading={this.state.loading} />
        {/* invitator's profile pic */}
        <View
          style={{
            height: hp(0.3),
            width: wd(1),
            alignItems: "center",
            marginVertical: hp(0.1)
          }}
        >
          <Image
            style={styles.profilePic}
            source={imageSource}
            resizeMethod="resize"
            resizeMode="cover"
          />

          <Text style={styles.invite}>
            @{this.state.admin.username} has invited you to join the group:
          </Text>
          <Text style={styles.group}>{this.state.group.title}</Text>
        </View>

        {/* invitation fields */}
        <View style={styles.buttons}>
          {/* accept */}
          <MySmallerButton
            text="Accept"
            onPress={() => this.onAcceptInvite()}
          />

          {/* decline */}
          <TouchableOpacity
            style={{ marginVertical: wd(0.05), alignItems: "center" }}
            onPress={() => this.onDeclineInvite()}
          >
            <Text style={styles.decline}>Decline</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center"
  },

  profilePic: {
    marginTop: 50,
    marginBottom: 20,
    width: wd(0.3),
    height: wd(0.3),
    borderRadius: wd(0.3) / 2,
    alignSelf: "center"
  },

  invite: {
    width: wd(0.7),
    color: "#939090",
    fontFamily: "HindSiliguri-Regular",
    fontSize: 16,
    textAlign: "center"
  },

  group: {
    width: wd(0.7),
    color: "black",
    fontFamily: "HindSiliguri-Bold",
    fontSize: 16,
    textAlign: "center"
  },

  buttons: {
    height: hp(0.6),
    paddingTop: hp(0.05),
    width: wd(0.8),
    alignContent: "center",
    alignItems: "center"
  },

  accept: {
    fontFamily: "HindSiliguri-Bold",
    color: "#1183ca",
    fontSize: 16
  },

  decline: {
    fontFamily: "HindSiliguri-Bold",
    color: "#939090",
    textDecorationLine: "underline",
    fontSize: 16
  }
});

Invitation.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  {
    getSelectedUser,
    getSelectedGroup,
    addMemberToGroup,
    removeInviteFromGroup,
    getUserNotifications,
    getUserGroups
  }
)(Invitation);
