import React, { Component } from "react";
import { minutesToHours } from "../mocks/functions";

class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      selectedEmployee: props.cellEmployee,
      selectedServices: null,
      selectedClient: null,
      selectedStart:props.cellTime,
      selectedDuration:null,
    };
  }

  setAttributteToUpdate(parameter,value){
    if (parameter =="employee"){
      return (employee, services, client, start, duration) => this.setCurrentState(value, this.state.selectedServices, this.state.selectedClient, this.state.selectedStart, this.state.selectedDuration)
    }
    else if (parameter == "services"){
      return (employee, services, client, start, duration) => this.setCurrentState(this.state.selectedEmployee, value, this.state.selectedClient, this.state.selectedStart, this.state.selectedDuration)
    }
    else if (parameter == "client"){
      return (employee, services, client,start, duration) => this.setCurrentState(this.state.selectedEmployee, this.state.selectedServices, value, this.state.selectedStart, this.state.selectedDuration)
    }
    else if (parameter == "start"){
      return (employee, services, client,start, duration) => this.setCurrentState(this.state.selectedEmployee, this.state.selectedServices, this.state.selectedClient, value, this.state.selectedDuration)
    }
    else if (parameter == "duration"){
      return (employee, services, client,start, duration) => this.setCurrentState(this.state.selectedEmployee, this.state.selectedServices, this.state.selectedClient, this.state.selectedStart, value)
    }
  }
  setCurrentState(employee, services, client, start, duration){
    this.props.setParentState(employee, services, client, start, duration);
    this.setState({
      selectedEmployee: employee,
      selectedServices: services,
      selectedClient: client,
      selectedStart: start,
      selectedDuration: duration,
    });
  }

  returnDropDown(list, parameter){
    var tempList = [];
    var selected = false;
    for (let i=0; i<list.length; i++){
      if (parameter === "employee" && list[i].name === this.props.cellEmployee.name){
        selected = true;
      }
      if (parameter === "start" && list[i] === this.props.cellTime){
        selected = true;
      }
      if (parameter != "start" && parameter != "employee" && i==0){
        tempList.push(
          <option hidden disabled selected value> -- escolha uma opção -- </option>
        );
      }
      if (list[i].name != undefined){
        tempList.push(
          <option 
            selected={selected}
            value={list[i].name}
            onClick={this.setAttributteToUpdate(parameter,list[i])}>
              {list[i].name}
          </option>
        );
      }
      else{
          tempList.push(
          <option 
            selected={selected}
            value={list[i]}
            onClick={this.setAttributteToUpdate(parameter,list[i])}>
              {minutesToHours(list[i])}
          </option>
        );
      }
      selected = false;
    }
    return <select>{tempList}</select>;
  }

  availableServices(employee,servicesList){
    var services = [];
    for (let i=0; i<servicesList.length; i++){
      for (let k=0; k<servicesList[i].available_professionals.length; k++){
        if (servicesList[i].available_professionals[k].cpf === employee.document_number.toString()){
          services.push(servicesList[i]);
        }
      }
    }
    return services;
  }

  startTimeList(){
    var startList = []
    for (let i=0; i<this.props.openHours*(60/this.props.timeUnit); i++){
      startList.push(i*this.props.timeUnit);
    }
    return startList;
  }

  remainingTimeList(){
    var remainingList = []
    for (let i=1; i<=(this.props.openHours*(60/this.props.timeUnit) - this.state.selectedStart/this.props.timeUnit); i++){
      remainingList.push(i*this.props.timeUnit);
    }
    return remainingList;
  }

  syncParentState(){
    var state = this.props.getParentState();
    if (state[0] != this.state.selectedEmployee || state[3] != this.state.selectedStart){
      this.setState({
        selectedEmployee: state[0],
        selectedServices: state[1],
        selectedClient: state[2],
        selectedStart: state[3],
        selectedDuration: state[4],
      });
    }
  }

  render(){
    this.syncParentState();
    return (
      <div>
        <div>
          <h5>Funcionário: </h5>
          {this.returnDropDown(this.props.professionals,"employee")}
        </div>
        <div>
          <h5>Serviço: </h5>
          {this.returnDropDown(this.availableServices(this.state.selectedEmployee, this.props.services), "services")}
        </div>
        <div>
          <h5>Cliente: </h5>
          {this.returnDropDown(this.props.clients, "client")}
        </div>
        <div>
          <h5>Início: </h5>
          {this.returnDropDown(this.startTimeList(), "start")}
          <h5>Duração: </h5>
          {this.returnDropDown(this.remainingTimeList(), "duration")}
        </div>
      </div>
    );
  }
}

export default DropDown;