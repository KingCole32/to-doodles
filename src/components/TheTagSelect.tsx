"use client"

import { DoodleTag } from "@/types/Doodle"
import { Dispatch, SetStateAction, useState } from "react"
import BaseIcon from "./base/BaseIcon"

interface SelectProps {
  tagData: Array<DoodleTag>,
  currentValue: Array<DoodleTag>,
  SetterCallback: Dispatch<SetStateAction<DoodleTag[]>>
}

const TheTagSelect: React.FC<SelectProps> = ({tagData, currentValue, SetterCallback}) => {  
  const [showDropown, setShowDropdown] = useState(false)

  const maxDropDownLength = tagData.length > 10 ? 10 : tagData.length

  const addToTags = (tagToAdd: DoodleTag) => {
    const existingIndex = currentValue.findIndex(tag =>  tag.id == tagToAdd.id)
    if (existingIndex > -1) currentValue.splice(existingIndex, 1)
    else SetterCallback(currentValue.concat(tagToAdd))
  }

  const isTagAdded = (tagToCheck: DoodleTag): boolean => {
    return !!currentValue.find(tag =>  tag.id == tagToCheck.id)
  }

  return (
    <>
      <label htmlFor="tags" className="mr-05 text-white">Tags: </label>
      <div className="mr-05 absolute-container">
        <select name="fakeTags" id="fakeTags" multiple size={1} style={{height: "24px", width:"100px"}} onClick={() => setShowDropdown(true)}>
          <option value={0}>{ currentValue[0] ? currentValue[0].tag_name : "" }</option>
        </select>

        {showDropown && 
          <div className="flex col w-full absolute-corner-l_inside">
            <select name="tags" id="tags" multiple size={maxDropDownLength}>
              { tagData.map((tag) =>
                <option
                  value={tag.id}
                  key={`tag${tag.id}`}
                  className={
                    `px-05 
                    ${isTagAdded(tag) ? "background-white text-black" : ""}`
                  }
                  onClick={() => addToTags(tag)}>
                  {tag.tag_name} 
                </option>
              )}
            </select>
            <button
              type="button"
              className="flex just-center w-full background-grey text-black border-none hover-effect"
              onClick={() => setShowDropdown(false)}
            >
              <BaseIcon name="down" size="16"/>
            </button>
          </div>
        }
      </div>
    </>
  )
}

export default TheTagSelect