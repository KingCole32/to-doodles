"use client"

import { createDoodle, updateDoodle } from "@/actions/doodles"
import { useState } from "react"
import BaseIcon from "./base/BaseIcon"
import { Doodle, DoodleTag } from "@/types/Doodle"
import TheTagSelect from "./TheTagSelect"

interface EditProps {
  currDoodle?: Doodle,
  tagData: Array<DoodleTag>
}

const TheEditDoodle: React.FC<EditProps> = ({currDoodle, tagData}) => {  
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState(currDoodle ? currDoodle.title : "")
  const [newBody, setNewBody] = useState(currDoodle ? currDoodle.body : "")
  const [newDeadline, setNewDeadline] = useState(currDoodle ? currDoodle.deadline : "")
  const [newTags, setNewTags] = useState<Array<DoodleTag>>([])



  const dateAsDate = new Date(newDeadline)
  const formatedDate = newDeadline
    ? `${dateAsDate.getFullYear()}-${(dateAsDate.getMonth()+1).toString().padStart(2,"0")}-${dateAsDate.getDate().toString().padStart(2,"0")}`
    : ""

  return (
    <>
      {currDoodle ?
          <button type="button" className="flex" style={{height: "19px"}} onClick={() => {setShowModal(true)}}>
            <span>Edit</span><BaseIcon name="edit" size="16"/>
          </button>
        :
          <button type="button" style={{height:"24px"}} onClick={() => {setShowModal(true)}}>
            <b>+Doodle</b>
          </button>
      }

      {showModal &&
        <div className="h-full w-full flex align-center just-center modal">
          <form className="border-rounded background-black border-grey p-1">
            <h2 className="pb-1 text-white"><b>{currDoodle ? "Edit doodle" : "Create a new doodle"}</b></h2>

            <div className="flex col just-between pb-1">
              <label htmlFor="title" className="text-white">Title: </label>
              <input id="title" name="title" type="text" maxLength={256} value={newTitle} onChange={(event) => setNewTitle(event.target.value)}/>
            </div>

            <div className="flex col just-between pb-1">
              <label htmlFor="body" className="text-white">Contents: </label>
              <textarea id="body" name="body" cols={40} rows={8} maxLength={5000} value={newBody} onChange={(event) => setNewBody(event.target.value)}/>
            </div>

            <div className="flex col just-between pb-1">
              <label htmlFor="deadline" className="text-white">Due: </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={formatedDate}
                onChange={(event) => setNewDeadline(event.target.value)}/>
            </div>

            <TheTagSelect tagData={tagData} currentValue={newTags} SetterCallback={setNewTags}/>
            
            <div className="flex just-between pt-2">
              {currDoodle ? 
                  <button
                    type="button"
                    onClick={async () => {
                      updateDoodle(
                        currDoodle.id,
                        newTitle,
                        newBody,
                        newDeadline,
                        newTags.flatMap(tag => tag.id).toString()),
                      setShowModal(false)
                    }}
                  >Update</button>
                :
                  <button
                    type="button"
                    disabled={newTitle == "" || newBody == "" || newDeadline == ""}
                    onClick={async () => {
                      createDoodle(
                        newTitle,
                        newBody,
                        newDeadline,
                        newTags.flatMap(tag => tag.id).toString()),
                      setShowModal(false)}}
                  >Create</button>
              }
              <button type="button" onClick={() => {setShowModal(false)}}>Cancel</button>
            </div>
          </form>
        </div>
      }
    </>
  )
}

export default TheEditDoodle