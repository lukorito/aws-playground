import React, { Component } from "react";
import { withAuthenticator } from "aws-amplify-react";
import { API, graphqlOperation } from "aws-amplify";
import { createNote, deleteNote, updateNote } from "./graphql/mutations";
import { listNotes } from "./graphql/queries";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: "",
			notes: [],
			note: "",
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleNoteUpdating = this.handleNoteUpdating.bind(this);
	}

	async componentDidMount() {
		const results = await API.graphql(graphqlOperation(listNotes));
		this.setState({
			notes: [...results.data.listNotes.items],
		});
	}

	handleChange(event) {
		this.setState({
			note: event.target.value,
		});
	}

	async handleSubmit(e) {
		const { notes, note, id } = this.state;
		e.preventDefault();
		if(id){
			const input = {  note, id}
			const results = await API.graphql(graphqlOperation(updateNote, { input }))
			const updatedNote = results.data.updateNote;
			const index = notes.findIndex((note) => note.id === id)
			const updatedArray = [...notes.slice(0, index), updatedNote, ...notes.slice(index + 1)]
			this.setState({
				note: "",
				id: "",
				notes: updatedArray
			})
		} else {
			const input = { note };
			const results = await API.graphql(graphqlOperation(createNote, { input }));
			const newNote = results.data.createNote;
			this.setState({
				notes: [newNote, ...this.state.notes],
				note: "",
			});
		}
	}

	async handleDelete(id) {
		const { notes } = this.state;
		const input = { id };
		await API.graphql(graphqlOperation(deleteNote, { input }));
		this.setState({
			notes: notes.filter(note => note.id !== id),
		});
	}
	
	async handleNoteUpdating ({ note, id }) {
		this.setState({
			note,
			id
		})
	}
	
	render() {
		const { notes, note, id } = this.state;
		return (
			<div className="flex flex-column items-center justify-center pa3 bg-washed-red">
				<h1 className="code f2-1"> Amplify Notetaker</h1>
				<form onSubmit={this.handleSubmit} className="mb3">
					<input type="text" className="pa2 f4" placeholder="Write your note" onChange={this.handleChange} value={note} />
					<button className="pa2 f4">{id ? "Update Note": "Add Note"}</button>
				</form>
				<div>
					{notes.map(item => (
						<div key={item.id} className="flex items-center">
							<li className="list pa1 f3" onClick={() => this.handleNoteUpdating(item)}>
								{item.note}
							</li>
							<button className="bg-transparent bn f4" onClick={() => this.handleDelete(item.id)}>
								<span>&times;</span>
							</button>
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default withAuthenticator(App, true);
