import Link from "next/link";
import { redirect } from "next/navigation";
import { login } from "@/actions/auth";

const Login = () => {
  async function doLogin(formData: FormData) {
    "use server"
    
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const res = await login(email, password)

    if (res.id != undefined) redirect('/')
    else console.error("login error")
  }

  return (
    <div className="h-full w-full flex align-center just-center">
      <form action={doLogin} className="border-rounded border-grey p-1">
        <h2 className="pb-1"><b>Login</b></h2>
        <div className="flex just-between pb-1">
          <label htmlFor="email" className="pr-1">Email: </label>
          <input
            id="email"
            name="email"
            type="email"
            required 
            pattern="^(?:.+\.[a-zA-Z]{2,})$"
            title="An email must contain a '.com' or '.co.jp', etc."
            placeholder="Email"
          />
        </div>
        <div className="flex just-between pb-1">
          <label htmlFor="password" className="pr-1">Password: </label>
          <input id="password" name="password" type="password" required/>
        </div>
        <div className="flex just-center pb-1">
          <button type="submit">Login</button>
        </div>
        <div className="flex just-end subtext">
          <Link href="/signup" className="hover-effect">Not signed up yet?</Link>
        </div>
      </form>
    </div>
  );
}

export default Login
