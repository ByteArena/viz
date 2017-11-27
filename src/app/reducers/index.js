// @flow

import { combineReducers } from 'redux';

import { agents } from './agents';
import { status } from './status';
import { settings } from './settings';
import { game } from './game';

export default combineReducers({
    agents,
    status,
    settings,
    game,
});
