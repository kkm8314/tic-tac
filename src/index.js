import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

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

function calculateWinner(squares) {
  // 정답들
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  /**
  * 정답 들 중
  * squares
  */
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    // 삼단논법으로
    // squares[a]가 존재하고
    // squares[a] === squares[b]이고
    // squares[a] === squares[c]라면
    // squares[a] === squares[c]이므로
    // squares[a] === squares[b] === squares[c]이다
    // 따라서 squares[a]를 winner로 함
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Game extends React.Component {
  /**
  * state는
  *
  * history
  * stepNumber
  * xIsNext
  */
  constructor(props) {
    super(props);

    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    console.log('핸들클릭 history : ', history)
    const current = history[history.length - 1];
    // 즉 여기 squares는 맨마지막 squares를 갖고온거임
    // slice() with no argument is equivalent to 'slice(0)'
    // 왜 slice()가 빠지면 피드백이 안뜨지?

    // slice()만하면 깊은복사됨
    const squares = current.squares.slice();

    //console.log('squares with slice()', squares);
    //console.log('squares with no slice', current.squares);

    // 이렇게 slice()를 빼면 jumpTo에서 Board에 제대로된 피드백이 안됨
    // 그대로 X or O가 찍혀있음
    // const squares = current.squares;

    // 맨마지막 squares를 이용해서 승자가 나왔다면
    // 혹은 현재도 squares[i]가 있다면 아무것도 리턴안함
    if (calculateWinner(squares) || squares[i]) {
      return;
      //   console.log('hey');
    }

    // after previous click, xIsNext became !prev
    // so this time, if i click something, !prev
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // 그리고 히스토리에는 현재 히스토리 array 뒤에
    // 새로운 square 히스토리를 넣음
    // 그리고 현재 턴을 알려주는 stepNumber는 history.length
    // 지금 클릭을 하면 xIsNext는 현재랑 반대인 걸로 지정
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  /*
   go to #number를 클릭하면 stepNumber를 현재 #number로 되돌려줌
   그러면 handleClick에 있는 history까지 이의 영향을 받게됨
   왜냐하면
   
   const history = this.state.history.slice(0, this.state.stepNumber + 1);
   에서 끝부분을 stepNumber로 마무리 짓고 있기 때문이다
 */

  // 그리고 현재숫자가 2로 나뉘어떨어지면 true
  // 그렇다면 다음은 'X'
  // 아니면 false
  // 그렇다면 다음은 'O'
  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: move % 2 === 0
    });
  }

  render() {
    // state에서 history변수로 가져옴
    // 현재 stepNumber의 {squares: squares}를 가져옴
    // 현재 squares에서 winner가 나왔으면 winner변수로 가져옴
    const history = this.state.history;
    console.log('렌더 history : ', history)

    //jumpTo를 통해 이게 바뀜
    const current = history[this.state.stepNumber];
    console.log('렌더 current ', current)
    const winner = calculateWinner(current.squares);

    // React.Component를 통해서 render()를 비롯한
    // 나머지 Lifecycle Method에서는
    // this는 class와 bind됨

    // console.log('this: ', this); //Game component

    // const a = function() {
    //     console.log("history: ", history);
    //     console.log('this: ', this); // undefined
    //     console.log(b); // undefined
    // };

    const moves = history.map((step, move) => {
      const desc = move ? '움직이세요!! ' + move : '시작으로 가세요';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}> {desc} </button>
        </li>
      );
    });

    let status;
    if (winner) {
      // winner가 있다면 뽑기
      status = '승자는?!!: ' + winner;
    } else {
      //winner가 없다면 이걸
      status = '다음 주자는 : ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div> {status} </div>
          <ol> {moves} </ol>
        </div>
      </div>
    );
  }
}

export default Game;

ReactDOM.render(<Game />, document.getElementById("root"));
