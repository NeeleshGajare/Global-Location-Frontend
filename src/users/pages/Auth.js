import React, { useContext, useState } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/Hooks/form-hook';
import { AuthContext } from '../../shared/context/Auth-Context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
// import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import './Auth.css';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/Util/validators';
import { useHttpClient } from '../../shared/Hooks/http-hooks';


const Auth = props => {
    const auth = useContext(AuthContext)
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isVaild: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    // value: null,
                    value: '',
                    isVaild: false
                }
            },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    }

    const submitHandler = async event => {
        event.preventDefault();
        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/api/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.userID, responseData.token);
            } catch (err) { }
        } else {
            try {
                // const formData = new FormData();
                // formData.append('name', formState.inputs.name.value);
                // formData.append('email', formState.inputs.email.value);
                // formData.append('password', formState.inputs.password.value);
                // formData.append('image', formState.inputs.image.value)
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/api/users/signup',
                    'POST',
                    // formData
                    JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                        image: formState.inputs.image.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.userID, responseData.token);
            } catch (err) { }
        }
    };
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={submitHandler}>
                    {!isLoginMode && <Input
                        element="input"
                        id="name"
                        type='text'
                        label="Your Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter your Name."
                        onInput={inputHandler}
                    />}
                    {!isLoginMode &&
                        // <ImageUpload
                        //     center
                        //     id="image"
                        //     onInput={inputHandler}
                        //     errorText="Please provide an Image"
                        // />
                        <Input
                        element="textarea"
                        id="image"
                        type='text'
                        label="Photo Image Link"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please provide link of an Image."
                        onInput={inputHandler}
                    />
                    }
                    <Input
                        element="input"
                        id="email"
                        type='email'
                        label="E-mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address."
                        onInput={inputHandler}
                    />
                    <Input
                        element="input"
                        id="password"
                        type='password'
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password, at least 6 characters."
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
                </form>
                <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
            </Card>
        </React.Fragment>
    );
}

export default Auth;