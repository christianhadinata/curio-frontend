import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
  Animated,
  RefreshControl
} from "react-native";

// custom components
import ArtefactFeed from "../../component/ArtefactFeed";
import SimpleHeader from "../../component/SimpleHeader";
import AddButton from "../../component/AddButton";

// redux actions
import {
  createNewArtefacts,
  getSelectedArtefact,
  getUserArtefacts,
  getArtefactComments
} from "../../actions/artefactsActions";

// Custom respondsive design component
import {
  deviceHeigthDimension as hp,
  deviceWidthDimension as wd
} from "../../utils/responsiveDesign";

class Artefacts extends Component {
  constructor(props) {
    super(props);
    // setup initial state
    this.state = {
      loading: false,
      refreshing: false,
      isPublicTab: true,
      searchInput: ""
    };
  }

  // animation trigger
  startShowing = () => {
    Animated.timing(this.fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  // Nav bar details
  static navigationOptions = {
    header: null
  };

  onChangeSearchInput = searchInput => {
    this.setState({
      searchInput
    });
  };

  // setter functions //
  // setter function for change privacy tab
  onChangePrivacyTab = () => {
    this.setState({ isPublicTab: !this.state.isPublicTab });
  };

  // refresh page
  refreshArtefacts = async () => {
    this.setState({ refreshing: true });
    // get data from backend
    await this.props.getUserArtefacts(this.props.auth.user.id);
    // resets refreshing state
    this.setState({ refreshing: false });
  };

  // user press + button to create a new artefact
  onNewArtefactCreate = () => {
    const { navigate } = this.props.navigation;
    // redirect user
    navigate("ArtefactsForm", { origin: "Artefacts" });
  };

  // artefact feed functions //
  // for each individual artefact clicked by user
  onArtefactClick = async artefactId => {
    const { navigate } = this.props.navigation;
    // redirect user
    navigate("SelectedArtefact", { origin: "Artefacts", artefactId });
  };

  // show artefacts by privacy settings
  showArtefacts = () => {
    // reset animation value
    this.fadeAnimation = new Animated.Value(0);
    // extract required data
    artefacts = this.props.artefacts.userArtefacts;
    privacy = this.state.isPublicTab ? 0 : 1;
    // filter artefacts by their privacy settings
    artefacts = artefacts.filter(x => x.privacy == privacy);

    // return modularized feed component
    if (artefacts.length !== 0) {
      return (
        <ArtefactFeed
          artefacts={artefacts}
          onPress={this.onArtefactClick.bind(this)}
        />
      )
    }
    // return no artefact message 
    else {
      this.startShowing()
      // message displayed in public or private tab
      let type = !privacy ? "public" : "private"
      let message = !privacy ?
        "Public artefacts can be viewed by everyone" :
        "Private artefacts can only be seen by yourself"
      return (
        <Animated.View style={[styles.emptyFeed, { opacity: this.fadeAnimation }]}>
          <Text style={styles.emptyfeedText}>
            Looks like you haven't posted any {type} artefacts
          </Text>
          <Text style={styles.emptyfeedText}>
            Click the "+" button to add some
          </Text>
          <Text style={styles.emptyfeedText}>
            {"\n"}{message}
          </Text>
        </Animated.View>
      )
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {/* scrollable area for artefact feeds */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refreshArtefacts}
            />
          }
        >
          {/* header */}
          <SimpleHeader
            title="My Artefacts"
            showTab={true}
            onChangePrivacyTab={this.onChangePrivacyTab}
            isPublicTab={this.state.isPublicTab}
            tab1="Public"
            tab2="Private"
            showSearch={true}

            searchInput={this.state.searchInput}
            onChangeSearchInput={this.onChangeSearchInput}
            pressClear={() => this.onChangeSearchInput("")}
            onSubmitEditing={() =>
              navigate("GeneralSearch", {
                searchTerms: this.state.searchInput
              })
            }
            pressSearch={() =>
              navigate("GeneralSearch", {
                searchTerms: this.state.searchInput
              })
            }
          />
          {/* all artefacts posted by the user based on the their privacy settings */}
          {this.showArtefacts()}
        </ScrollView>

        {/* create new Group */}
        <AddButton onPress={this.onNewArtefactCreate.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor:"#FAFAFA"
  },

  emptyFeed: {
    flex: 1,
    height: hp(0.709),
    alignItems: "center",
    justifyContent: "center"
  },

  emptyfeedText: {
    fontSize: hp(0.02),
    fontFamily: "HindSiliguri-Regular"
  }
});

// check for prop types correctness
Artefacts.propTypes = {
  artefacts: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getUserArtefacts: PropTypes.func.isRequired,
  createNewArtefacts: PropTypes.func.isRequired
};

// map required redux state to local props
const mapStateToProps = state => ({
  artefacts: state.artefacts,
  auth: state.auth
});

// map required redux state and actions to local props
export default connect(
  mapStateToProps,
  {
    createNewArtefacts,
    getSelectedArtefact,
    getUserArtefacts,
    getArtefactComments
  }
)(Artefacts);
