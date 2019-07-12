import React, { Component} from 'react';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Particles from 'react-particles-js';
import './App.css';


//"https://samples.clarifai.com/metro-north.jpg"
//Clarifai.FACE_DETECT_MODEL 


//setting up the particlesOption for the dynamic background. the higher the numbers, the higher the animation effects.
const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

//by seperating the intialstate, you make sure that the state refreshes everytime someone logs in.
const initialState = {
    input: '',
    imageUrl: '',
    box: {}, //this box will contain the values we receive. i.e. the coordinates of where the face is.
    route: 'signin', //we want the route to start from the signin page.
    isSignedIn: false,
    user: { //user profile below as state:(when you register, you update them)
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
}

//Setting up the state. By using an alternative class syntax, you can leave out the constructor and initialize the state as class field declaration. 
class App extends Component {
  constructor() {
    super();
    this.state= initialState;
  }
  // creating a function that updates the state. the variabls are from the register app.post function on the server(backend)
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  } 



  //this function receives the inputs from clarifai, and returns the coordinates of the face location to 4 different variables.
  calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box; //receives the raw data from the API
      const image = document.getElementById('inputimage'); //speaking to the input image through DOM manipulation on FaceRecognition.js
      const width = Number(image.width); //receiving the width of the image inserted.
      const height = Number(image.height); //receiving the height from the image inserted.
      return {
        leftCol: clarifaiFace.left_col * width, //the precentage * width gives you the exact locatio of where the left column starts.
        topRow: clarifaiFace.top_row * height, //same principle as leftCol, however, with height.
        rightCol: width - (clarifaiFace.right_col * width), //as the coordiants start from left to right, you have to takeaway the whole width from this to get the positiioning of the right column.
        bottomRow: height - (clarifaiFace.bottom_row * height) // same principle as rightCol, but with height.
      }
  }
  //a function that grabs the box object (coordinates), then sets the state to the data it receives.
  // this function will later on receive calculateFaceLocation as it's 'box' input.
  displayFaceBox = (box) => { 
    // console.log(box); //this doesn't need to be here, however it is useful to know the coordinates of the box.
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value}); //changing the 'input' state to the value that has been entered into the input form on 'ImageLinkForm.js'
  } /*this happens onChange of the input. therefore, instantaneously. */


  onButtonSubmit = () => {
    //moving the API key to the backend.
    this.setState({imageUrl : this.state.input}); //passing the value of state.input to .state.imageUrl
      fetch('https://still-caverns-88623.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        // in order to send to the back end we can't just send a js object. therefore we use json stringify.
        body: JSON.stringify({
          input: this.state.input //passes id as it is the if parameter for the put image server function.
         })
      }) //to update the entries:
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://still-caverns-88623.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            // in order to send to the back end we can't just send a js object. therefore we use json stringify.
            body: JSON.stringify({
              id: this.state.user.id //passes id as it is the if parameter for the put image server function.
             })
          }) //to update the entries:
            .then(response => response.json())
            .then(count => { //using object.assign below to only update that aspect of the state
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log); //error handling
        }
        this.displayFaceBox(this.calculateFaceLocation(response)) //This receives the imageURL as a response, then the outer function provides the box parameters, to which displayFaceBox sets the state. 
      }) 
      .catch(err => console.log(err));
        // there was an error  
  }
  //setting up a function that changes the route state by having a dynamic 'route' parameter. this will be passed in the Signin.js and Navigation.js for an onClick event listener.
  onRouteChange =(route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  //render is the act of outputting on to the screen.
  render() {
    const {isSignedIn, imageUrl, route, box } = this.state;
    return (
    <div className="App">
      <Particles className="particles"
      params={particlesOptions}
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange = {this.onRouteChange}/>
      {route === 'home'  /*using a ternary operator: if the state.route is at signin, then provide the signin page, if not, display the main page with it's components*/
        ? <div> 
            <Logo /> 
            <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
            <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit={this.onButtonSubmit}/> {/*passing through the functions as props to the receiving components in order to define the output.*/}
            <FaceRecognition box={box} imageUrl ={imageUrl}/> {/*pass through the ImageUrl as a prop to FaceRecognition.js. Adn then, the ImageUrl becomes the state.*/}
          </div> /*the reason for this div is due to JSX elements needing to be wrapped in an enclosing tag.*/
        : (
          route === 'signin'
          ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />   /*passing the function as a prop to Signin.js*/
          : <Register loadUser= {this.loadUser} onRouteChange= {this.onRouteChange}/>
          ) 
      }
    </div>
    );
  }
}

export default App;
