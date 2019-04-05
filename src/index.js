import React from "react";
import ReactDOM from "react-dom";
import Amplify from "aws-amplify";
import App from "./App";

import configurations from "./aws-exports";

Amplify.configure(configurations);

ReactDOM.render(<App />, document.getElementById("root"));
