import React from "react";
import { WordSearchGenerator } from "../helpers/WordSearchGenerator";
import Grid from "./Grid";

class WordSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.wsGenerator = new WordSearchGenerator();
    this.wsGenerator.setGridSize();
    this.wsGenerator.initGrid();
    this.wsGenerator.populateUnusedBoxes();
  }

  render() {
    return (
      <div id="root-container">
        <Grid ws={this.wsGenerator} />
      </div>
    );
  }
}

export default WordSearch;
