import React, { Component } from "react";
import "./App.css";
import MQTT from "mqtt";
import RTChart from "react-rt-chart";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      port: "",
      username: "",
      fulfilled: false,
      password: "",
      uptime: "",
      tempIn: {
        date: new Date(),
        degrees: null
      },
      tempOut: {
        date: new Date(),
        degrees: null
      }
    };
  }
  uintToString = uintArray => {
    var encodedString = String.fromCharCode.apply(null, uintArray),
      decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
  };
  mqttSub = (protocol, host, port, user, pass) => {
    const client = MQTT.connect({
      port: port,
      host: host,
      path: "/mqtt",
      protocol: protocol,
      username: user,
      password: pass
    });

    client.on("connect", () => {
      console.log("connected");
      client.subscribe("/" + user + "/dev1/out/time_up", { qos: 1 }, error => {
        // console.error(error);
        if (!error) {
          console.log("subscribed");
          console.log(this.state.data);
        }
      });
      client.subscribe("/" + user + "/dev1/out/temp_out", { qos: 1 }, error => {
        // console.error(error);
        if (!error) {
          console.log("subscribed");
          // console.log(this.state.data);
        }
      });
      client.subscribe("/" + user + "/dev1/out/temp_in", { qos: 1 }, error => {
        // console.error(error);
        if (!error) {
          console.log("subscribed");
          // console.log(this.state.data);
        }
      });
      client.on("message", (topic, message) => {
        console.log(topic, this.uintToString(message));

        if (topic === "/" + user + "/dev1/out/time_up") {
          this.setState({ uptime: this.uintToString(message) });
        }
        if (topic === "/" + user + "/dev1/out/temp_out") {
          this.setState({
            tempOut: { date: new Date(), degrees: this.uintToString(message) }
          });
        }
        if (topic === "/" + user + "/dev1/out/temp_in") {
          this.setState({
            tempIn: { date: new Date(), degrees: this.uintToString(message) }
          });
        }
      });
    });
  };
  changeURL = event => {
    this.setState({ url: event.target.value });
  };
  changePort = event => {
    this.setState({ port: event.target.value });
  };
  changeUsername = event => {
    console.log(event.target.value);

    this.setState({ username: event.target.value });
  };
  changePassword = event => {
    console.log(event.target.value);
    this.setState({ password: event.target.value });
  };
  componentDidMount() {
    setInterval(() => this.forceUpdate(), 6000);
  }
  onSubmit = event => {
    event.preventDefault();
    this.setState({
      fulfilled: true
    });
    console.log(
      this.state.url,
      this.state.port,
      this.state.username,
      this.state.password
    );
    var parser = document.createElement("a");
    parser.href = this.state.url;
    // console.log(parser.protocol.slice(0, -1), parser.hostname);
    this.mqttSub(
      parser.protocol.slice(0, -1),
      parser.hostname,
      this.state.port,
      this.state.username,
      this.state.password
    );
    return false;
  };
  render() {
    const chart = {
      //   axis: {
      //     // y: { min: 10, max: 70 }
      //   },
      //   point: {
      //     // show: false
      //   }
    };
    return (
      <main className="App">
        <form onSubmit={this.onSubmit}>
          <fieldset>
            <label htmlFor="domain">Domain</label>
            <input
              type="url"
              id="domain"
              value={this.state.url}
              required
              onChange={this.changeURL}
              placeholder="ws://test.net"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="port">Port</label>
            <input
              type="number"
              id="port"
              value={this.state.port}
              required
              onChange={this.changePort}
              placeholder="9001"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={this.state.username}
              required
              onChange={this.changeUsername}
              placeholder="user1"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={this.state.password}
              required
              onChange={this.changePassword}
            />
          </fieldset>

          <button type="submit">Connect</button>
        </form>
        {this.state.fulfilled && (
          <>
            <h2>Uptime {this.state.uptime}</h2>
            <hr />
            <h2>Temperature outside ℃</h2>
            <RTChart
              chart={chart}
              fields={["degrees"]}
              data={this.state.tempOut}
            />
            <hr />
            <h2>Socket temperature ℃</h2>
            <RTChart
              chart={chart}
              fields={["degrees"]}
              data={this.state.tempIn}
            />
          </>
        )}
      </main>
    );
  }
}

export default App;
