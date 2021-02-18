import { combineReducers } from 'redux';
import TokenReducer from '../reducers/TokenReducer';
import UserReducer from '../reducers/UserReducer'
import PostReducer from './PostReducer'
import SongReducer from './SongReducer';
import MessageReducer from './MessageReducer'
import PlayerReducer from './PlayerReducer'

const allReducers = combineReducers({
    TokenReducer: TokenReducer,
    UserReducer: UserReducer,
    PostReducer: PostReducer,
    SongReducer: SongReducer,
    MessageReducer: MessageReducer,
    PlayerReducer: PlayerReducer
});


const RootReducer = (state, action) => {
    return allReducers(state, action)
};

export default RootReducer