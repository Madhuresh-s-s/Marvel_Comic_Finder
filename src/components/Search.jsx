import { useState } from "react"
import md5 from "md5"
import Characters from "./Characters"
import  Comics  from "./Comics"
import "../style/Search.scss"

export function Search() {

    const[characterName, setcharacterName] = useState("")
    const[characterData, setcharacterData] = useState(null)
    const[comicData, setcomicData] = useState(null)

    const privateKey = import.meta.env.VITE_PRIVATE_KEY
    const publicKey = import.meta.env.VITE_PUBLIC_KEY 

    function handlesubmit(e){
        e.preventDefault()
        getCharacterData()
    }

    function getCharacterData(){
        setcharacterData(null)
        setcomicData(null)

        const timeStamp = new Date().getTime();
        const hash = gethash(timeStamp)

        const URL = `https://gateway.marvel.com:443/v1/public/characters?apikey=${publicKey}&hash=${hash}&ts=${timeStamp}&nameStartsWith=${characterName}&limit=100`
        fetch(URL).then(response => response.json()).then((result) => {
            setcharacterData(result.data)
            console.log(result)
        }).catch((error)=>{
            console.log("There is an error : ", error)
        })
    }

    function gethash(timestamp){
        return md5(timestamp + privateKey + publicKey)
    }

    function handlechange(e){
        setcharacterName(e.target.value)
    }

    function handlereset(){
        setcharacterData(null)
        setcomicData(null)
        setcharacterName("")

    }

    function getcomicData(characterId){
        window.scrollTo({top : 0, left : 0})

        const timestamp = new Date().getTime()
        const hash = gethash(timestamp)

        const URL = `https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?apikey=${publicKey}&hash=${hash}&ts=${timestamp}`

        fetch(URL).then(results => results.json()).then((results) =>{
            setcomicData(results.data)
            console.log(results.data)
        }).catch((error)=>{
            console.log("Error while fetching data", data)
        })

    }

    return(
        <>
        <form className="search" onSubmit={handlesubmit}>

            <input type="text" placeholder="Enter Your Character" onChange={handlechange}/>
            <div className="buttons">
                
                <button type="submit">Get Char DatagetCharacterData</button>
                <button type="reset" className="reset" onClick={handlereset}>reset</button>
            </div>
        </form>

        {!comicData && characterData && characterData.results[0] && (
            <Characters data={characterData.results} onClick={getcomicData} />
        )}

        {comicData && comicData.results[0] && (
            <Comics data = {comicData.results}/>
        )}

        </>
    )
}