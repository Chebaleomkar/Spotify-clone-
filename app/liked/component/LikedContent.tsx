"use client"

import LikeButton from "@/components/LikeButton"
import MediaItem from "@/components/MediaItem"
import useOnPlay from "@/hooks/useOnPLay"
import { useUser } from "@/hooks/useUser"
import { Song } from "@/types"

import {regSw , subscribe  } from '../../../helper'
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface LikedContentProps {
    songs : Song[]
}

const LikedContent:React.FC<LikedContentProps> = ({songs}) => {

    const onPlay = useOnPlay(songs);

    const router = useRouter();
    const {isLoading , user} = useUser();

    useEffect(()=>{
        if(!isLoading && !user){
            router.replace('/');
        }

    },[isLoading , user , router ])

    if(songs.length === 0){
        return(
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400 ">
                NO Liked Songs
            </div>
        )
    }

    async function registerAndSubscribe() {
        try {
            const serviceWorkerReg = await regSw();
            await subscribe(serviceWorkerReg);
        } catch (error) {
            console.log(error);
        }
    }
  
    

  return (
    <div className="flex flex-col gap-y-2 w-full p-6 ">
          <span onClick={registerAndSubscribe} className="text-white cursor-pointer">Register and Subscribe</span>
        {
            songs.map((song)=>(
                <div key={song.id} className="flex items-center gap-x-4 w-full " >
                    <div className="flex-1">
                        <MediaItem 
                         onClick={(id: string)=>onPlay(id)}
                         data={song}
                        />      
                    </div>
                    <LikeButton songId={song.id} />
                </div>
            ))
        }
    </div>
  )
}

export default LikedContent