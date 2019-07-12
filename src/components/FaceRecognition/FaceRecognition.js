import React from 'react';
import './FaceRecognition.css'


const FaceRecognition = ({imageUrl, box}) => {
	return (
		<div className ='center ma'> 
			<div className='absolute mt2'>
				<img id='inputimage' alt='' src={imageUrl} width='500px' height='auto'/> {/*defining the output of imgUrl (link on input) to come out as an image type on render.*/}
				<div className='bounding-box' style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol  }}></div> {/*box.topRow is a prop from app.js, it's the state 'box'.*/}
			</div> {/*the div above speaks to the box state i.e. box.topRow, and adds the style. This style was imitated from the Clarifai website.*/}
		</div> 
	)
}

export default FaceRecognition;