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
      data: {
        date: new Date(),
        val1: 0,
        val2: 0,
        val3: 0,
        val4: 0,
        val5: 0,
        val6: 0,
        val7: 0,
        val8: 0
      },
      temp: {
        date: new Date(),
        val01: 0,
        val02: 0,
        val03: 0,
        val04: 0,
        val05: 0,
        val06: 0,
        val07: 0
      }
    };
  }

  mqttSub = (protocol, host, port, user, pass) => {
    const client = MQTT.connect({
      port: port,
      host: host,
      // clientId:
      //   "ui_" +
      //   Math.random()
      //     .toString(16)
      //     .substr(2, 8),
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
      client.on("message", (topic, message) => {
        console.log(topic, message);

        if (topic === "/" + user + "/dev1/out/time_up") {
          this.setState({
            data: {
              date: new Date(),
              val1: message[0],
              val2: message[1],
              val3: message[2],
              val4: message[3],
              val5: message[4],
              val6: message[5],
              val7: message[6],
              val8: message[7]
            }
          });
        }
        if (topic === "/" + user + "/dev1/out/temp_out") {
          this.setState({
            temp: {
              date: new Date(),
              val01: message[0],
              val02: message[1],
              val03: message[2],
              val04: message[3],
              val05: message[4],
              val06: message[5],
              val07: message[6]
            }
          });
        }

        // console.log("topic", topic, this.state.data);
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
            <RTChart
              chart={chart}
              fields={[
                "val1",
                "val2",
                "val3",
                "val4",
                "val5",
                "val6",
                "val7",
                "val8"
              ]}
              data={this.state.data}
            />
            <RTChart
              chart={chart}
              fields={[
                "val01",
                "val02",
                "val03",
                "val04",
                "val05",
                "val06",
                "val07"
              ]}
              data={this.state.temp}
            />
          </>
        )}
      </main>
    );
  }
}

export default App;
