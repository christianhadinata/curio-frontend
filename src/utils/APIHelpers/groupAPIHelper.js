import axios from "axios";

// get all details of a group by groupId
export const getGroupDetailsAPIRequest = groupId => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://curioapp.herokuapp.com/api/group/id/" + groupId)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

// get groups of user based on userId
export const getUserGroupsAPIRequest = userId => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://curioapp.herokuapp.com/api/user/id/" + userId + "/groups")
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

// create new group based on group details
export const createGroupAPIRequest = groupData => {
  return new Promise((resolve, reject) => {
    axios
      .post("http://curioapp.herokuapp.com/api/group", groupData)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

// set the group admin by user id
export const putGroupAdminAPIRequest = (groupId, userId) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        "http://curioapp.herokuapp.com/api/group/id/" +
          groupId +
          "/add/userId/" +
          userId
      )
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};
