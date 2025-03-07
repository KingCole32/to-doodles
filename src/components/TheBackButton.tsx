"use client"

import { useRouter } from "next/navigation";

interface BackButtonProps {
  children: React.ReactNode;
}

const TheBackButton: React.FC<BackButtonProps> = ({children}) => {
  const router = useRouter()

  return (
    <button type="button" onClick={router.back}>{children}</button>
  )
}

export default TheBackButton