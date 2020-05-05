import React from 'react';
import './App.scss';
import KefelBoard from './components/kefel-board/KefelBoard';

interface AppState {
  maxNumber: number
}

export default class App extends React.Component<{}, AppState> {
  state: AppState = {
    maxNumber: 3
  }


  renderBoard = () => {
    const { maxNumber } = this.state
    return  <KefelBoard maxNumber={maxNumber}></KefelBoard>
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.renderBoard()}
        </header>
      </div>
    );
  }
}
