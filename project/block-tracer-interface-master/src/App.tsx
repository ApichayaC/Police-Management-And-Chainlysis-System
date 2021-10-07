import Topbar from './components/Topbar';
import Manual from './pages/Manual';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Label from './pages/Label';
import Home from './pages/Home';
import firebase from 'firebase';
import config from './config';

firebase.initializeApp(config.FIREBASE);

function App() {
  return (
    <Router>
      <Topbar />
      <div className="px-10 py-4">
        <Switch>
          <Route path="/label">
            <Label />
          </Route>
          <Route path="/manual">
            <Manual />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
