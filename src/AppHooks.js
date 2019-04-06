import React, { useEffect, useState } from "react";
import { withAuthenticator } from "aws-amplify-react";
import { API, graphqlOperation } from "aws-amplify";
import { createNote, deleteNote, updateNote } from "./graphql/mutations";
import { listNotes } from "./graphql/queries";

const App =() => {
	const [ id, setId] = useState("");
	const [notes, setNotes ] = useState([])
	const [ note, setNote ] = useState("")

	const handleFetch = async () => {
		const results = await API.graphql(graphqlOperation(listNotes));
		setNotes(results.data.listNotes.items)
	}

	useEffect(() => {
		handleFetch()
	}, [])

	const handleChange = (event) => {
		setNote(event.target.value)
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if(id){
			const input = {  note, id}
			const results = await API.graphql(graphqlOperation(updateNote, { input }))
			const updatedNote = results.data.updateNote;
			const index = notes.findIndex((note) => note.id === id)
			const updatedArray = [...notes.slice(0, index), updatedNote, ...notes.slice(index + 1)]
			setId("")
			setNote("")
			setNotes(updatedArray)
		} else {
			const input = { note };
			const results = await API.graphql(graphqlOperation(createNote, { input }));
			const newNote = results.data.createNote;
			const newNotes = [newNote, ...notes]
			setNotes(newNotes)
			setNote("")
		}
	}

	const handleDelete = async (id) => {
		const input = { id };
		await API.graphql(graphqlOperation(deleteNote, { input }));
		const newNotes = notes.filter(note => note.id !== id)
		setNotes(newNotes)
	}
	
	const handleNoteUpdating  = async ({ note, id }) => {
		setNote(note)
		setId(id)
	}
	return (
		<div className="flex flex-column items-center justify-center pa3 bg-washed-red">
			<h1 className="code f2-1"> Amplify Notetaker</h1>
			<form onSubmit={handleSubmit} className="mb3">
				<input type="text" className="pa2 f4" placeholder="Write your note" onChange={handleChange} value={note} />
				<button className="pa2 f4">{id ? "Update Note": "Add Note"}</button>
			</form>
			<div>
				{notes.map(item => (
					<div key={item.id} className="flex items-center">
						<li className="list pa1 f3" onClick={() => handleNoteUpdating(item)}>
							{item.note}
						</li>
						<button className="bg-transparent bn f4" onClick={() => handleDelete(item.id)}>
							<span>&times;</span>
						</button>
					</div>
				))}
			</div>
		</div>
	);
}


export default withAuthenticator(App, true);
