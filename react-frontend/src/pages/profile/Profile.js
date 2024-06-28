import { useEffect, useState } from "react";
import { cookie_token } from "../login/auth";
import './profile.css';
import axios from "axios";
import config from "../../config";

function Profile() {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contact, setContact] = useState('');
    const [organisation, setOrganisation] = useState('');
    const [edit, setEdit] = useState(false);
    const [saved, setSaved] = useState(false);
    const [message, setMessage] = useState('');

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${config.API_URL}:${config.API_PORT}/profile/${cookie_token()}`);
            const profileData = res.data[0];
            setEmail(profileData.EMAIL || '');
            setUserName(profileData.USER_NAME || '');
            setFirstName(profileData.FIRST_NAME || '');
            setLastName(profileData.LAST_NAME || '');
            setContact(profileData.CONTACT || '');
            setOrganisation(profileData.ORGANIZATION || '');
            console.log(profileData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    function toggleEdit() {
        setEdit(true);
        setSaved(false);
    }

    function handleFirstName(event) {
        setFirstName(event.target.value);
    }

    function handleLastName(event) {
        setLastName(event.target.value);
    }

    function handleContact(event) {
        setContact(event.target.value);
    }

    async function handleSave(event) {
        event.preventDefault();
        const id = cookie_token();
        try {
            const res = await axios.post(`${config.API_URL}:${config.API_PORT}/profile/update`, { id, firstName, lastName, contact });
            if (res.data.message === 'Successful') {
                console.log('Successfully Updated');
                setSaved(true);
                setMessage('Successfully Updated');
                setEdit(false);
                await fetchProfile();
            }
        } catch (err) {
            console.log(err);
            setMessage('Error');
            setSaved(false);
        }
    }


    return (
        <>
            <h2>User Profile</h2>
            <div className="profile-form">
                <label htmlFor="username">User Name</label>
                <input type="text" value={userName} disabled />
                <label htmlFor="firstName">First Name</label>
                <input type="text" value={firstName} onChange={handleFirstName} disabled={!edit} />
                <label htmlFor="lastName">Last Name</label>
                <input type="text" value={lastName} onChange={handleLastName} disabled={!edit} />
                <label htmlFor="email">Email</label>
                <input type="text" value={email} disabled />
                <label htmlFor="contact">Contact</label>
                <input type="text" value={contact} onChange={handleContact} disabled={!edit} />
                <label htmlFor="organisation">Organisation</label>
                <input type="text" value={organisation} disabled />
                {!edit ? (
                    <button onClick={toggleEdit}>Edit</button>
                ) : (
                    <div>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => {
                            setEdit(false);
                            fetchProfile();
                        }}>Back</button>
                    </div>
                )}
                {saved && <p>{message}</p>}
            </div>
        </>
    );
}

export default Profile;
