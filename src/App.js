import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import MQTT from "mqtt";

class App extends Component {
  mqttSub = () => {
    const client = MQTT.connect({
      port: 9001,
      host: "ns.lab240.ru",
      // clientId:
      //   "ui_" +
      //   Math.random()
      //     .toString(16)
      //     .substr(2, 8),
      path: "/mqtt",
      protocol: "ws",
      username: "gleb",
      password: "12344321"
    });

    client.on("connect", () => {
      console.log("connected");
      client.subscribe("/gleb/dev1/out/time_up", { qos: 1 }, error => {
        // console.error(error);
        if (!error) {
          console.log("subscribed");
        }
      });
      client.on("message", (topic, message) => {
        console.log("topic", topic, message);
      });
    });
  };
  componentDidMount() {
    this.mqttSub();
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
