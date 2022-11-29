import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";

import "./arcade.ttf";
import "./PathfindingVisualizer.css";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      speed: 1,
      grid: [],
      mouseIsPressed: false,
    };
  }

  setSpeed() {
    let currSpeed = this.state.speed;
    currSpeed *= 5;
    if (currSpeed > 25) currSpeed = 1;
    this.setState({
      speed: currSpeed,
    });
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  generateWeightedMaze() {
    this.resetBoard();
    for (let i = 0; i < 300; i++) {
      let row = Math.floor(Math.random() * 20);
      let col = Math.floor(Math.random() * 50);
      if (
        this.state.grid[row][col].weight === 0 &&
        (row !== START_NODE_ROW || col !== START_NODE_COL) &&
        (row !== FINISH_NODE_ROW || col !== FINISH_NODE_COL)
      ) {
        setTimeout(() => {
          getNewGridWithWeightToggled(this.state.grid, row, col);
          document.getElementById(`node-${row}-${col}`).className =
            "node node-weighted-maze";
        }, 35 * col);
      }
    }
  }

  //have loop that iterates 200 times and fill in random values as isWall
  generateMaze() {
    this.resetBoard();
    for (let i = 0; i < 300; i++) {
      let row = Math.floor(Math.random() * 20);
      let col = Math.floor(Math.random() * 50);
      if (
        this.state.grid[row][col].isWall === false &&
        (row !== START_NODE_ROW || col !== START_NODE_COL) &&
        (row !== FINISH_NODE_ROW || col !== FINISH_NODE_COL)
      ) {
        setTimeout(() => {
          getNewGridWithWallToggled(this.state.grid, row, col);
          this.setState({ mouseIsPressed: true });
          this.setState({ mouseIsPressed: false });
          document.getElementById(`node-${row}-${col}`).className =
            "node node-maze";
        }, 35 * col);
      }
    }
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    let currSpeed = this.state.speed;
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i * currSpeed);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i * currSpeed);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 65 * i);
    }
  }

  resetBoard() {
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++)
        document.getElementById(`node-${row}-${col}`).className = "node node";
    }
    document.getElementById(
      `node-${START_NODE_ROW}-${START_NODE_COL}`
    ).className = "node node-start";
    document.getElementById(
      `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
    ).className = "node node-finish";
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAstar() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDFS() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  addMine() {
    const newGrid = this.state.grid;
    let row = Math.floor(Math.random() * 15) + 5;
    let col = Math.floor(Math.random() * 34) + 16;
    if (
      (row === START_NODE_ROW && col === START_NODE_COL) ||
      (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
    ) {
      row += 1;
      col += 1;
    }
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isBomb: true,
    };
    newGrid[row][col] = newNode;
    this.setState({
      grid: newGrid,
    });
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <>
        <div class="header">
          <button class="button-55" onClick={() => this.visualizeDijkstra()}>
            Dijkstra
          </button>
          <button class="button-55" onClick={() => this.visualizeAstar()}>
            A* Search
          </button>
          <button class="button-55" onClick={() => this.visualizeDFS()}>
            DFS
          </button>
        </div>
        <div class="tools">
          <button class="tool-bar" onClick={() => this.generateMaze()}>
            Maze
          </button>
          <button class="tool-bar" onClick={() => this.generateWeightedMaze()}>
            Weight
          </button>
          <button class="tool-bar" onClick={() => this.resetBoard()}>
            Clear
          </button>
          <button class="tool-bar" onClick={() => this.setSpeed()}>
            Speed
          </button>
          <button class="tool-bar" onClick={() => this.addMine()}>
            Mine
          </button>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {
                    row,
                    col,
                    isFinish,
                    isStart,
                    isWall,
                    weight,
                    isBomb,
                  } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      weight={weight}
                      isBomb={isBomb}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div
          style={{
            background: "rgb(8,4,1)",
            width: "420px",
            height: "60px",
            margin: "20px 503px 0px",
            outline: "1px dashed whitesmoke",
          }}
        >
          <div style={{ background: "#5270F2" }} class="footer"></div>
          <p
            style={{
              margin: "0px 0px 40px",
              display: "inline-block",
              width: "100px",
              color: "whitesmoke",
              fontFamily: "arcade",
              fontSize: "9px",
            }}
          >
            Start Node
          </p>
          <div style={{ background: "#EB7D5F" }} class="footer"></div>
          <p
            style={{
              display: "inline-block",
              width: "100px",
              color: "whitesmoke",
              fontFamily: "arcade",
              fontSize: "9px",
            }}
          >
            Finish Node
          </p>
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    weight: 0,
    isBomb: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithWeightToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  let newWeight = Math.floor(Math.random() * 5) + 1;
  const newNode = {
    ...node,
    weight: newWeight,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
