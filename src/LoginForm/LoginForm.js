import React, { Component } from "react";
import "./LoginForm.css";
class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "",
            devices: [],
            port: "",
            username: "",
            password: "",

        };
    }
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
    onSubmit = event => {
        event.preventDefault();

        this.props.provideCredentials({
          url: this.state.url,
          port: this.state.port,
          username: this.state.username,
          password:  this.state.password
        })

        return false;
    }
    render() {
      const {
        url,
        port,
        username,
        devices,
        password,
      } = this.state;
        return ( <form onSubmit={this.onSubmit}>
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
            </form>)
        }
    }

    export default (LoginForm)
