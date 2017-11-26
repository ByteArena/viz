// @flow

import { combineReducers } from 'redux';

import { agents } from './agents';
import { status } from './status';
import { settings } from './settings';

export default combineReducers({
    agents,
    status,
    settings,
});
