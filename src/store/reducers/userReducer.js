import { GET_AUTH_USER, LOGOUT, ERROR } from "../actions/types";

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null
};

export default function bikeReducer(state = initialState, action) {
  switch (action.type) {
    case GET_AUTH_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    case LOGOUT:
      console.log("out");

      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    case ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}
