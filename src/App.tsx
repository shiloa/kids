import React from 'react';
import './App.scss';
import KefelBoard from './components/kefel-board/KefelBoard';
import { BoardOperation } from './components/kefel-board/KefelBoardUtils';

interface AppState {
  maxNumber: number
}

export default class App extends React.Component<{}, AppState> {
  state: AppState = {
    maxNumber: 3
  }

  renderBoard = () => {
    const { maxNumber } = this.state
    return  <KefelBoard maxNumber={maxNumber} operation={BoardOperation.MULTIPLY}></KefelBoard>
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
