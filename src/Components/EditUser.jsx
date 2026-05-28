import React, { useEffect, useState } from 'react';
import { FormControl, FormGroup, InputLabel, Input, Button, styled, Typography } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, editUser } from '../service/api';

const Container = styled(FormGroup)`
    width: 50%;
    margin: 5% auto 0 auto;
    & > div {
        margin-top: 20px;
    }
`;

const initialValue = {
    id: '',
    name: '',
    username: '',
    email: '',
    phone: ''
};

const EditUser = () => {
    const [user, setUser] = useState(initialValue);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const response = await getUser(id);
        setUser(response.data);
    };

    const onValueChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const editUserDetails = async () => {
        await editUser(user, id);
        navigate('/all');
    };

    return (
        <Container>
            <Typography variant="h4">Edit User</Typography>
            <FormControl>
                <InputLabel>Name</InputLabel>
                <Input name="name" value={user.name} onChange={onValueChange} />
            </FormControl>

            <FormControl>
                <InputLabel>Username</InputLabel>
                <Input name="username" value={user.username} onChange={onValueChange} />
            </FormControl>

            <FormControl>
                <InputLabel>Email</InputLabel>
                <Input name="email" value={user.email} onChange={onValueChange} />
            </FormControl>

            <FormControl>
                <InputLabel>Phone</InputLabel>
                <Input name="phone" value={user.phone} onChange={onValueChange} />
            </FormControl>

            <FormControl>
                <Button variant="contained" onClick={editUserDetails}>Edit User</Button>
            </FormControl>
        </Container>
    );
};

export default EditUser;