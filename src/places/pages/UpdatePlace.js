import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/Util/validators";
import './PlaceForm.css';
import { useForm } from "../../shared/Hooks/form-hook";
import { useHttpClient } from '../../shared/Hooks/http-hooks';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/Auth-Context";

const UpdatePLace = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();
    const placeId = useParams().placeId;
    const auth = useContext(AuthContext);
    const history = useHistory();

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        false
    );

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/places/${placeId}`);
                setLoadedPlace(responseData.place);
                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true
                        }
                    },
                    true
                );
            } catch (err) { }
        };
        fetchPlace();
    }, [sendRequest, placeId, setFormData]);

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        )
    };

    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find the place!</h2>
                </Card>
            </div>
        )
    };

    const submitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/api/places/${placeId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            history.push('/' + auth.userId + '/places');
        } catch (err) { }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && <form className="place-form" onSubmit={submitHandler}>
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label='Title'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title"
                    onInput={inputHandler}
                    value={loadedPlace.title}
                    valid={true}
                />
                <Input
                    id="description"
                    element="textarea"
                    label='Description'
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (min 5 characters)."
                    onInput={inputHandler}
                    value={loadedPlace.description}
                    valid={true}
                />
                <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
            </form>}
        </React.Fragment>
    );
}

export default UpdatePLace;