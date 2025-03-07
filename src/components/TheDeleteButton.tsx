"use client"

import { deleteDoodle } from "@/actions/doodles"
import TheBackButton from "@/components/TheBackButton"
import BaseIcon from "./base/BaseIcon"
import { deleteTag } from "@/actions/tags"
import { useState } from "react"

interface DeleteProps {
  target: "doodle" | "tag"
  targetId: number
}

enum targetEnum {
  doodle = "doodle",
  tag = "tag"
}

const TheDeleteButton: React.FC<DeleteProps> = ({target, targetId}) => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
    {target == targetEnum.doodle ?
        <button type="button" className="absolute-corner-r_outside border-round border-none hover-effect" onClick={() => setShowModal(true)}>
          <BaseIcon name="close" size="18"/>
        </button>
      :
      <button type="button" className="hover-effect" onClick={() => setShowModal(true)}>Delete</button>

    }

    {showModal &&
        <div className="modal">
          <div className="border-grey background-black border-rounded p-1 h-fit w-fit">
            <p className="text-white">Deletion is permanent and cannot be undone.</p>
            <p className="text-white pb-2">Continue anyway?</p>
            <div className="flex align-center just-between">
              {target == targetEnum.doodle ? 
                  <button type="button" onClick={async () => {deleteDoodle(targetId), setShowModal(false)}}>Delete</button>
                :
                  <button type="button" onClick={async () => {deleteTag(targetId), setShowModal(false)}}>Delete</button>
              }
              <TheBackButton>Cancel</TheBackButton>
            </div>
          </div>
        </div>
      }
    </>
  )
}
export default TheDeleteButton
