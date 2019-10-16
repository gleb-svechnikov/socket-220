import React, { Component } from "react";
import "./App.css";
import MQTT from "mqtt";
import RTChart from "react-rt-chart";
import LoginForm from './LoginForm/LoginForm.js'
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      fulfilled: false,
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
      if(this.state.devices && this.state.devices.length > 0){
        for (const device of this.state.devices) {
          client.subscribe(
            "/" + user + "/" + device + "/out/time_up",
            { qos: 1 },
            error => {
              console.error(error);
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
              console.error(error);
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


  componentDidMount() {
    setInterval(() => this.forceUpdate(), 6000);

    if(localStorage.getItem('credetials') && localStorage.getItem('credetials').length > 0){
      const credetials = JSON.parse(localStorage.getItem('credetials'))
      const parser = document.createElement("a");
      parser.href = credetials.url;
      console.log(parser.protocol.slice(0, -1),
      parser.hostname,
      credetials.port,
      credetials.username,
      credetials.password);
      this.mqttSub(
        parser.protocol.slice(0, -1),
        parser.hostname,
        credetials.port,
        credetials.username,
        credetials.password
      );
      this.setState({
        fulfilled: true,
        open: false
      });
    }
  }
  onSubmit = (data) => {
    const parser = document.createElement("a");
    parser.href = data.url;
    this.setState({
      fulfilled: true,
      open: false
    });

    if(localStorage.getItem('credetials') === null){
        localStorage.setItem('credetials', JSON.stringify(data));
    }

    this.mqttSub(
      parser.protocol.slice(0, -1),
      parser.hostname,
      data.port,
      data.username,
      data.password
    );
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
      fulfilled,
      uptime,
      tempOut,
      tempIn
    } = this.state;
    console.log(tempOut, tempIn);

    return (
      <main className="App">
        <details open={open}>
          <summary>
            {!fulfilled ? "Please connect" : "Connected"}
          </summary>
          <LoginForm provideCredentials={this.onSubmit} />
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
