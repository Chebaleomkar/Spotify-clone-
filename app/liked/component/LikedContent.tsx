"use client"

import LikeButton from "@/components/LikeButton"
import MediaItem from "@/components/MediaItem"
import useOnPlay from "@/hooks/useOnPLay"
import { useUser } from "@/hooks/useUser"
import { Song } from "@/types"

import {regSw , subscribe  } from '../../../helper'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface LikedContentProps {
    songs : Song[]
}

const LikedContent:React.FC<LikedContentProps> = ({songs}) => {
    const [isSubscribed, setIsSubscribed] = useState(false); 
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
          {/* <span onClick={registerAndSubscribe} className="text-white cursor-pointer">Register and Subscribe</span> */}

          <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          onChange={(e) => {
            if (e.target.checked) {
              registerAndSubscribe();
            }
          }}
        />
        <div
          className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ${
            isSubscribed ? "peer-checked" : ""
          }`}
        ></div>
        <span className="text-white m-3">Notification</span>
        </label>

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