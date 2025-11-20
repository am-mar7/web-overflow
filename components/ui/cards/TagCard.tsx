import ROUTES from '@/constants/routes'
import Link from 'next/link'
import React from 'react'
type props = {
    id: string,
    name : string,
    questions? : number,
}

export default function TagCard({id , name , questions} : props) {
  return (
    <div>
        <Link href={ROUTES.TAG(id)} className="flex-between small-regular">
            <p className="bg-light900_dark400 text-light-500 px-3 py-1 space-x-2  rounded-lg">
                <i>ICON</i>
                <i>{name}</i>
            </p>
            <p>{questions}</p>
        </Link>
    </div>
  )
}
