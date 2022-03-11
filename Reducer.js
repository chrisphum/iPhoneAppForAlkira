export const initialState = {


    // User Info
    userLatitude: null,
    userLongitude: null,
    currentRoute: null,
    routesList: [],


    // Current Route Info
    viewRoute: {
      polyCoords: null,
      wayPoints: null,
      distance: null,
    },

    // Current Map View Info
    viewRegion: {
      latitude: 39.50,
      longitude: -94.50,
      latitudeDelta: 50,
      longitudeDelta: 50,
    }
    
  };
  
  const reducer = (state, action) => {
  
    switch (action.type) {
      case "SET_NO_ROUTE_VIEW":
        return {
          ...state,
          userLatitude: action.latitude,
          userLongitude: action.longitude,
       
          viewRegion: {
            latitude: action.latitude,
            longitude: action.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }
        };
    case "SET_NEW_ROUTE_VIEW":
        return {
          ...state,
          viewRoute: {
            polyCoords: action.polyCoords,
            wayPoints: action.wayPoints,
            distance: action.dist,
          },
          
          currentRoute: action.currentRoute,
          viewRegion: {
            latitude: action.centerLat,
            longitude: action.centerLong,
            latitudeDelta: action.latitudeDelta,
            longitudeDelta: action.longitudeDelta,
          },

          
        };

    case "ADD_SAVED_ROUTE":
      return {
        ...state,
        routesList: state.routesList.concat(action.route)
          }
    case "SAVE_MULTIPLE_ROUTES":
      return {
        ...state,
        routesList: action.route
          }
        
      
      default:
        return state;
    }
  };

  export default reducer;
