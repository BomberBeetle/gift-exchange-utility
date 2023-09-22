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
		p_data[e.target.name] = e.target.value; //le prototype poisoning moment
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
						<Form.Control name="country" value={p_data.country} type="text"></Form.Control>
						<Form.Label >State</Form.Label>
						<Form.Control name="state" value={p_data.state} type="text"></Form.Control>
						<Form.Label>Shipping Address</Form.Label>
						<Form.Control name="address" value={p_data.address} type="text"></Form.Control>
						<Form.Label>Zip Code</Form.Label>
						<Form.Control name="zip" value={p_data.zip} type="text"></Form.Control>
						<Form.Label>Can <b>ship</b> internationally</Form.Label>
						<Form.Check name="ships_international" value={p_data.ships_international} type="checkbox"></Form.Check>
						<Form.Label>Can <b>receive</b> internationally</Form.Label>
						<Form.Check name="receives_international" value={p_data.receives_international} type="checkbox"></Form.Check>
						<Form.Label>Notes</Form.Label>
						<Form.Control name="notes" type="text" value={p_data.notes}></Form.Control>
						<Butt variant="danger" onClick={kys}>Remove</Butt>
	  			</Accordion.Body>
		</Accordion.Item>
	)
}
class App extends React.Component{

	

	exchange_people = [
		{
			name: "Dave"
		},
		{
			name: "John"
		},
		{
			name: "Rose"
		},
		{
			name: "Jade"
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
			newState.people.push({name: "Name"});
			this.setState(newState);
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
	  	</Col>
	</Row>
    </Container>

  );
}
}

export default App;
