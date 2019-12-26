import React, { Component } from "react";
import logo from "./logo-white.png";
import "./App.css";
import { returnProfessionals, returnServices, returnClients } from "./mocks/apiMocks";
import { minutesToHours, dateNow } from "./mocks/functions";
import Calendar from "./components/calendar"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      professionals: [],
      services: [],
      clients: {},
      serviceMinTime: 30, //serviços de no mínimo 30 minutos.
      openHours: 24, // 24 horas de funcionamento.
      schedules: [{
        employeeName: null,
        startTime: null,
        duration: null,
        client: null,
        service: null,
        date: null,
      }],
      currentDate: new Date(),
    };
  }

  scheduleClick(props, selecteds, isRemove){
    const pastSchedules = this.state.schedules.slice();

    for (let i = 0; i < this.state.schedules.length; i++) {
      if (this.state.schedules[i].employeeName === selecteds[0].name && this.state.schedules[i].duration === selecteds[4] && this.state.schedules[i].client === selecteds[2].name && this.state.schedules[i].service === selecteds[1].name && this.state.schedules[i].startTime === selecteds[3] && this.state.schedules[i].date === props.cellDate && isRemove){
          pastSchedules.splice(i,1);
          this.setState({schedules: pastSchedules,});
          return
      }
    }
    if (isRemove){
      alert("Agendamento não encontrado")
      return
    }
    this.setState({
      schedules: pastSchedules.concat([{
        employeeName: selecteds[0].name,
        service: selecteds[1].name,
        client: selecteds[2].name,
        startTime: selecteds[3],
        duration: selecteds[4],
        date: props.cellDate,
      }]),
    });
  }

  updateState(){
    Promise.all([returnProfessionals(), returnServices(), returnClients()]).then(
      values => {
        this.setState({
          professionals: values[0],
          services: values[1],
          clients: values[2],
        });
      }
    )
  }

  changeDateClick(isNext){
    var date = this.state.currentDate;
    if(isNext){
      date.setDate(date.getDate() + 1);
    }
    else{
      date.setDate(date.getDate() - 1);
    }
    this.setState({ 
      currentDate: date,
    });
  }

  serviceMinTimeList(){
    var list = [];
    var maxServiceTime = 60;
    var minServiceTime = 5;
    var selected = false;
    for (let i=minServiceTime; i<=maxServiceTime; i=i+minServiceTime){
      if (this.state.serviceMinTime === i)
        selected = true;
      list.push(
          <option selected={selected} value={i} onClick={() => this.setState({serviceMinTime: i})}>
            {i}
          </option>
        );
      selected = false;
    }
    return <select>{list}</select>
  }

  render() {
    this.updateState();
    var date = dateNow(this.state.currentDate);
    return (
      <div className="App">
        <div className="App-header">
          <h1 className="App-title">Front-End Challenge</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <p className="App-intro">
          <button className="Arrow-button" onClick={() => this.changeDateClick(false)}>&#8249;</button>
          {date}
          <button className="Arrow-button" onClick={() => this.changeDateClick(true)}>&#8250;</button>
        </p>
        <p className="App-intro">
          Divisões de tempo (em minutos): {this.serviceMinTimeList()}
        </p>
        <Calendar 
          scheduleClick={(props, selecteds, isRemove) => this.scheduleClick(props, selecteds, isRemove)}
          professionals= {this.state.professionals}
          services = {this.state.services}
          clients = {this.state.clients}
          openHours = {this.state.openHours}
          serviceMinTime = {this.state.serviceMinTime}
          currentDate = {this.state.currentDate}
          schedules = {this.state.schedules}
          date = {date}
        />
      </div>
    );
  }
}



export default App;
