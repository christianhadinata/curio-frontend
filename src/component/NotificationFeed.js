import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    Text,
} from 'react-native';

// custom responsive design component
import {
    deviceHeigthDimension as hp,
    deviceWidthDimension as wd,
    setToBottom
} from "../utils/responsiveDesign"

// date converter 
import Moment from "moment";

class NotificationFeed extends Component {

    // unbolds text after notification has been read
    boldText() {

        if (this.props.hasRead == true) {
            return {
                fontFamily: "HindSiliguri-Regular"
            }
        }
        else {
            return {
                fontFamily: "HindSiliguri-Bold"
            }
        }
    }

    render() {

        // date format
        Moment.locale("en");
        const dt = this.props.date

        return (
            <View style={styles.card}>

                {/* TODO ADD BELOW ===>   onPress={ () => this.props.func() } */}
                <TouchableOpacity activeOpacity={0.5}>

                    <View style={styles.card}>
                        {/* Image  */}
                        <View style={styles.picPlaceholder}>
                            <Image style={styles.photo} source={this.props.image} />
                        </View>

                        {/* Notification */}
                        <View style={styles.notificationPlaceholder}>
                            <View style={styles.notification}>
                                <Text style={[styles.notificationTitle, this.boldText()]}>{this.props.name} {this.props.text}</Text>
                            </View>

                            <View style={styles.time}>
                                {/* <Text style={styles.timeTitle}> {Moment(dt).format("H")} hours ago </Text> */}
                                <Text style={styles.timeTitle}> 25 hours ago </Text>
                            </View>
                        </View>
                    </View>

                    {/* line separator */}
                    <View style={styles.line} />
                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({

    card: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: 100,
        flexDirection: "row",
        alignItems: "center",
    },

    picPlaceholder: {
        width: Dimensions.get('window').width * 0.2,
        height: Dimensions.get('window').width * 0.2,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: wd(0.03),
    },

    photo: {
        width: Dimensions.get('window').width * 0.17,
        height: Dimensions.get('window').width * 0.17,
    },

    notificationPlaceholder: {
        width: Dimensions.get('window').width * 0.8,
    },

    notification: {
        alignContent: "flex-start",
        marginTop: 15,
        flex: 0.7,
    },

    notificationTitle: {
        paddingHorizontal: wd(0.03),
    },

    time: {
        alignContent: "flex-end",
        flex: 0.3,
        marginBottom: 10
    },

    timeTitle: {
        fontFamily: "HindSiliguri-Regular",
        paddingHorizontal: wd(0.03)
    },

    line: {
        borderBottomColor: "#939090",
        borderBottomWidth: 0.4,
        width: Dimensions.get("window").width * 0.9,
        alignSelf: "center"
    },
})

//  export
export default NotificationFeed;