import React, { useContext } from 'react';
import './PlaceItem.css';
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { useState } from 'react';
import { AuthContext } from '../../shared/context/Auth-Context';
import { useHttpClient } from '../../shared/Hooks/http-hooks';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const PlaceItem = props => {
    const auth = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);

    const openDeleteConfirmation = () => setShowDeleteConfirm(true);
    const closeDeleteConfirmation = () => setShowDeleteConfirm(false);

    const onDeleteHandler = async () => {
        closeDeleteConfirmation();
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/api/places/${props.id}`,
                'DELETE',
                null,
                { Authorization: 'Bearer ' + auth.token }
            );
            props.onDelete(props.id);
        } catch (err) { }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {<Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16} />
                </div>
            </Modal>}
            {<Modal
                show={showDeleteConfirm}
                onCancel={closeDeleteConfirmation}
                header={"Are you sure?"}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={closeDeleteConfirmation}>CANCEL</Button>
                        <Button danger onClick={onDeleteHandler}>DELETE</Button>
                    </React.Fragment>
                }
            >
                <p className="message-text">
                    Do you want to proceed and delete this place? Please note that it can't be undone thereafter.
                </p>
            </Modal>}
            <li key={props.id} className="place-item">
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="place-item__image">
                        <img src={props.image} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
                        {auth.userId === props.creatorId && <Button danger onClick={openDeleteConfirmation}>DELETE</Button>}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
}

export default PlaceItem;