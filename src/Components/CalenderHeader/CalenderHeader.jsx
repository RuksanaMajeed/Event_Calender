import React from 'react'

export const CalenderHeader = ({onNext,onBack,dateDisplay}) => {
    return (
        <div id="header">
               
                <div id="prevButton">
                    <button onClick={onBack} ><font size="500px" color="white"><b>&lt;</b></font></button>
                </div>
                    <div id="monthDisplay">{dateDisplay}</div>
                <div id="nextButton">
                    <button onClick={onNext} ><font color="white"><b>&gt;</b></font></button>
                </div>
            </div>

    )
}
