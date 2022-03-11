import React from 'react';
import Controller from './Controller';
import { DataLayer } from './DataLayer';
import reducer, { initialState } from './Reducer';
import { View } from 'react-native';

export default function App() {
  console.log("Reloaded")
  return(
    
  <DataLayer initialState={initialState} reducer={reducer} >
  <Controller />
  </DataLayer>
  
);
}
