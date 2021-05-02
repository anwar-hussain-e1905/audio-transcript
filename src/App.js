import './App.css';
import AudioPlayer from './components/AudioPlayer';
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <AudioPlayer />
      </div>
    </Provider>
  );
}

export default App;
