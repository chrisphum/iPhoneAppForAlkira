# iPhoneAppForAlkira


Hello! This is my React Native App for iPhone, made possible by using a tool called Expo.
I started this project during at the start of 2022, and have been working on it in my free time.


I plan to apply for the Apple App Store by the end of this month (March 2022).


What my app does:

-Allows you to input a distance (say 5 miles, or 8 kilometers)
-Randomly generates a circular walking route
-Exports path to Google Maps navigation. Unfortunately, Apple Maps does not offer multiple waypoints.
-Allows you to save your favorite routes locally.

How I did it
-Using React Native via Expo
-Using the Mapbox API's isochrone feature
-This API exports a polygon (GPS data) with a perimeter of equal travel distance via road
-Combine a few API calls with some trigonometry (see Fetch.js, a nightmare file)
-Also use React Native Maps MapView component


What I still need to do:
-Add error handling (such as from failed GET requests)
-Clean up code
-Fix imports
-Bundle
-Apply for app store
-More efficient storage mechanism (Async Storage is not cutting it)
-Fonts, beautify my app
-Make sure it works and looks good on other/larger iPhones
-There exist few more features I may implement

