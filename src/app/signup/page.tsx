import { signup } from "@/actions/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const Signup = () => {
  async function doSignup(formData: FormData) {
    "use server"
    // should match the password restrictions and works in checker, but not in field...
    {/* pattern={"(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]{8,}|(?=.*?.*[!@#$%^&*()_+={}\[\]|\\:;\"'<>,.?\/`~-])(?=.*?[a-zA-Z])[a-zA-Z!@#$%^&*()_+={}\[\]|\\:;\"'<>,.?\/`~-]{8,}|(?=.*?.*[!@#$%^&*()_+={}\[\]|\\:;\"'<>,.?\/`~-])(?=.*?[\d])[\d!@#$%^&*()_+={}\[\]|\\:;\"'<>,.?\/`~-]{8,}"} */} 

    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")
    if (!(name && email && password)) throw new Error("Missing required input for signup")
    const res = await signup(name as string, email as string, password as string);

    if (res) redirect('/')
    else console.error("error")
  }

  return (
    <div className="h-full w-full flex align-center just-center">
      <form action={doSignup} className="border-rounded border-grey p-1">
        <h2 className="pb-1"><b>Signup</b></h2>
        <div className="flex just-between pb-1">
          <label htmlFor="name" className="pr-1">User Name: </label>
          <input id="name" name="name" maxLength={100} type="text" required placeholder="User Name" />
        </div>
        <div className="flex just-between pb-1">
          <label htmlFor="email" className="pr-1">Email: </label>
          <input id="email" name="email" maxLength={255} type="email" required placeholder="Email" />
        </div>
        <div className="flex just-between pb-1">
          <label htmlFor="password" className="pr-1">Password: </label>
          <input
            id="password"
            name="password"
            pattern="^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]{8,}|(?=.*?.*[!@#$%^&*()_+={}\[\]|\\:;<>,.?\/`~-])(?=.*?[a-zA-Z])[a-zA-Z!@#$%^&*()_+={}\[\]|\\:;<>,.?\/`~-]{8,}|(?=.*?.*[!@#$%^&*()_+={}\[\]|\\:;<>,.?\/`~-])(?=.*?[\d])[\d!@#$%^&*()_+={}\[\]|\\:;<>,.?\/`~-]{8,}$"
            required
            type="password"/>
        </div>
        <div className="flex just-between pb-1">
          <label htmlFor="passwordCheck" className="pr-1">Retype Password: </label>
          <input id="passwordCheck" name="passwordCheck" required type="password" />
        </div>
        <div className="flex just-center py-1">
          <button type="submit">Sign Up</button>
        </div>
        <div className="flex just-end subtext">
          <Link href="/login" className="hover-effect">Already signed up?</Link>
        </div>
      </form>
    </div>
  );
}

export default Signup
