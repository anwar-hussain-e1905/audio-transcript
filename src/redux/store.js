import { createStore } from "redux";
import rootReducer from "./reducers";
import { batchedSubscribe } from 'redux-batched-subscribe';
import debounce from 'lodash.debounce';

const debounceNotify = debounce(notify => notify());

export default createStore(rootReducer, {}, batchedSubscribe(debounceNotify));
