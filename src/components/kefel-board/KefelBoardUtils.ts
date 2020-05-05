export interface KefelBoardCell {
  key: string;
  value: number | string;
  row: number;
  col: number;
  isRowHeader: boolean;
  isColumnHeader: boolean;
}


export interface BoardOperationTypes {
  MULTIPLY: 'MULTIPLY'
  ADD: 'ADD'
}

export const BoardOperation = {
  MULTIPLY: "×",
  ADD: "+",
};

export interface KefelBoardConfig {
  values: KefelBoardCell[][];
  answers: Map<string, number | undefined>;
}

class OperationError extends Error {}

const applyOperation = (i: number, j: number, operation: string) => {
  if (operation === BoardOperation.ADD) {
    return i + j;
  } else if (operation === BoardOperation.MULTIPLY) {
    return i * j;
  }
  throw new OperationError(`unknown operation ${operation}`);
};

/**
 * generate range of board values
 * @param maxNumber range to produce
 */
export function initBoard(
  maxNumber: number,
  operation: string
): KefelBoardConfig {
  const values = [];
  const answers: Map<string, number | undefined> = new Map();

  for (let i = 0; i <= maxNumber; i++) {
    const row: KefelBoardCell[] = [];
    for (let j = 0; j <= maxNumber; j++) {
      const key = `${i}_${j}`;
      const cell: KefelBoardCell = {
        row: i,
        col: j,
        key,
        isColumnHeader: j === 0,
        isRowHeader: i === 0,
        value:
          j === 0 && i === 0
            ? operation
            : i === 0
            ? j
            : j === 0
            ? i
            : applyOperation(i, j, operation),
      };
      if (i !== 0 && j !== 0) {
        answers.set(key, applyOperation(i, j, operation));
      }
      row.push(cell);
    }

    values.push(row);
  }

  return { values, answers };
}
