// 表示用
function Column({column}){ 
    return (
        <>
            <div className="column">
                <div className="effect-area">
                    {
                    column.hammer_on && column.pull_off
                        ? "error"
                        : column.hammer_on
                        ? "h"
                        : column.pull_off
                            ? "p"
                            : ""
                    }
                </div> {/*ハンマリングとかプルオフ用*/}
                <div className="lines">
                    {column.fret.map((fret,index)=>{
                        return <div className="string" key={index}>
                            <p >{column.bar ? "" : fret===-1 ? "x" : fret}</p>
                        </div>
                    })}
                    {column.bar && <div className="bar">{/*小節線用*/}</div>}
                </div>
            </div>
        </>
    )
}

export default Column