// @flow

import { combineReducers } from 'redux';
import { agents } from './agents';
import { status } from './status';

export default combineReducers({
    agents,
    status,
});
