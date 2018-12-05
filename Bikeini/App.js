/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Font, AppLoading } from 'expo';
import thunk from 'redux-thunk';
import reducers from './navigation/reducers/index';
import AppNavigator from './navigation/AppNavigator';


const store = createStore(reducers, applyMiddleware(thunk));
const headerFont = require('./assets/fonts/Noteworthy-Bold.ttf');

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      CustomFont: headerFont,
    });
    this.setState({ isReady: true });
  }

  render() {
    const { isReady } = this.state;
    if (!isReady) {
      return <AppLoading />;
    }
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}
