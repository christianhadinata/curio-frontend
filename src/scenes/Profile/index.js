import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { logoutUser } from "../../actions/authActions"
import { getUserData } from "../../actions/dataActions"
import axios from "axios"

import {Dimensions, 
        StyleSheet,
        TouchableOpacity,
        ScrollView,
        View,
        Image,
        Text
        }from 'react-native';

import SimpleHeader from "../../component/SimpleHeader"
import Moment from 'moment';
import * as Font from 'expo-font';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            userData: {}
        };
    }
    
    componentDidMount() {
        // get user authentication data
        const { user } = this.props.auth;
        this.props.getUserData(user.id);

        // font
        Font.loadAsync({
            'HindSiliguri-Bold': require('../../../assets/fonts/HindSiliguri-Bold.ttf'),
            'HindSiliguri-Regular': require('../../../assets/fonts/HindSiliguri-Regular.ttf'),
        });
    }

    componentWillUpdate(nextProps) {
        if (Object.keys(this.state.userData).length === 0) {
            this.setState({
                userData: nextProps.data.userData
            })
        }
    }

    // logout button
    onLogoutClick = () => {
        const { navigate } = this.props.navigation;
        this.props.logoutUser()
        .then(res => {
            navigate("Auth");
        });
    };    

    render() {
        console.log(this.state.userData);

        // date format
        Moment.locale('en');
        const dt = this.state.userData.dateJoined;

        return(

            <View style={styles.container}>

                <SimpleHeader title="Profile" /> 

                {/* scrollable area for CONTENT */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}>   

                    {/* user profile picture */}
                    {this.state.userData.profilePic != null? 
                        <Image style= { styles.profilePic } source= {{uri: this.state.userData.profilePic}} /> :
                        <Image style= { styles.profilePic } source={require('../../../assets/images/default-profile-pic.png')} />
                    }

                    {/* user heading */}
                    <Text style = {styles.userName}> 
                        {this.state.userData.name}
                    </Text>
                    <Text style = {styles.userDetails}>
                        joined since {Moment(dt).format('Do MMMM YYYY')}
                    </Text>   
                    
                    {/* line separator */}
                    <View style={ styles.line } />  

                    {/* TODO REPLACE THIS  */}
                    <View style={ {height: 350, justifyContent:"center"} }>
                        <Text style={{ fontFamily: 'HindSiliguri-Regular', alignSelf:'center'}}>Whoops, Looks like you dont have any Artefacts</Text>
                        <Text style={{ fontFamily: 'HindSiliguri-Regular', alignSelf:'center'}}>Create a collection now !</Text>
                    </View>


                    <TouchableOpacity 
                        onPress={this.onLogoutClick}
                        style={ styles.button }>
                        <Text style= { styles.buttonText }>Log Out</Text>
                    </TouchableOpacity>  

                </ScrollView>
     
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    userName: {
        fontSize: 24,
        marginTop: 5,
        alignSelf: 'center',
        fontFamily: 'HindSiliguri-Bold'
    },

    userDetails: {
        fontSize: 14,
        marginTop: 3,
        marginBottom: 10,
        alignSelf: 'center',
        color: "#939090",
        fontFamily: 'HindSiliguri-Regular'
    },  

    profilePic: {
        marginTop: 30,
        width: Dimensions.get('window').width * 0.45,
        height: Dimensions.get('window').width * 0.45,
        borderRadius: Dimensions.get('window').width * 0.45/2,
        alignSelf: 'center',
    },

    line: {
        marginTop: 10,
        borderBottomColor: '#939090', 
        borderBottomWidth: 0.4, 
        width: Dimensions.get('window').width * 0.8,
        alignSelf: 'center',
    },  

    button: {
        justifyContent: 'center',
        alignSelf: "center",
        backgroundColor: '#FF6E6E',
        width: Dimensions.get('window').width * 0.4,
        height: 50,
        margin: 10,
        borderRadius: 40,
        elevation: 3, 
    },

    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: 'white',
        fontFamily: 'HindSiliguri-Regular'
    },
})

Profile.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    getUserData: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    data: state.data
});

//  export
export default connect(
    mapStateToProps,
    { logoutUser, getUserData }
)(Profile);

