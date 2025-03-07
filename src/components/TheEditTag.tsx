"use client"

import { ChangeEvent, useState } from "react"
import BaseIcon from "./base/BaseIcon"
import { DoodleTag } from "@/types/Doodle"
import { createTag, updateTag } from "@/actions/tags"
import TheDeleteButton from "./TheDeleteButton"

interface EditButtonProps {
  tagData: Array<DoodleTag>
}

const TheEditTag: React.FC<EditButtonProps> = ({tagData}) => {
  const [showModal, setShowModal] = useState(false);
  const [currTag, setCurrTag] = useState<DoodleTag | null>(null)
  const [newTagName, setNewTagName] = useState<string>("")

  const setTagFromEvent = (event: ChangeEvent<HTMLSelectElement>) => {
    const targetId = event.target.value
    if (targetId == "-1") {
      setCurrTag(null)
      return
    }

    console.warn("targetId: ", targetId)
    const targetTag = tagData.filter(tag => tag.id == parseInt(targetId))[0]
    if (targetTag) {
      setCurrTag(targetTag)
      setNewTagName(targetTag.tag_name)
    } else console.error("Could not find target tag ID in list of tags")
  }

  return (
    <>
      <button type="button" style={{height:"24px"}} className="flex align-center" onClick={() => {setShowModal(true), setCurrTag(null)}}>
        <b>Tag</b>
        <BaseIcon name="edit" size="16"/>
      </button>

      {showModal && 
        <div className="modal">
          <div className="flex col border-grey border-rounded background-black p-1 absolute-container">
            <div className="flex align-center just-center border-underline pb-05 mb-1">
              <span>Select an option:</span>
              <select name="page" id="page" className="mx-05" onChange={setTagFromEvent}>
                <option value={-1}> Create new tag </option>
                {tagData.map((tag) => 
                  <option value={tag.id} key={`tagOption${tag.id}`}> {tag.tag_name} </option>
                )}
              </select>
            </div>
            {/* create tag or edit current tag */}
                <div className="flex col">
                  <div className="flex">
                    <span className="pr-05" style={{textWrap: "nowrap"}}>{currTag ? "Edit tag:" : "New tag:"}</span>
                    <input
                      type="text"
                      className="mb-1 w-full"
                      maxLength={256}
                      value={newTagName}
                      onChange={(event) => setNewTagName(event.target.value)}
                    ></input>
                  </div>
                  <div className="flex just-between">
                    {currTag ? 
                        <button
                          type="button"
                          className="w-fit"
                          disabled={newTagName == ""}
                          onClick={async () => updateTag(currTag.id, newTagName)}
                        >Update</button>
                      :
                        <button
                          type="button"
                          className="w-fit"
                          disabled={newTagName == ""}
                          onClick={async () => createTag(newTagName)}
                        >Create</button>
                    }
                    {currTag && 
                      <TheDeleteButton target="tag" targetId={currTag.id}/>
                    }
                    <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </div>
          </div>
        </div>
      }
    </>
  )
}

export default TheEditTag