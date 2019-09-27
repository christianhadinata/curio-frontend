import {
  SET_USER_GROUPS,
  SET_SELECTED_GROUP,
  SET_SELECTED_GROUP_ARTEFACTS,
  SET_SELECTED_GROUP_MEMBERS,
} from "../types/groupsTypes";

const initialState = {
  userGroups: [],
  selectedGroup: {},
  selectedGroupArtefacts: [],
  selectedGroupMembers: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_GROUPS:
      return {
        ...state,
        userGroups: action.payload
      };
    case SET_SELECTED_GROUP:
      return {
        ...state,
        selectedGroup: action.payload
      };
    case SET_SELECTED_GROUP_ARTEFACTS:
      return {
        ...state,
        selectedGroupArtefacts: action.payload
      };
    case SET_SELECTED_GROUP_MEMBERS:
      return {
        ...state,
        selectedGroupMembers: action.payload
      };
    default:
      return state;
  }
}
