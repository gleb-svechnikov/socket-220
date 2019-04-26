import React, { Component } from "react";
import "./App.css";
import MQTT from "mqtt";
import RTChart from "react-rt-chart";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      open: true,
      devices: [],
      port: "",
      username: "",
      fulfilled: false,
      password: "",
      uptime: "",
      tempIn: {
        date: new Date(),
        degrees: 0
      },
      tempOut: {
        date: new Date(),
        degrees: 0
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
      console.log("connected", this.state.devices);
      for (const device of this.state.devices) {
        client.subscribe(
          "/" + user + "/" + device + "/out/time_up",
          { qos: 1 },
          error => {
            // console.error(error);
            if (!error) {
              console.log("subscribed");
              console.log(this.state.data);
            }
          }
        );
        client.subscribe(
          "/" + user + "/" + device + "/out/temp_out",
          { qos: 1 },
          error => {
            // console.error(error);
            if (!error) {
              console.log("subscribed");
              // console.log(this.state.data);
            }
          }
        );
        client.subscribe(
          "/" + user + "/" + device + "/out/temp_in",
          { qos: 1 },
          error => {
            // console.error(error);
            if (!error) {
              console.log("subscribed");
              // console.log(this.state.data);
            }
          }
        );
      }

      client.on("message", (topic, message) => {
        console.log(topic, this.uintToString(message));
        if (
          topic ===
          "/" + user + "/" + this.state.devices[0] + "/out/time_up"
        ) {
          this.setState({ uptime: this.uintToString(message) });
        }
        if (
          topic ===
          "/" + user + "/" + this.state.devices[0] + "/out/temp_out"
        ) {
          this.setState({
            tempOut: { date: new Date(), degrees: this.uintToString(message) }
          });
        }
        if (
          topic ===
          "/" + user + "/" + this.state.devices[0] + "/out/temp_in"
        ) {
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
  changeDevices = event => {
    console.log("Devices", event.target.value);
    this.setState({
      devices: event.target.value.replace(/\s/g, "").split(",")
    });
  };

  componentDidMount() {
    setInterval(() => this.forceUpdate(), 6000);
  }
  onSubmit = event => {
    event.preventDefault();
    this.setState({
      fulfilled: true,
      open: false
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
    const {
      open,
      url,
      port,
      fulfilled,
      username,
      devices,
      password,
      uptime,
      tempOut,
      tempIn
    } = this.state;
    console.log(tempOut, tempIn);

    return (
      <main className="App">
        <details open={open}>
          <summary>
            {!fulfilled ? "Connection credetials" : "Connected"}
          </summary>
          <form onSubmit={this.onSubmit}>
            <fieldset>
              <label htmlFor="domain">Domain</label>
              <input
                type="url"
                id="domain"
                value={url}
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
                value={port}
                required
                onChange={this.changePort}
                placeholder="9001"
              />
            </fieldset>
            <fieldset>
              <label htmlFor="devices">Devices</label>
              <input
                type="text"
                id="devices"
                value={devices.toString()}
                required
                onChange={this.changeDevices}
                placeholder="dev1, dev2"
              />
            </fieldset>
            <fieldset>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
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
                value={password}
                required
                onChange={this.changePassword}
              />
            </fieldset>

            <button type="submit">Connect</button>
          </form>
        </details>

        {this.state.fulfilled && (
          <>
            <h2>Uptime {uptime}</h2>
            <hr />
            <h2>Temperature outside ℃</h2>
            <RTChart chart={chart} fields={["degrees"]} data={tempOut} />
            <hr />
            <h2>Socket temperature ℃</h2>
            <RTChart chart={chart} fields={["degrees"]} data={tempIn} />
          </>
        )}
      </main>
    );
  }
}

export default App;
