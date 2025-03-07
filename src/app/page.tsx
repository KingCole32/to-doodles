"use server"

import Link from "next/link";
import TheLogoutButton from "../components/TheLogoutButton";
import BaseDoodle from "@/components/base/BaseDoodle";
import TheSearch from "@/components/TheSearch";
import { getDoodles, getTotalNumDoodles } from "@/actions/doodles";
import { getCurrentUser } from "@/actions/auth";
import { cookies } from "next/headers";
import { StoreEnum } from "@/types/Store";
import { redirect } from "next/navigation";
import { getTags } from "@/actions/tags";
import TheEditTag from "@/components/TheEditTag";
import TheEditDoodle from "@/components/TheEditDoodle";


const Home = async ({searchParams}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {
  // filter params
  const filterParams = await searchParams
  // mind the possibility of empty params of a fresh load from login with default values for filter params
  const currPage = filterParams["page"] ? filterParams["page"] as string : "1"
  const offset = filterParams["offset"] ? filterParams["offset"] as string : "10"
  const status = filterParams["status"] ? filterParams["status"] as string : "-1"
  const tags = filterParams["tags"] as string

  // data
  const currDoodles = await getDoodles(currPage, offset, status, tags)
  const doodleCount = await getTotalNumDoodles(status, tags)
  const currTags = await getTags()

  const cookieStore = await cookies()
  const user: DoodleUser | undefined = await getCurrentUser()
  const storeFilter = cookieStore.get(StoreEnum.refreshUrl)?.value
  const currFilter = storeFilter ? storeFilter : "/?page=1";

  // pagination
  const createPaginationLink = (index: number): string => {
    let nextUrl
    if (currFilter == "/") nextUrl = `/?page=${index+1}`
    else nextUrl = currFilter.replace(/page=[\d]*[*]?/, `page=${index+1}`)
    return nextUrl
  }
  const numOfPages = Math.ceil(doodleCount/parseInt(offset))
  // if the number of total pages is below an arbitrary limit, make a page button array for the user (less ugly)
  const paginationArray = numOfPages <= 5 ? Array.from({length: numOfPages}).map((value,index) => createPaginationLink(index)) : []
  // otherwise, use an input field during the render to enable easier traversal of pages

  const goToPage = async (formData: FormData) => {
    "use server"

    const pageUrl = formData.get("page")?.toString()
    if (pageUrl) redirect(pageUrl)
    else console.error("Pagination missing URL data, unable to forward")
  }

  return (
    <div className="flex col h-full w-full">
      {/* header */}
      <div className="flex just-between p-1">
        <div className="flex">
          <TheSearch tagData={currTags}/>
          <div className="pl-1">
            <TheEditDoodle tagData={currTags}/>
          </div>
          <div className="pl-1">
            <TheEditTag tagData={currTags}/>
          </div>
        </div>
        <TheLogoutButton/>
      </div>

      {/* user info display */}
      {user?.userName && <b className="flex align-center just-center w-full pb-1">Hello, { user.userName }! Let's Doodle!</b>}
      
      {/* doodle display */}
      <div className="flex col h-full w-full p-1 scrollable">
        {currDoodles.map((currDoodle) => { return (
          <div className="pb-1" key={`doodle${currDoodle.id}`} >
            <BaseDoodle doodleData={currDoodle} tagData={currTags}></BaseDoodle>
          </div>
        )})}
      </div>

      {/* pagination */}
      {offset != "-1" && numOfPages > 1 && <div className="flex align-center just-center py-05" key="pagination_container">
        {paginationArray.length > 0 ?
          // page buttons
          paginationArray.map((value, index) => 
            <Link href={value}><button className="border-none border-round p-numeral mr-1">{index+1}</button></Link>
          )
          :
          // page dropdown
          <form action={goToPage}>
            <span>Page </span>
            <select name="page" id="page" className="mr-05">
              {Array.from({length: numOfPages}).map((value, index) => <option value={createPaginationLink(index)} key={`option${index}`}> {index} </option>)}
            </select>
            <button type="submit">Go!</button>
          </form>
        }
      </div>}
    </div>
  );
}

export default Home
