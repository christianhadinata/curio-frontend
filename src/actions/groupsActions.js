import axios from "axios";

import {
  SET_USER_GROUPS,
  SET_SELECTED_GROUP,
} from "../types/groupsTypes";

import {
  getGroupDetailsAPIRequest,
  getUserGroupsAPIRequest,
  createGroupAPIRequest,
  putGroupAdminAPIRequest
} from "../utils/APIHelpers/groupAPIHelper";

import { uploadImageToGCS } from "../utils/imageUpload";

// // get groups of user based on userId
export const getUserGroups = userId => dispatch => {
  return new Promise((resolve, reject) => {
    getUserGroupsAPIRequest(userId)
      .then(res => {
        resolve(res);
        dispatch(setUserGroups(res.data));
      })
      // failure
      .catch(err => {
        console.log("groupActions: " + err);
        reject(err);
      });
  });
};

// create new group based on groupData
export const createNewGroup = groupData => dispatch => {
  return new Promise((resolve, reject) => {
    // extract adminId (current user id)
    const { adminId, imageURI } = groupData;
    // upload cover photo to GCS
    uploadImageToGCS(imageURI).then(imageURL => {
      // prepare the body data
      const newGroup = {
        ...groupData,
        coverPhoto: imageURL
      };
      // send create new group request to backend
      createGroupAPIRequest(newGroup)
        .then(res => {
          // set current user as the admin of the new group at the backend
          putGroupAdminAPIRequest(res.data._id, adminId)
            .then(() => {
              // get all user's groups to re-add them to redux store
              getUserGroupsAPIRequest(adminId)
                .then(res => {
                  resolve(res);
                  dispatch(setUserGroups(res.data));
                })
                // failure
                .catch(err => {
                  console.log("groupActions: " + err);
                  reject(err);
                });
              // failed to set group admin
            })
            // failure
            .catch(err => {
              console.log("groupActions: " + err);
              reject(err);
            });
        })
        // failure
        .catch(err => {
          console.log("groupActions: " + err);
          reject(err);
        });
    });
  });
};

// when user clicks on (selects) a specific group
export const getSelectedGroup = groupId => dispatch => {
  return new Promise((resolve, reject) => {
    getGroupDetailsAPIRequest(groupId)
      .then(res => {
        resolve(res);
        dispatch(setSelectedGroup(res.data));
      })
      // failure
      .catch(err => {
        console.log("groupActions: " + err);
        reject(err);
      });
  });
};

// assign user groups
export const setUserGroups = decoded => {
  return {
    type: SET_USER_GROUPS,
    payload: decoded
  };
};

// assign new group to user
export const setSelectedGroup = decoded => {
  return {
    type: SET_SELECTED_GROUP,
    payload: decoded
  };
};
