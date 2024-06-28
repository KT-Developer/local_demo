import { useEffect, useState } from "react";
import { cookie_token } from "../login/auth";
import './ChangePass.css';
import axios from "axios";
import { Done, Close } from "@material-ui/icons";
import config from "../../config";

function ChangePass() {
    const [userName, setUserName] = useState('');
    const [currPass, setCurrPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [icon, setIcon] = useState(false);
    const [tick, setTick] = useState(false);
    const [message, setMessage] = useState('');
    const [saved, setSaved] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [checkCurrPass, setCheckCurrPass] = useState('');
    const [same, setSame] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${config.API_URL}:${config.API_PORT}/password/${cookie_token()}`);
            const profileData = res.data[0];
            setUserName(profileData.USER_NAME);
            // setCheckCurrPass(profileData.PASSWORD);
            // setCurrPass(profileData.PASSWORD);
            console.log(profileData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);


    function handleNewPass(event) {
        setNewPass(event.target.value);
    }

    function handleConfirmPass(event) {
        setConfirmPass(event.target.value);
    }

    function handleChange(event) {
        setCurrPass(event.target.value);
        // setIcon(true);
        // if (currPass === checkCurrPass) {
        //     setTick(true);
        // }
        // else {
        //     setSaved(false);
        //     setTick(false);
        // }
    }


    async function handleSubmit(event) {
        event.preventDefault();
        // setSaved(true);
        if (newPass !== confirmPass) {
            setMessage("confirmPass don't match newPass");
        }
        else {
            const id = cookie_token();
            try {
                const res = await axios.post(`${config.API_URL}:${config.API_PORT}/password/update`, { id, currPass, newPass });
                if (res.data.message === 'Successful') {
                    console.log('Successfully Updated');
                    setMessage('Successfully Updated');

                }
                else if (res.data.message === 'No Match') {
                    setMessage('Current Passord Doesn\'t Match');
                }
            } catch (err) {
                console.log(err);
                setMessage('Error');
            }
        }
    }


    return (
        <>
            <h2>Edit Password</h2>
            <div className="profile-form">
                <label htmlFor="username">User Name</label>
                <input type="text" value={userName} disabled />
                <label htmlFor="currPass">Current Password</label>
                <input type="password" value={currPass} onChange={handleChange} />
                {/* {icon && (tick ? <Done /> : <Close />)} */}

                <label htmlFor="newPass">New Password</label>
                <input type="password" value={newPass} onChange={handleNewPass} />
                <label htmlFor="confirmPass">Confirm Password</label>
                <input type="password" value={confirmPass} onChange={handleConfirmPass} />
                <button onClick={handleSubmit} >Submit</button>
                <p>
                    {message}
                </p>

            </div>
        </>
    );
}

export default ChangePass;
