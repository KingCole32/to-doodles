import { CSSProperties } from "react";
import { Doodle, DoodleTag, statusEnum } from "@/types/Doodle";
import BaseIcon from "./BaseIcon";
import Link from "next/link";
import { changeDoodleStatus } from "@/actions/doodles";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { StoreEnum } from "@/types/Store";
import TheEditDoodle from "../TheEditDoodle";
import TheDeleteButton from "../TheDeleteButton";

interface DoodleProps {
  // all data for a single doodle
  doodleData: Doodle;
  tagData: Array<DoodleTag>
}

const BaseDoodle: React.FC<DoodleProps> = async ({doodleData, tagData}) => {
  // figure out status styling based on current date and doodle status
  const currDate = new Date()
  const deadlineDate = new Date(doodleData.deadline)
  const updatedDate = new Date(doodleData.updated)
  const currAndDeadlineDiff = deadlineDate.valueOf() - currDate.valueOf()

  const isDanger = doodleData.status == statusEnum.incomplete && currAndDeadlineDiff <= 86400000
  const isOver = doodleData.status == statusEnum.incomplete && currAndDeadlineDiff <= 0
  const isComplete = doodleData.status == statusEnum.complete
  const statusStyle: CSSProperties = {
    backgroundColor: (isOver ? "red" : isDanger ? "#ffff4d" : isComplete ? "#66b366" : "inherit"),
    color: (isOver ? "black" : isDanger ? "black" : isComplete ? "white" : "inherit")
  }

  const currTagsIdArray: Array<number> = doodleData.tags
    ? doodleData.tags.split(",").map(Number)
    : []
  const currTags = tagData.filter(tag => currTagsIdArray.includes(tag.id))

  const doStatusChange = async () => {
    "use server"

    const newStatus = isComplete ? 0 : 1
    const res = await changeDoodleStatus(doodleData.id, newStatus)
    if (res) {
      const cookieStore = await cookies()
      const refreshUrl = cookieStore.get(StoreEnum.refreshUrl)?.value
      redirect(refreshUrl ? refreshUrl : "/")
    }
  }

  return (
    <div className="border-rounded border-grey"  style={statusStyle}>
      <div className="flex align-center just-between border-top-rounded absolute-container p-1">
        {/* <Link scroll={false} href={`/delete/doodle/${doodleData.id}`} className="absolute-corner-r_outside border-round border-none hover-effect">
          <button type="button" className=" border-round border-none hover-effect">
            <BaseIcon name="close" size="18"/>
          </button>
        </Link> */}
        <TheDeleteButton target="doodle" targetId={doodleData.id}/>

        <h2><b>{ doodleData.title }</b></h2>
        <div style={{fontWeight: isOver ? "bold" : "normal"}}>
          { isComplete && <b>Completed: {doodleData.completed ? new Date(doodleData.completed).toLocaleDateString("ja") : ""}</b>}
          { !isComplete && <><span>Due: </span><span>{ deadlineDate.toLocaleDateString("ja") }</span></>}
        </div>
      </div>

      <div className="flex col background-white h-fit w-full text-black p-1">
        <b className="pb-1"> Status: {isComplete ? "Complete!" : isOver ? "Late!" : isDanger ? "Due soon!" : "Pending"} </b>
        <p className="pb-1"> {doodleData.body} </p>
        {doodleData.tags && 
          <div className="flex border-grey border-rounded mb-1">
            {currTags.map(tag =>
              <div className="background-grey border-rounded text-white w-fit" style={{padding: "2px", margin: "5px"}}>{tag.tag_name}</div>
            )}
          </div>
        }

        <div className="flex align-center just-end">
          <div className="pr-1">
            <TheEditDoodle currDoodle={doodleData} tagData={tagData}/>
          </div>
          <form action={doStatusChange}>
            <button type="submit">Change to {isComplete ? "incomplete" : "complete"}</button>
          </form>
        </div>
      </div>

      <div className="flex just-end border-bot-rounded px-1 py-05 subtext">
        Updated: {updatedDate.toLocaleDateString("ja")}
      </div>
    </div>
  )
}

export default BaseDoodle;