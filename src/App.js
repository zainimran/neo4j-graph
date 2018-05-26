import React, { Component } from 'react';
import './App.css';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8000');

class CreateNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  render() {
    return(
      <div>
        <input
          ref="searchBarEnter0"
          className="form-control form-control-dark w-100"
          type="text"
          onChange={this.handleChange}
          placeholder="Enter Node Name"
          aria-label="Search0"
          value={this.state.value}
        />
        <button onClick={() => {
          socket.emit('add_node', this.state.value);
          this.setState({ value: '' });
        }}>Add Node</button>
      </div>
    );
  }
}

class CreateLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value1: '',
      value2: '',
    };

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }

  handleChange1(e) {
    this.setState({value1: e.target.value});
  }

  handleChange2(e) {
    this.setState({value2: e.target.value});
  }

  render() {
    return(
      <div>
        <input
          ref="searchBarEnter1"
          className="form-control form-control-dark w-100"
          type="text"
          onChange={this.handleChange1}
          placeholder="Enter First Node Name"
          aria-label="Search1"
          value={this.state.value1}
        />
        <input
          ref="searchBarEnter2"
          className="form-control form-control-dark w-100"
          type="text"
          onChange={this.handleChange2}
          placeholder="Enter Second Node Name"
          aria-label="Search2"
          value={this.state.value2}
        />
        <button onClick={() => {
          socket.emit('add_link', [this.state.value1, this.state.value2]);
          this.setState({ value1: '', value2: '' });
        }}>Add Link</button>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <h1>Create a Graph Database</h1>
        </header>
        <CreateNode/>
        <CreateLink/>
      </div>
    );
  }
}

export default App;
