import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  Text,
  TouchableOpacity,
  Image
} from "react-native";

// import redux actions for groups
import { createNewGroup, getSelectedGroup, getSelectedGroupAllArtefacts, getSelectedGroupAllMembers } from "../../actions/groupsActions";

// custom components
import CardCarousel from "../../component/CardCarousel";
import CardGroup from "../../component/CardGroup";
import Header from "../../component/Header";
import AddButton from "../../component/AddButton";
import GroupModal from "../../component/GroupModal";

// Custom respondsive design component
import {
  deviceHeigthDimension as hp,
  deviceWidthDimension as wd
} from "../../utils/responsiveDesign";

// default gray colour
const gray = "#F7F7F7";

const newGroup = {
  adminId: "",
  title: "",
  description: "",
  private: true,
  imageURI: ""
};

class Groups extends Component {
  // Nav bar details
  static navigationOptions = {
    header: null
  };

  state = {
    isModalVisible: false,
    newGroup
  };

  // CHANGE THIS LATER
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  // revert newGroup to initial state
  resetNewGroup = () => {
    this.setState({
      newGroup
    });
  };

  // new group's attribute change
  onNewGroupChange = (key, value) => {
    this.setState({
      newGroup: {
        ...this.state.newGroup,
        [key]: value
      }
    });
  };

  // post new group into the backend
  postNewGroup = async () => {
    await this.onNewGroupChange("adminId", this.props.auth.user.id);
    // redux action to create new group at the backend
    //prettier-ignore
    this.props.createNewGroup(this.state.newGroup)
      .then(() => {
        this.toggleModal();
        this.resetNewGroup();
      })
      .catch(err => console.log(err));
  };

  // click a specific group on the Groups scene
  clickGroup = async (groupId) => {
    const { navigate } = this.props.navigation;

    this.props.getSelectedGroup(groupId);
    this.props.getSelectedGroupAllArtefacts(groupId);
    this.props.getSelectedGroupAllMembers(groupId);
    navigate("SelectedGroup");
  };

  // show groups that are unpinned by user
  showUnpinnedGroups = groups => {
    let unpinnedGroups = groups.concat();
    let cardGroupRows = [];
    let cardGroups = [];
    let rowKey = 0;
    let groupKey = 0;

    // remove user's pinned groups
    for (var i = 0; i < unpinnedGroups.length; i++) {
      // console.log("cover photo is", unpinnedGroups[i].coverPhoto);
    }

    // sort array based on date obtained (from earliest to oldest)
    unpinnedGroups.sort(function(a, b) {
      return new Date(b.dateCreated) - new Date(a.dateCreated);
    });

    // create CardGroup object out of group and push it into cardGroups array
    for (var i = 0; i < unpinnedGroups.length; i++) {
      const groupId = unpinnedGroups[i].details._id;
      const text = unpinnedGroups[i].details.title;
      const imageURI = unpinnedGroups[i].details.coverPhoto;

      cardGroups.push(
        // DOES NOT WORK FOR NOW!!!
        // <CardGroup
        //   onPress={() => this.clickGroup}
        //   key={groupKey}
        //   groupId={groupId}
        //   text={text}
        //   image={{ uri: imageURI }}
        // />

        // Temporary CardGroup
        <View key={groupKey} style={styles.card}>
          <TouchableOpacity onPress={() => this.clickGroup(groupId)}>
              <View style={styles.picPlaceholder}>
                  <Image style={[styles.photo]} source={{ uri: imageURI }} />
              </View>
              <View style={styles.textPlaceholder}>
                  <Text style={[styles.title, styles.font]}>{text}</Text>

              </View>
          </TouchableOpacity>
        </View>
      );
      groupKey++;

      // create a new row after the previous row has been filled with 2 groups and fill the previous row into cardGroupRows
      if (
        unpinnedGroups.length === 1 ||
        cardGroups.length === 2 ||
        (i !== 0 && i === unpinnedGroups.length - 1)
      ) {
        cardGroupRows.push(
          <View style={styles.feed} key={rowKey}>
            {cardGroups}
          </View>
        );
        cardGroups = [];
        rowKey++;
      }
    }
    return <>{cardGroupRows}</>;
  };

  render() {

    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <Header />

        {/* scrollable area for CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          style={{ backgroundColor: gray }}
        >
          {/* carousel pinned groups */}
          <View style={{ height: wd(0.52), backgroundColor: "white" }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              decelerationRate={0.8}
              snapToAlignment={"center"}
              snapToInterval={Dimensions.get("window").width}
            >
              <CardCarousel
                image={require("../../../assets/images/test-delete-this/boi1.jpg")}
              />
              <CardCarousel
                image={require("../../../assets/images/test-delete-this/boi2.jpg")}
              />
              <CardCarousel
                image={require("../../../assets/images/test-delete-this/boi3.jpg")}
              />
              <CardCarousel
                image={require("../../../assets/images/test-delete-this/boi4.jpg")}
              />
            </ScrollView>
          </View>

          {/* unpinned groups */}
          {this.props.groups.userGroups.length !== 0 ? (
            <View>{this.showUnpinnedGroups(this.props.groups.userGroups)}</View>
          ) : (
            <View style={styles.emptyFeed}>
              <Text
                style={{ fontSize: 16, fontFamily: "HindSiliguri-Regular" }}
              >
                Looks like you're not part of any groups yet
              </Text>
              <Text
                style={{ fontSize: 16, fontFamily: "HindSiliguri-Regular" }}
              >
                Click the "+" button to create a group
              </Text>
            </View>
          )}
        </ScrollView>

        {/* create new Group */}
        {/* <AddButton onPress={this.toggleModal} /> */}
        <AddButton onPress={() => navigate("GroupsForm")} />

        <GroupModal
          isModalVisible={this.state.isModalVisible}
          toggleModal={this.toggleModal}
          newGroup={this.state.newGroup}
          post={this.postNewGroup.bind(this)}
          onNewGroupChange={this.onNewGroupChange.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  feed: {
    flexDirection: "row"
  },

  emptyFeed: {
    flex: 1,
    height: hp(0.6),
    alignItems: "center",
    justifyContent: "center"
  },

  // TEMPORARY
  // STYLES FOR CARD GROUP (START)
  card: {
    width: Dimensions.get("window").width * 0.44,
    marginTop: 10,
    marginLeft: Dimensions.get("window").width * 0.04,
    height: wd(0.5),
    borderRadius: 15,
    borderWidth: 0.05,
    elevation: 1,
    borderColor: "#E2E2E2",
    alignContent: "center",
    alignItems: "center",
},

font:{
    fontFamily: "HindSiliguri-Regular"
},

picPlaceholder: {
    flex: 0.7,
    alignItems: "center",
    justifyContent: "center",
},

photo: {
    width: Dimensions.get("window").width * 0.435,
    height: wd(0.35),
    marginTop: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
},

textPlaceholder: {
    flex: 0.3,
    margin: 5,
},

title: {
    flex: 0.4,
    marginHorizontal: 5,
    marginTop: 3,
},

userProfile: {
    flex: 0.6,
    flexDirection: "row",
    alignItems: "center"
},

userProfilePic: {
    width: wd(0.07),
    height: wd(0.07),
    marginHorizontal: 5
},

userName:{
    color: "#939090"
}

// STYLES FOR CARD GROUP (END)
});

Groups.propTypes = {
  createNewGroup: PropTypes.func.isRequired,
  groups: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  groups: state.groups,
  auth: state.auth
});

//  connect to redux and export
export default connect(
  mapStateToProps,
  { createNewGroup, getSelectedGroup, getSelectedGroupAllArtefacts, getSelectedGroupAllMembers }
)(Groups);
