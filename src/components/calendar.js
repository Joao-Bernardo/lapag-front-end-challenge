import React, { Component } from "react";
import PopUpButton from "./popup";
import { PopupboxContainer } from 'react-popupbox';
import { minutesToHours } from "../mocks/functions";
import "./calendar.css";

class Calendar extends React.Component {
  tableHeaders(){
    var colCount = this.props.professionals.length;
    var firstRow = [];
    firstRow.push(<th className="Calendar-table-cell-row-header"></th>);
    for (let i=0; i<colCount; i++) {
      firstRow.push(<th className="Calendar-table-cell-column-header">{this.props.professionals[i].name}</th>);
    }
    return <tr>{firstRow}</tr>;
  }

  tableRows(){
    var timeUnit = this.props.serviceMinTime;
    var rowsCount = this.props.openHours*(60/timeUnit);
    var colCount = this.props.professionals.length;
    var rowsArray = [];
    for (let i=0; i<rowsCount; i++) {
      var row = [];
      row.push(<td className="Calendar-table-cell-row-header">{minutesToHours(i*timeUnit)}</td>);
      for (let k=0; k<colCount; k++){
        row.push(
          <td className="Calendar-table-cell">
            <PopUpButton
              scheduleClick= {(props, selecteds, isRemove) => this.props.scheduleClick(props, selecteds, isRemove)}
              schedules= {this.props.schedules}
              cellTime= {i*timeUnit}
              openHours = {this.props.openHours}
              timeUnit = {timeUnit}
              cellEmployee= {this.props.professionals[k]}
              cellDate = {this.props.date}
              professionals= {this.props.professionals}
              services= {this.props.services}
              clients= {this.props.clients}
            />
          </td>
        );
      }
      rowsArray.push(<tr>{row}</tr>);
    }
    return rowsArray;
  }

  render() {
    return (
      <div className="Calendar-main">
      <PopupboxContainer />
        <table className="Calendar-table">
          <thead>
            {this.tableHeaders()}
          </thead>
          <tbody>
            {this.tableRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Calendar;