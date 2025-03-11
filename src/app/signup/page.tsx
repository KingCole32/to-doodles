"use client"

import { signup } from "@/actions/auth";
import Link from "next/link";
import { useState } from "react";

const Signup = () => {
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPass, setNewPass] = useState("")
  const [passCheck, setPassCheck] = useState("")
  
  const passHasLetter = newPass.match(/[a-zA-z]+/)
  const passHasNumber = newPass.match(/[\d]+/)
  const passHasSpecial = newPass.match(/[!#$%&)(@+><?_\-^|]+/)
  const passStrength = passHasLetter && passHasNumber && passHasSpecial ? 3
    : passHasLetter && passHasNumber ? 2
    : passHasLetter && passHasSpecial ? 2
    : passHasNumber && passHasSpecial ? 2
    : 1;
  const canSubmit = newName != "" && newEmail != "" && newPass != "" && passCheck != "" && passStrength > 1
  // of course we don't want these blank, but the form will handle them as a required fields
  const isPassMatchCheck = newPass == "" || passCheck == "" || newPass == passCheck

  return (
    <div className="h-full w-full flex align-center just-center">
      <form action={async () => signup(newName, newEmail, newPass)} className="border-rounded border-grey p-1">
        <h2 className="pb-1"><b>Signup</b></h2>
        <div className="flex just-between pb-1">
          <span className="pr-1">User Name: </span>
          <input maxLength={100} type="text" required placeholder="User Name" value={newName} onChange={(event) => setNewName(event.target.value)}/>
        </div>
        <div className="flex just-between pb-1">
          <span className="pr-1">Email: </span>
          <input maxLength={255} type="email" required placeholder="Email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)}/>
        </div>
        
        {/* pass requirement indicator/instructions */}
        <div className="flex col border-grey border-rounded p-05 mb-1">
          <div className="flex just-center">
            <span className="pr-05">Pass strength:</span>
            {passStrength > 3 ? <span className="text-green">strong</span>
              : passStrength == 2 ? <span className="text-yellow">ok</span>
              : <span className="text-yellow">poor</span>}
          </div>
          <div className="flex just-between">
            <span className={passHasLetter ? "text-green" : "text-grey"} style={{paddingRight: "2px"}}>1 Letter</span>
            <span className={passHasNumber ? "text-green" : "text-grey"} style={{paddingRight: "2px"}}>1 Number</span>
            <span className={passHasSpecial ? "text-green" : "text-grey"}>1 Special character</span>
          </div>
        </div>
        <div className="flex just-between pb-1">
          <span className="pr-1">Password: </span>
            {/* pattern="^((?=.*[A-Za-z])(?=.*?[\d])|(?=.*[A-Za-z])(?=.*[!#$%&)(@+><?_\-^|])|(?=.*?[\d])(?=.*[!#$%&)(@+><?_\-^|])).{8,}$" */}
          <input
            required
            pattern="^.{8,}$"
            title="Passwords must be 8 characters or more"
            type="password"
            value={newPass}
            onChange={(event) => setNewPass(event.target.value)}
          />
        </div>

        {!isPassMatchCheck &&
          <div className="text-red subtext" style={{textAlign: "end"}}>
            Passwords don't match
          </div>
        }
        <div className="flex just-between pb-1">
          <span className="pr-1">Retype password: </span>
          <input
            id="passCheck"
            name="passCheck"
            pattern="^.{9,}$"
            title="narf"
            required
            type="password"
            value={passCheck}
            onChange={(event) => setPassCheck(event.target.value)}
          />
        </div>
        <div className="flex just-center py-1">
          <button type="submit" disabled={!canSubmit}>Sign Up</button>
        </div>
        <div className="flex just-end subtext">
          <Link href="/login" className="hover-effect">Already signed up?</Link>
        </div>
      </form>
    </div>
  );
}

export default Signup
