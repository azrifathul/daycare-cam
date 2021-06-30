import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Viewer from "./viewer";
import Monitoring from "./monitoring";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/monitoring/:cameraId" exact>
            <Monitoring />
          </Route>
          <Route path="/viewer/:cameraId" exact>
            <Viewer />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
