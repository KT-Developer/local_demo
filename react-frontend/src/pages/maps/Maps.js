// import React, { useEffect, useState } from "react";
// import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";

// // styles
// import useStyles from "./styles";

// const MapComponent = withGoogleMap((props) => (
//   <GoogleMap
//     defaultZoom={12}
//     defaultCenter={{ lat: -37.813179, lng: 144.950259 }}
//   >
//     <Marker position={{ lat: -37.813179, lng: 144.950259 }} />
//   </GoogleMap>
// ));

// export default function Maps() {
//   const classes = useStyles();
//   const [googleLoaded, setGoogleLoaded] = useState(false);

//   useEffect(() => {
//     // Check if google is available
//     if (window.google) {
//       setGoogleLoaded(true);
//     } else {
//       // If not available, listen for the script to load
//       window.addEventListener("google-loaded", () => {
//         setGoogleLoaded(true);
//       });
//     }
//   }, []);

//   return (
//     <div className={classes.mapContainer}>
//       {googleLoaded && (
//         <MapComponent
//           googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyB7OXmzfQYua_1LEhRdqsoYzyJOPh9hGLg`}
//           loadingElement={<div style={{ height: "inherit", width: "inherit" }} />}
//           containerElement={<div style={{ height: "100%" }} />}
//           mapElement={<div style={{ height: "100%" }} />}
//         />
//       )}
//     </div>
//   );
// }
