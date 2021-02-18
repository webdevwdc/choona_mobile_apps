import { createStore, applyMiddleware, } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { logger } from 'redux-logger';
import RootReducer from '../reducers/RootReducer';
import RootSaga from '../saga/RootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    RootReducer,
   applyMiddleware(sagaMiddleware, logger),
);
sagaMiddleware.run(RootSaga);

export default store;
