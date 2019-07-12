import React from 'react';

class Register extends React.Component {
	//setting up the states that change using event functions (onnamechange, onemailchange, on passwordchange)
	constructor(props) {
		super(props);
		this.state= {
			email: '',
			password: '',
			name: ''
		}
	}
	//defining the functions that change the state based on the input values of the components
	onNameChange =(event) => {
		this.setState({name: event.target.value})
	}
	//defining a function that changes the state bsed on the event.
	onEmailChange =(event) => {
		this.setState({email: event.target.value})
	}
	onPasswordChange =(event) => {
		this.setState({password: event.target.value})
	}
	
	onSubmitSignIn = () => {
		fetch('https://still-caverns-88623.herokuapp.com/register', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			// in order to send to the back end we can't just send a js object. therefore we use json stringify.
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password,
				name: this.state.name
			})
		})
		.then(response => response.json()) //will be used to give an error later
		//only if the user and passowrd match, then change the routechange.
		.then(user => {
			if (user.id) {
				this.props.loadUser(user); //updates the state from the app props.
				this.props.onRouteChange('home');
			}
		})
	}

	render() {
		return (
			<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center"> {/*setting the outer box*/}
				<main className="pa4 black-80">
				  <div className="measure">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">Register</legend>
				      <div className="mt3">
					    <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
					        <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
					        type="text" 
					        name="name"  
					        id="name"
					        onChange= {this.onNameChange}
				        />
				      </div>
				      <div className="mt3">
					        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
					        <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
					        type="email" 
					        name="email-address"  
					        id="email-address"
					        onChange= {this.onEmailChange}
				        />
				      </div>
				      <div className="mv3">
					        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
					        <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
					        type="password" 
					        name="password"  
					        id="password"
					        onChange= {this.onPasswordChange}
				        />
				      </div>
				    </fieldset>
				    <div className="">
				      <input 
				      onClick = {this.onSubmitSignIn} 
				      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
				      type="submit" 
				      value="Register"/>
				    </div>
				  </div>
				</main>
			</article>
		)
	}

}

export default Register;