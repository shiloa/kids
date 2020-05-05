import React from "react";

interface KefelBoardNumberProps {
    value: number
}

export default class KefelBoardNumber extends React.Component<KefelBoardNumberProps> {
    render() {
        return (
            <div className="kefel-board-number">
                {this.props.value}
            </div>
        )
    }
}