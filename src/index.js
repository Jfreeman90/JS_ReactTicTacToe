import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

//each square of the tic tac toe board
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

//board made of multiple squares
class Board extends React.Component {
  //get the value of each square out of the construced array. send a value and onclick function back to the square
  renderSquare(i) {
    return <Square value={this.props.squares[i]}
                  onClick={()=> this.props.onClick(i)}
           />;
  }
  
  //redraw the game state
  render() {
    return (
    <div>
      <div className="board-row">
      {this.renderSquare(0)}
      {this.renderSquare(1)}
      {this.renderSquare(2)}
      </div>
      <div className="board-row">
      {this.renderSquare(3)}
      {this.renderSquare(4)}
      {this.renderSquare(5)}
      </div>
      <div className="board-row">
      {this.renderSquare(6)}
      {this.renderSquare(7)}
      {this.renderSquare(8)}
      </div>
    </div>
    );
  }
}

//game made out of a board component and divs.
class Game extends React.Component {
  //history will store all of the previous game states
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }
  
  //function to handle the click
  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    //check for winner or if a square already has a value in it
    if(calculateWinner(squares) || squares[i]){
      return
    }
    //check who's go it is
    if(this.state.xIsNext){
      squares[i]='X'
    }
    else {
      squares[i]='O'
    }
    //update the state
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  //change the step/game moves and if the value is even then we must have an X's turn.
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  //reset game and redraw an empty board
  resetGame(){
    //update the state
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    })
  }

  //render the game board
  render() {
    //get the game history and current game state
    const history = this.state.history
    const current = history[this.state.stepNumber]
    //get all of the games history
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
      return (
      <div className="game">
          <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          </div>
          <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          </div>
          <div>
          <button className='reset-button' onClick={()=> this.resetGame()}>Reset</button>
          </div>
      </div>
      );
}
}

// ========================================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

//function to evaluate the winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
