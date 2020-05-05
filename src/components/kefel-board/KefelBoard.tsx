import React, { SyntheticEvent } from "react";
import classnames from "classnames";
import "./KefelBoard.scss";
import { KefelBoardCell, initBoard, KefelBoardConfig, BoardOperation, BoardOperationTypes } from "./KefelBoardUtils";
import { isEqual } from "lodash";

type AnswerMap = Map<string, number | undefined>
const emptyMap = (): AnswerMap => new Map<string, number|undefined>()

interface KefelBoardProps {
  maxNumber: number;
  operation: string
}

interface KefelBoardState {
  boardConfig?: KefelBoardConfig;
  selectedCol?: number;
  selectedRow?: number;
  answers: AnswerMap;
  typedAnswer?: string;
  isComplete: boolean;
  maxNumber: number;
  operation: string
}

export default class KefelBoard extends React.Component<
  KefelBoardProps,
  KefelBoardState
> {
  constructor(props: KefelBoardProps) {
    super(props);
    const { maxNumber, operation } = this.props
    const boardConfig: KefelBoardConfig = initBoard(maxNumber, operation);

    this.state = {
      maxNumber,
      operation,
      boardConfig,
      selectedCol: undefined,
      selectedRow: undefined,
      typedAnswer: undefined,
      answers: emptyMap(),
      isComplete: false,
    };
  }

  resetState = (newMaxNumber?: number, newOperation?: string) => {
    const { operation, maxNumber } = this.state
    const boardConfig = initBoard(newMaxNumber || maxNumber, newOperation || operation);
    const answers = emptyMap();
    this.setState({
      maxNumber: newMaxNumber || maxNumber,
      operation: newOperation || operation,
      boardConfig,
      isComplete: false,
      selectedCol: undefined,
      selectedRow: undefined,
      answers,
    });
  }

  updateMaxNumber = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;
    const { operation } = this.state
    const maxNumber = parseInt(value);
    this.resetState(maxNumber, operation)
  };

  updateOperation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;
    const { maxNumber } = this.state
    this.resetState(maxNumber, value)
  }

  getSelectNumberOptions = () => {
    const options = [];
    for (let i = 2; i <= 10; i++) {
      options.push(
        <option key={i} defaultValue={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  getSelectOperationOptions = () => {
    return Object.keys(BoardOperation)
      .map(op => {
        const value = (BoardOperation as any)[op]
        return <option value={value} key={op}>{value}</option>
      })
  }

  renderValues = () => {
    const { selectedCol, selectedRow, answers, boardConfig } = this.state;

    if (boardConfig && boardConfig.answers && boardConfig.values) {
      const baseClassName = "kefel-board_board";
      const { values: boardValues } = boardConfig;

      const rows = boardValues.map((row, index) => {
        const rowClass = classnames(baseClassName, `${baseClassName}_row`);

        const cells = row.map((cell: KefelBoardCell) => {
          const { isColumnHeader, isRowHeader, value, key, row, col } = cell;
          const currentAnswer = answers.get(key);

          const cellClass = classnames(rowClass, {
            [`${rowClass}_value`]: !isColumnHeader && !isRowHeader,
            [`${rowClass}_value--selected`]: !isColumnHeader && !isRowHeader,
            [`${rowClass}_value--correct`]: value === currentAnswer,
            [`${rowClass}_value--wrong`]:
              !!currentAnswer && value !== currentAnswer,
            [`${rowClass}_header`]: isColumnHeader || isRowHeader,
            [`${rowClass}_header--selected`]:
              (isColumnHeader && row === selectedRow) ||
              (isRowHeader && col === selectedCol),
          });

          if (isColumnHeader || isRowHeader) {
            return (
              <div key={key} className={cellClass}>
                {value}
              </div>
            );
          } else {
            return (
              <div key={key} className={cellClass}>
                <input
                  type="text"
                  placeholder="?"
                  onFocus={this.onTextInputFocus.bind(this, col, row)}
                  onChange={this.onTextInputChange}
                  value={currentAnswer || ""}
                />
              </div>
            );
          }
        });

        return (
          <div key={`row_${index}`} className={rowClass}>
            {cells}
          </div>
        );
      });

      return rows;
    }
  };

  /**
   * Updates the selected column and row
   */
  onTextInputFocus = (col: number, row: number) => {
    this.setState({
      selectedCol: col,
      selectedRow: row,
      typedAnswer: undefined,
    });
  };

  /**
   * Updates the current answer for this cell, and checks for completion state
   */
  onTextInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { answers, selectedCol, selectedRow, boardConfig } = this.state;
    const { value } = e.currentTarget;
    const key = `${selectedRow}_${selectedCol}`;
    answers.set(key, !!value ? parseInt(value) : undefined);
    const isComplete = isEqual(boardConfig?.answers, answers);

    this.updateBoardState({ answers, typedAnswer: value, isComplete });
  };

  updateBoardState = (newState: Partial<KefelBoardState>) => {
    const { answers, typedAnswer, isComplete } = newState
    this.setState({ answers: answers || emptyMap(), typedAnswer, isComplete: isComplete || false });
  }

  render() {
    const { maxNumber, operation } = this.state;
    const { selectedRow, selectedCol, typedAnswer, isComplete } = this.state;
    const title = `לוח הכפל עד ${maxNumber}`;
    return (
      <div className="kefel-board">
        {isComplete && (
          <div className="kefel-board_complete" dir="rtl">
            כל הכבוד!!!
            <br />
            <img src="assets/images/puppy.jpg" alt="" />
          </div>
        )}
        <div className="kefel-board_title">{title}</div>
        {selectedCol && selectedRow && (
          <div className="kefel-board_equation">
            {selectedRow} {operation} {selectedCol} = {typedAnswer || "?"}{" "}
          </div>
        )}
        <div className="kefel-board_board">{this.renderValues()}</div>
        <div dir="rtl" className="kefel-board_select-number">
          בחרו מספר
          <select onChange={this.updateMaxNumber} defaultValue={maxNumber}>
            {this.getSelectNumberOptions()}
          </select>
        </div>
        <div dir="rtl" className="kefel-board_select-number">
          בחרו פעולה
          <select onChange={this.updateOperation} defaultValue={operation}>
            {this.getSelectOperationOptions()}
          </select>
        </div>
      </div>
    );
  }
}
