import { Song } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";


const useOnPlay = (songs : Song[]) =>{
    const player = usePlayer();
    const AuthModal = useAuthModal();
    const { user} = useUser();

    const onPlay =(id: string) =>{
        if(!user){
            return AuthModal.onOpen();
        }

        player.setId(id)
        player.setIds(songs.map((song) => song.id))

    }

    return onPlay;

}

export default useOnPlay    ;