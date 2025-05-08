import React from 'react';
import {
  reducer as formReducer,
} from 'redux-form';
import {
  createStore,
  combineReducers,
} from 'redux';
import { Provider } from 'react-redux';

const renderWithReduxForm = (component, initialStateValues = {}, formFieldValues = {}) => {
  const fieldReducer = (state = initialStateValues) => state;
  const reducer = combineReducers({
    field: fieldReducer,
    form: formReducer,
  });
  const store = createStore(reducer);

  return (
    <Provider store={store}>
      {component(formFieldValues)}
    </Provider>
  );
};

export default renderWithReduxForm;
