import { logout } from "@/actions/auth";
import BaseIcon from "./base/BaseIcon";

const TheLogoutButton = () => { 
  return (
    <form action={logout}>
      <button type="submit" className="border-round border-none p-icon hover-effect">
        <BaseIcon name="logout" size="20"/>
      </button>
    </form>
  )
}

export default TheLogoutButton