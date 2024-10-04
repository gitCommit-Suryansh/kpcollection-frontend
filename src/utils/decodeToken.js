import { jwtDecode } from 'jwt-decode'; // Importing the named export

const decodeToken = (token) => {
  try {
    return jwtDecode(token); // Decode the token
  } catch (error) {
    console.error('Token decode failed', error);
    return null; // Return null if decoding fails
  }
};

export default decodeToken;
