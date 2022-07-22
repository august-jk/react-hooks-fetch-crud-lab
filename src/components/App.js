import React, { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([])
  useEffect(() => {
    fetch('http://localhost:4000/questions')
    .then(r => r.json())
    .then(setQuestions)
    
  },[])
  function handleNewQuestions(formData) {
    const answers = [formData.answer1, formData.answer2, formData.answer3, formData.answer4]
    fetch("http://localhost:4000/questions", {
      method : "POST",
      headers : {
         "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        "id" : parseInt(questions.length + 1),
        "prompt" : formData.prompt,
        "answers" : answers, 
        "correctIndex" : parseInt(formData.correctIndex)
      })
    })
    const updatedQuestions = [...questions, formData]
    setQuestions(updatedQuestions)
  }
  function handleDelete(id) {
    function handleDeleteItem(item){
      const updatedQuestions = questions.filter(item => item.id !== id)
      setQuestions(updatedQuestions)
    }
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE'
    })
    .then(handleDeleteItem)
  }
  function updateCorrectAnswer( index, id ) {
    function handleUpdate() {
      const updatedQuestions = questions.map(question => {
        if(question.id !== id){
          return question
        } else{ return question = {
          correctIndex: parseInt(index)
        }}
      })
      setQuestions(updatedQuestions)
    }
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'PATCH',
      Headers: 
        { "Content-Type": "application/json" },
      Body:
        { "correctIndex": parseInt(index) }
    })
    .then(r => r.json())
    .then(handleUpdate)
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? <QuestionForm onCreateNewQuestions={handleNewQuestions}/> : 
      <QuestionList questions={questions} onDelete={handleDelete} onUpdateCorrectAnswer={updateCorrectAnswer}/>}
    </main>
  );
}

export default App;
