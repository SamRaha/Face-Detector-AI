import React from 'react';
// import './Signin.css'

//the below sign in form was copied and pasted from the tachyons website. http://tachyons.io/components/forms/sign-in/index.html
class Signin extends React.Component {
	//in order to get the input values for email and password, we create an event listener function. This sets the state for singinemail.
	//a child can have it's own state
	constructor(props) {
		super(props);
		this.state= {
			signInEmail: '',
			signInPassword: ''
		}
	}
	//defining a function that changes the state bsed on the event (onchange event of email and password)
	onEmailChange =(event) => {
		this.setState({signInEmail: event.target.value})
	}
	onPasswordChange =(event) => {
		this.setState({signInPassword: event.target.value})
	}
	//fetch by default does a get request so in the second param you need to define what you need the function to do.
	//a function that captures the state and sets it to the variables set up in the database through a POST method.
	onSubmitSignIn = () => {
		fetch('https://still-caverns-88623.herokuapp.com/signin', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			// in order to send to the back end we can't just send a js object. therefore we use json stringify.
			body: JSON.stringify({
				email: this.state.signInEmail, //email is the variable in the database on singin.
				password: this.state.signInPassword
			})
		}) // the below function shows the response of 'error logging in'
	    .then(response => response.json()) //will be used to give an error later
	    //the below function takes you to the home page if the sing in is succesful through grabbing the users.id is correct.
	    .then(user => {
	        if(user.id){
	          this.props.loadUser(user);
	          this.props.onRouteChange('home');
	        }
	     })
	}

	render() {
	const { onRouteChange } = this.props;
	return (
		<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center"> {/*setting the outer box*/}
			<main className="pa4 black-80">
			  <div className="measure">
			    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
			      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
			      <div className="mt3">
			        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
			        <input 
				        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        type="email" 
				        name="email-address"  
				        id="email-address"
				        onChange = {this.onEmailChange} //added events to the inputs
			        />
			      </div>
			      <div className="mv3">
			        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
			        <input 
				        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        type="password" 
				        name="password" 
				        id="password"
				        onChange = {this.onPasswordChange} //added events to the inputs
				    />
			      </div>
			    </fieldset>
			    <div className="">
			      <input 
			      onClick = {this.onSubmitSignIn} 
			      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
			      type="submit" 
			      value="Sign in"/>
			    </div>
			    <div className="lh-copy mt3">
			      <p onClick = {() => onRouteChange('register')} href="#0" className="f6 link dim black db pointer">Register</p>
			    </div>
			  </div>
			</main>
		</article>
		);
	}
}

export default Signin;