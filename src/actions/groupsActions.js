import {
  SET_USER_GROUPS,
  SET_SELECTED_GROUP,
  SET_SELECTED_GROUP_ARTEFACTS,
  SET_SELECTED_GROUP_MEMBERS,
} from "../types/groupsTypes";

import {
  getGroupDetailsAPIRequest,
  getUserGroupsAPIRequest,
  createGroupAPIRequest,
  putGroupAdminAPIRequest,
  getGroupAllArtefactsAPIRequest,
  getGroupAllMembersAPIRequest,
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

// get all artefacts of a group
export const getSelectedGroupAllArtefacts = groupId => dispatch => {
  return new Promise((resolve, reject) => {
    getGroupAllArtefactsAPIRequest(groupId)
      .then(res => {
        resolve(res);
        dispatch(setSelectedGroupArtefacts(res.data));
      })
      // failure
      .catch(err => {
        console.log("groupActions: " + err);
        reject(err);
      });
  });
};

// get all members of a group
export const getSelectedGroupAllMembers = groupId => dispatch => {
  return new Promise((resolve, reject) => {
    getGroupAllMembersAPIRequest(groupId)
      .then(res => {
        resolve(res);
        dispatch(setSelectedGroupMembers(res.data));
      })
      // failure
      .catch(err => {
        console.log("groupActions: " + err);
        reject(err);
      });
  });
};

export const setUserGroups = decoded => {
  return {
    type: SET_USER_GROUPS,
    payload: decoded
  };
};

export const setSelectedGroup = decoded => {
  return {
    type: SET_SELECTED_GROUP,
    payload: decoded
  };
};

export const setSelectedGroupArtefacts = decoded => {
  return {
    type: SET_SELECTED_GROUP_ARTEFACTS,
    payload: decoded
  };
};

export const setSelectedGroupMembers = decoded => {
  return {
    type: SET_SELECTED_GROUP_MEMBERS,
    payload: decoded
  };
};
