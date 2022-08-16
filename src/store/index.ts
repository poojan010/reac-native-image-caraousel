

import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';

import { tempReducer } from './reducers'

const rootReducer = combineReducers({
    tempReducer
});

// Middleware: Redux Persist Config
const persistConfig = {
    // Root?
    key: 'root',
    // Storage Method (React Native)
    storage: AsyncStorage,
    timeout: 0,
    // Whitelist (Save Specific Reducers)
    whitelist: [


    ],
    // Blacklist (Don't Save Specific Reducers)
    blacklist: [

    ],
};


// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(
    persistedReducer,
    compose(applyMiddleware(thunk)),
);

// Middleware: Redux Persist Persister
let persistor = persistStore(store);

export { store, persistor };