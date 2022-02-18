import React, { useContext } from 'react';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/Util/validators';
import './PlaceForm.css';
import { useForm } from '../../shared/Hooks/form-hook';
import { useHttpClient } from '../../shared/Hooks/http-hooks';
import { AuthContext } from '../../shared/context/Auth-Context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHistory } from 'react-router';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const NewPlace = () => {
    const auth = useContext(AuthContext);
    const history = useHistory()
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            },
            image: {
                // value: null,
                value: '',
                isValid: false
            }
        },
        false
    );

    const placeSubmitHandler = async event => {
        event.preventDefault();
        try {
            // const formData = new FormData();
            // formData.append('title', formState.inputs.title.value);
            // formData.append('description', formState.inputs.description.value);
            // formData.append('address', formState.inputs.address.value);
            // formData.append('image', formState.inputs.image.value);
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + '/api/places',
                'POST',
                // formData,
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    address: formState.inputs.address.value,
                    image: formState.inputs.image.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            history.push('/');
        } catch (err) { }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />
                <Input
                    id="address"
                    element="input"
                    type="text"
                    label="Address"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address"
                    onInput={inputHandler}
                />
                {/* <ImageUpload
                    id="image"
                    onInput={inputHandler}
                    errorText="Please provide an Image"
                /> */}
                <Input
                    element="textarea"
                    id="image"
                    type='text'
                    label="Photo Image Link"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please provide link of an Image."
                    onInput={inputHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
            </form>
        </React.Fragment>
    );
}

export default NewPlace;