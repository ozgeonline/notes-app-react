import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
// import {nanoid} from "nanoid"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore" //collection
import { notesCollection,db } from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([])
        //() => JSON.parse(localStorage.getItem("notes")) || []
        //setNotes,notların durumunu güncellemek için kullanılır.yeni bir not dizisini alır ve bunu localStorage'a kaydeder.
        // yerel depodan notları almak için kullanılır. Yerel depoda not yok ise, işlev boş bir dizi döndürür. Aksi takdirde, yerel depoda depolanan notları döndürür.

    const [currentNoteId, setCurrentNoteId] = React.useState("") //(notes[0] && notes[0].id) -- (notes[0]?.id) || ""
    // console.log(currentNoteId);
    const [tempNoteText, setTempNoteText] = React.useState("")

    const currentNote =  notes.find(note => note.id === currentNoteId) || notes[0]

    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    React.useEffect(()=>{
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
            // console.log("THINGS ARE CHANGING!")
        })
        return unsubscribe;

        // localStorage.setItem("notes", JSON.stringify(notes))
        //useEffect notlar dizisini yerel depolamaya kaydetmek için React Hooks u kullanıyor
        //? console.log(JSON.stringify(notes[0].body.split("\n")))
    },[]) // fonksiyonun bağlı olduğu değişken notes-dur
    
    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    React.useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    

        // const newNote = {
        //     id: nanoid(),
        //     body: "# Type your markdown note's title here"
        // }
        // setNotes(prevNotes => [newNote, ...prevNotes]) // yeni not, notlar dizesine eklenir
        // setCurrentNoteId(newNote.id) // yeni notun kimliği güncellenir.
    }
    
    async function updateNote(text) {

        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true })

       // Güncellenen dizi en üste geçer
        // setNotes(oldNotes => {
        //     const newArray = []
        //     for(let i = 0; i < oldNotes.length; i++) {
        //         const oldNote = oldNotes[i]
        //         if(oldNote.id === currentNoteId) {
        //             newArray.unshift({ ...oldNote, body: text })
        //         } else {
        //             newArray.push(oldNote)
        //         }
        //     }
        //     return newArray
        // })
        
        // id'ye göre sıralanır
        // setNotes(oldNotes => oldNotes.map(oldNote => {
        //*  return oldNote.id === currentNoteId ? { ...oldNote, body: text } : oldNote
    }
    
    // function deleteNote(event,noteId) {
    //     event.stopPropagation()
    //     setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    //     // console.log("deleted note", noteId)
    //     //belirtilen kimliğe sahip notu kaldırmak için notlar dizisini filtreler.
    //     //İşlev döndürürse true öğe yeni notlar dizisine dahil edilir.
    // }
    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }
    
    return (
        <main>
          { notes.length > 0 ?
              <Split 
                    sizes={[30, 70]} 
                    direction="horizontal" 
                    className="split"
              >
                <Sidebar
                    notes={sortedNotes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                <Editor 
                    tempNoteText={tempNoteText} 
                    setTempNoteText={setTempNoteText}
                />
                
              </Split>
              :
              <div className="no-notes">
                <h1>You have no notes</h1>
                <button className="first-note" onClick={createNewNote} > Create one now </button>
              </div>   
          }
        </main>
    )
}
