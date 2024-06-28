import React from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import config from "../config";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true, userRole: action.payload.role };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false, userRole: null };
    case "LOGIN_NOT_FOUND":
      return { ...state, loginError: true };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!Cookies.get('token'),
    loginError: false,
    userRole: null,  // Initialize userRole as null
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

function loginUser(dispatch, email, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  if (!!email && !!password) {
    axios.post(`${config.API_URL}:${config.API_PORT}/login`, { email: email, password: password })
      .then(res => {
        console.log(res);
        if (res.data.message === "Login Successful") {
          const token = res.data.token;
          const role = res.data.role; // Get the role from the response
          Cookies.set('token', token); // expires in 7 days
          setError(null);
          setIsLoading(false);
          dispatch({ type: 'LOGIN_SUCCESS', payload: { role } });
          history.push('/app/dashboard');
        } else {
          setError(true);
          setIsLoading(false);
          dispatch({ type: 'LOGIN_NOT_FOUND' });
        }
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setIsLoading(false);
        dispatch({ type: 'LOGIN_FAILURE' });
      });
  } else {
    setError(true);
    setIsLoading(false);
    dispatch({ type: 'LOGIN_FAILURE' });
  }
}

function signOut(dispatch, history) {
  Cookies.remove('token');
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
