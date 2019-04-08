import React, { Component } from "react";
import "./App.css";
import MQTT from "mqtt";
import RTChart from "react-rt-chart";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      }
    };
  }

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
          console.log(this.state.data);
        }
      });
      client.on("message", (topic, message) => {
        // if (topic === " /gleb/dev1/out/time_up") {
        //   debugger;
        // }
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
        console.log("topic", topic, this.state.data);
      });
    });
  };

  componentDidMount() {
    setInterval(() => this.forceUpdate(), 6000);
    this.mqttSub();
  }
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
      </main>
    );
  }
}

export default App;
