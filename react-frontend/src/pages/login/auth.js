// auth.js
import Cookies from 'js-cookie';
// import { default as jwt_decode } from 'jwt-decode';

// Check if the user is authenticated by checking for a token in cookies
export const isAuthenticated = () => {
    const token = Cookies.get('token');
    console.log(token);
    return token !== undefined;
};

// Log in by setting a token in cookies
export const login = (token) => {
    // Set the token in a cookie that expires in 7 days
    Cookies.set('token', token, { expires: null }); // Expires in 7 days
};

// Log out by removing the token from cookies
export const logout = () => {
    Cookies.remove('token');
};
// Temporary function to clear cookies for testing purposes
export const clearCookies = () => {
    Cookies.remove('token');
};

export const cookie_token = () => {
    const token = Cookies.get('token');
    const decoded = decodeJWT(token);
    console.log(decoded);
    return decoded.id;

}
// Decode base64 URL
const base64UrlDecode = (str) => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
};

const decodeJWT = (token) => {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid token');
    }
    const payload = parts[1];
    return JSON.parse(base64UrlDecode(payload));
};
// console.log(base64UrlDecode('$2b$10$RowTJISGP.UBU2.OqE/egODDy1W2lfn4VmzR6Hvldx30Oh7FLkwt.'));

// Example usage

