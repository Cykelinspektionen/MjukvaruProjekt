/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Font } from 'expo';
import thunk from 'redux-thunk';
import reducers from './navigation/reducers/index';
import AppNavigator from './navigation/AppNavigator';


const store = createStore(reducers, applyMiddleware(thunk));
const headerFont = require('./assets/Noteworthy-Bold.ttf');

export default class App extends React.Component {
  componentDidMount() {
    Font.loadAsync({
      CustomFont: headerFont,
    });
  }

  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}
