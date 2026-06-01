function Idmodal({idModal,setIdModal,inputId,setInputId,setIdScore}){
    return(
        <div 
            className="overlay"
            onClick={()=>{
                setInputId('')
                setIdModal(false)
            }}
        >
            <div 
                className='idmodal-content'
                onClick={(e)=>{e.stopPropagation()}}    
            >
                <div className='input-wrapper'>
                    <input 
                    type="text"
                    placeholder='input score ID'
                    value={inputId}
                    onChange={(e)=>{
                        setInputId(e.target.value)
                    }}
                    />
                </div>
                
                <button
                    type='button'
                    className='idload-btn'
                    onClick={async()=>{
                        const id = inputId
                        // ここにfetct
                        try{
                        const res = await fetch('url',{
                            method: "GET",
                            headers:{
                            "Content-Type" : "application/json",
                            },
                        })
                        if(!res.ok){
                            throw new Error("サーバー側でエラーが発生しました")
                        }
                        const result = await res.json()
                        setIdScore(result.score)
                        setIdModal(false)
                        setInputId('')
                        setTimeout(()=>{
                            window.scrollTo({
                                top: window.innerHeight,
                                behavior: 'smooth'
                            })
                        } ,10)
                        }catch(error){
                            console.log(error)
                            alert("サーバーとの通信に失敗しました。")
                        }
                    }}
                >
                    {`${inputId}の譜面を入手します。`}
                </button>
            </div>
        </div>
    )
}
export default Idmodal