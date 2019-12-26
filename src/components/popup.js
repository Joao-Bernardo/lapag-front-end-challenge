import React, { Component } from "react";
import "react-popupbox/dist/react-popupbox.css";
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import DropDown from "./dropdown";
import { minutesToHours } from "../mocks/functions";
import "./popup.css";

class PopUpButton extends Component {
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

  setDropDownState(employee, services, client, start, duration){
    this.setState({
      selectedEmployee: employee,
      selectedServices: services,
      selectedClient: client,
      selectedStart: start,
      selectedDuration: duration,
    });
  }

  getDropDownState(){
    var state = [];
    state.push(this.state.selectedEmployee);
    state.push(this.state.selectedServices);
    state.push(this.state.selectedClient);
    state.push(this.state.selectedStart);
    state.push(this.state.selectedDuration);
    return state;
  }

  updatePopupBox(props,text) {
    if (this.getDropDownState()[1] == null || this.getDropDownState()[2] == null || this.getDropDownState()[4] == null){
      alert("Preencha todos os campos")
      this.openPopupbox(this.updatePopupBox, this.props, text)
      return
    }
    if (text === 'Remover'){
      props.scheduleClick(props, this.getDropDownState(),true);
      PopupboxManager.close();
    }
    else{
      props.scheduleClick(props, this.getDropDownState(),false);
    }
    const content = (
      <div>
        <span>Agendamento realizado!</span>
        <div>
          <button onClick={PopupboxManager.close}>Fechar</button>
        </div>
      </div>
    )

    PopupboxManager.update({
      content,
      config: {
        titleBar: {
          text: 'Sucesso!'
        }
      }
    })
  }

  openPopupbox(updatePopupBox,props,text) {
    this.setDropDownState(props.cellEmployee, null, null, props.cellTime, null);
    const content = (
      <div>
        <DropDown 
          cellEmployee= {props.cellEmployee}
          cellTime={props.cellTime}
          professionals={props.professionals}
          services={props.services}
          clients={props.clients}
          openHours = {this.props.openHours}
          timeUnit = {this.props.timeUnit}
          setParentState= {(employee, services, client, start, duration) => this.setDropDownState(employee, services, client, start, duration)}
          getParentState= {() => this.getDropDownState()}
        />
        <button className="Popup-button" onClick={() => this.updatePopupBox(props,text)}>Ok</button>
      </div>
    )

    PopupboxManager.open({
      content,
      config: {
        titleBar: {
          enable: true,
          text: text
        },
        fadeIn: true,
        fadeInSpeed: 500
      }
    })
  }

  openInformationBox(updatePopupBox,props) {
    var schedulesList = [];
    for (let i = 0; i < props.schedules.length; i++) {
      if (props.schedules[i].employeeName === props.cellEmployee.name && (props.schedules[i].startTime + props.schedules[i].duration) > props.cellTime && props.schedules[i].startTime <= props.cellTime && props.schedules[i].date === props.cellDate){
          schedulesList.push(
              <div>
                <p>Funcionário: {props.schedules[i].employeeName}</p>
                <p>Serviço: {props.schedules[i].service}</p>
                <p>Cliente: {props.schedules[i].client}</p>
                <p>Horário: {minutesToHours(props.schedules[i].startTime)} - {minutesToHours(props.schedules[i].startTime + props.schedules[i].duration)}</p>
              </div>
          );
      }
    }

    const content = (
      <div>
        <div>{schedulesList}</div>
        <button className="Popup-button" onClick={PopupboxManager.close}>Fechar</button>
        <button className="Popup-button" onClick={() => this.openPopupbox(this.updatePopupBox,this.props,'Remover')}>Remover</button>
      </div>
    )

    PopupboxManager.open({
      content,
      config: {
        titleBar: {
          enable: true,
          text: 'Info'
        },
        fadeIn: true,
        fadeInSpeed: 500
      }
    })
  }

  isCellScheduled(props){
    for (let i = 0; i < props.schedules.length; i++) {
      if (props.schedules[i].employeeName === props.cellEmployee.name && (props.schedules[i].startTime + props.schedules[i].duration) > props.cellTime && props.schedules[i].startTime <= props.cellTime && props.schedules[i].date === props.cellDate){
          return true;
        }
    }
    return false;
  }

  renderScheduledButton(){
    return (
      <div>
        <button className="Calendar-button-scheduled" onClick={() => this.openInformationBox(this.updatePopupBox,this.props)}>
        </button>
      </div>
    );
  }

  renderButton(){
    return (
      <div>
        <button className="Calendar-button" onClick={() => this.openPopupbox(this.updatePopupBox,this.props,'Definir Agendamento')}>
        </button>
      </div>
    );
  }

  render() {
    if (this.isCellScheduled(this.props)){
      return this.renderScheduledButton();
    }
    else{
      return this.renderButton();
    }
  }
}

export default PopUpButton;