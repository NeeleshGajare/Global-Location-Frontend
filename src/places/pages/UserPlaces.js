import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/Hooks/http-hooks";
import PlaceList from "../components/PlaceList";

const UserPlaces = props => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState();

    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/api/places/user/${userId}`
                );
                setLoadedPlaces(responseData.Places);
            } catch (err) { }
        };
        fetchPlaces();
    }, [sendRequest, userId])

    const placeDeletedHandler = (deletedPlace) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlace));
    }
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
        </React.Fragment>
    );
}

export default UserPlaces;