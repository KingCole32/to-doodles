"use client"

import { DoodleTag } from "@/types/Doodle";
import BaseIcon from "./base/BaseIcon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TheTagSelect from "./TheTagSelect";

interface SearchProps {
  tagData: Array<DoodleTag>
}

const TheSearch: React.FC<SearchProps> = ({tagData}) => {  
  const router = useRouter()

  const [newOffset, setNewOffset] = useState("10")
  const [newStatus, setNewStatus] = useState("-1")
  const [newTags, setNewTags] = useState<Array<DoodleTag>>([])

  const doSearch = () => {
    let newParamsUrl = `/?page=1&offset=${newOffset}&status=${newStatus}`
    if (newTags.length > 0) newParamsUrl += `&tags=${newTags.flatMap(tag => tag.id).toString()}`

    router.push(newParamsUrl)
  }

  return (
    <div>
      <div className="flex">
        <label htmlFor="status" className="mr-05">Current Status:</label>
        <select name="status" id="status" className="mr-05" onChange={(event) => setNewStatus(event.target.value)}>
          <option value={-1}> All </option>
          <option value={0}> Incomplete </option>
          <option value={1}> Complete </option>
        </select>

        {/* potentially hidden multi-select tag field */}
        { tagData.length > 0 &&
          <TheTagSelect tagData={tagData} currentValue={newTags} SetterCallback={setNewTags}/>
        }

        <label htmlFor="offset" className="mr-05">Results Per Page:</label>
        <select name="offset" id="offset" className="mr-05" onChange={(event) => setNewOffset(event.target.value)}>
          <option value={10}> 10 </option>
          <option value={20}> 20 </option>
          <option value={50}> 50 </option>
          <option value={100}> 100 </option>
          <option value={200}> 200 </option>
          <option value={500}> 500 </option>
          <option value={-1}> All </option>
        </select>
        
        <button type="button" onClick={() => doSearch()}><BaseIcon name="search" size="20"/></button>
      </div>
    </div>
  )
}

export default TheSearch