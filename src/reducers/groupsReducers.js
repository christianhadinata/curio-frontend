import {
  SET_USER_GROUPS,
  SET_SELECTED_GROUP,
} from "../types/groupsTypes";

const initialState = {
  userGroups: [],
  selectedGroup: {},
  errors: {}
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
    default:
      return state;
  }
}
