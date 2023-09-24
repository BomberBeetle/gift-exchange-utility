import logo from './logo.svg';
import './App.css';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Accordion from 'react-bootstrap/Accordion'
import AccordionContext from 'react-bootstrap/AccordionContext'
import Form from 'react-bootstrap/Form'
import Butt from 'react-bootstrap/Button'

import { useContext, useState} from 'react';

import React from 'react';

import {RiAddFill} from 'react-icons/ri'
import { Button } from 'bootstrap';

function ExchangePersonEntry({ children, eventKey, callback, p_index, p_data, personValueChanged, removePerson}){

	function changeValue(e){
		p_data[e.target.name] = e.target.value;
		console.log(p_data[e.target.name]); //le prototype poisoning moment
		personValueChanged(p_index, p_data);
	}

	function changeCheck(e){
		p_data[e.target.name] = e.target.checked;
		console.log(p_data[e.target.name]); //le prototype poisoning moment
		personValueChanged(p_index, p_data);
	}

	function kys(){
		removePerson(p_index);
	}

	const { activeEventKey } = useContext(AccordionContext);

	const isCurrentEventKey = activeEventKey === eventKey;

	return (
		<Accordion.Item eventKey={eventKey}>
			<Accordion.Header>{isCurrentEventKey?(<Form.Control onChange={(e) => changeValue(e)} name="name" type="text" value={p_data.name} onClick={(e)=>{e.stopPropagation();return false;}}></Form.Control>):p_data.name}</Accordion.Header>
	  			<Accordion.Body>
						<Form.Label>Country</Form.Label>
						<Form.Control onChange={(e) => changeValue(e)} name="country" value={p_data.country} type="text"></Form.Control>
						<Form.Label >State</Form.Label>
						<Form.Control onChange={(e) => changeValue(e)} name="state" value={p_data.state} type="text"></Form.Control>
						<Form.Label>Shipping Address</Form.Label>
						<Form.Control onChange={(e) => changeValue(e)} name="address" value={p_data.address} type="text"></Form.Control>
						<Form.Label>Zip Code</Form.Label>
						<Form.Control onChange={(e) => changeValue(e)} name="zip" value={p_data.zip} type="text"></Form.Control>
						<Form.Label>Can <b>ship</b> internationally</Form.Label>
						<Form.Check onChange={(e) => changeCheck(e)} name="ships_international" checked={p_data.ships_international} type="checkbox"></Form.Check>
						<Form.Label>Can <b>receive</b> internationally</Form.Label>
						<Form.Check onChange={(e) => changeCheck(e)} name="receives_international" checked={p_data.receives_international} type="checkbox"></Form.Check>
						<Form.Label>Notes</Form.Label>
						<Form.Control onChange={(e) => changeValue(e)} name="notes" type="text" value={p_data.notes}></Form.Control>
						<Butt variant="danger" onClick={kys}>Remove</Butt>
	  			</Accordion.Body>
		</Accordion.Item>
	)
}
class App extends React.Component{

	exchange_people = [
		{
			name: "Dave", country: "", state: "", address:"", zip:"", ships_international: true, receives_international: true, notes: ""
		},
		{
			name: "John", country: "", state: "", address:"", zip:"", ships_international: true, receives_international: true, notes: ""
		},
		{
			name: "Rose", country: "", state: "", address:"", zip:"", ships_international: true, receives_international: true, notes: ""
		},
		{
			name: "Jade", country: "", state: "", address:"", zip:"", ships_international: true, receives_international: true, notes: ""
		}
	]

	constructor(props) {
		super(props);
		this.state = {people: this.exchange_people};  
	}

	render(){
		
		const cardChanged = (index, data) => {
			const newState = this.state;
			newState.people[index] = data;
			this.setState(newState);
		}

		const cardRemove = (index) => {
			const newState = this.state;
			newState.people.splice(index, 1);
			this.setState(newState);
		}

		const addPerson = () => {
			const newState = this.state;
			newState.people.push({name: "Name", country: "", state: "", address:"", zip:"", ships_international: true, receives_international: true, notes: ""});
			this.setState(newState);
		}

		const generatePairings = () => {
		
			let people = this.state.people;
	
			const pairings = []
		
			const givers_international = people.filter((p) => p.ships_international).sort((a,b) => 0.5 - Math.random());
			const givers_national = people.filter((p) => !p.ships_international).sort((a,b) => 0.5 - Math.random());
			const receivers_national = people.filter((p) => !p.receives_international).sort((a,b) => 0.5 - Math.random());
			const receivers_international = people.filter((p) => p.receives_international).sort((a,b) => 0.5 - Math.random());
			
			
			//Priorities list:
			//1. People who cannot receive internationally with people who cannot send internationally of the same country (only pairing possible)
			//2. People who cannot send internationally with people of the same country who can send internationally.
			//3. People who can send internationally with international receivers.
		
		
			//Clause 1
			for(let i = givers_national.length - 1; i >= 0; i--){
		
				receivers_national.reduce((sel, val, index, array) =>{
					if(sel === undefined){
						if(givers_national[i].country === val.country && givers_national[i] !== val){
							sel = val;
							console.log(receivers_national[index].name);
							pairings.push({sender: givers_national[i], sel});
							array.splice(index, 1);
							givers_national.splice(i, 1);
							
							
						}
					}
		
					return sel;
				}, undefined);
		
			}
		
			//Clause 2
			for(let i = givers_national.length - 1; i >= 0; i--){
		
				receivers_international.reduce((sel, val, index, array) =>{
					if(sel === undefined){
						if(givers_national[i].country === val.country && givers_national[i] !== val){
							sel = val;
							console.log(receivers_international[index].name);
							pairings.push({sender: givers_national[i], sel});
							array.splice(index, 1);
							givers_national.splice(i, 1);
							
							
						}
					}
		
					return sel;
				}, undefined);
		
			}
		
			//Clause 3
			for(let i = givers_international.length - 1; i >= 0; i--){
		
				receivers_international.reduce((sel, val, index, array) =>{
					if(sel === undefined){
						if(givers_international[i].country === val.country && givers_international[i] !== val){
							sel = val;
							console.log(receivers_international[index].name);
							pairings.push({sender: givers_international[i], sel});
							array.splice(index, 1);
							givers_international.splice(i, 1);
							
							
						}
					}
		
					return sel;
				}, undefined);
		
			}
		
			console.log(pairings);
		}

  	return (

	

    <Container>
	<Row>
		<Col>
			<Accordion defaultActiveKey="0">
				{
				this.state.people.map((person ,i) => {return(
					<ExchangePersonEntry eventKey={i} p_index={i} p_data={person} personValueChanged={cardChanged} removePerson={cardRemove}></ExchangePersonEntry>
				)})
				}
	  		</Accordion>
			<Butt onClick={addPerson}><RiAddFill></RiAddFill>Add Person</Butt>

			<Butt variant='success' onClick={generatePairings}>Generate Pairings</Butt>
	  	</Col>
	</Row>
    </Container>
	

  );
}
}

export default App;
