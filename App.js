import React, {Component} from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';
import SignIn from './components/SignInForm/SignIn';
import Register from './components/Register/Register';

//particles.js
// const clarify = require('clarify); - alternate way of importing

const app = new Clarifai.App(
  {
  apiKey: 'eb4ea41b6c4f426c8e533d42ce6a40be'
 }
 );
 

const particlesOptions = {
  particles: {
    number:{
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component{
  constructor (){
    super()
    this.state= {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false

    }
  }

  calculateFaceLocation = (data)=> {
    const clarifaiFace= data.response.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
  }
    
  displayFaceBox = (box) => {
      //console.log(box);
      this.setState({box: box})
    }
    
  onInputChange = (event)=> {
    this.setState({input: event.target.value})
    //console.log(event.target.value);
  }
  
  onButtonSubmit = ()=> {
    //console.log("click");
    this.setState({imageURL: this.state.input});

    app.models
    .predict(Clarifai.FACE_DETECT_MODEL,
     this.state.value).then(response=> (this.displayFaceBox(this.calculateFaceLocation(response)))
     .catch(err=> console.log(err))
     );
  }

  onRouteChange =(route)=> {
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});

  }

  render(){
  return (
    <div className= "App">
      <Particles className= 'particles' params={particlesOptions}/>
      <Navigation isSignedIn= {this.state.isSignedIn} onRouteChange= {this.onRouteChange}/>
      { this.state.route === 'home'
      ? <div>
      <Logo/>
      <Rank/>
      <ImageLinkForm onInputChange= {this.onInputChange}
      onButtonSubmit= {this.onButtonSubmit}/>
      <FaceRecognition box= {this.state.box} imageURL= {this.state.imageURL}/>
      </div>
      : (
        this.state.route === 'signin'
      ? <SignIn onRouteChange= {this.onRouteChange}/>
      : <Register onRouteChange= {this.onRouteChange}/>
      )
    }
    </div>
    );
  }
}

/*clarifai.com/api*/
export default App;
