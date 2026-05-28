import React, { useState } from 'react';
import { FormControl, FormGroup, InputLabel, Input, Button, styled } from "@mui/material";
import { useNavigate } from 'react-router-dom'; 
import { addUser, getUsers } from '../service/api';

// Keep your styled component
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

const AddUser = () => {
    const [user, setUser] = useState(initialValue);
    const navigate = useNavigate();

    const onValueChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
        console.log(user);
    };

    const addUserDetails = async () => {
          try {
        const response = await getUsers();
        const users = response.data;

        const maxId = users.length > 0
            ? Math.max(...users.map((u) => parseInt(u.id) || 0))
            : 0;

        const userWithId = {
            ...user,
            id: maxId + 1
        };

        await addUser(userWithId);
        navigate('/all');
    }
        catch (error) {
            console.error("Error adding user:", error);
        }
    };

    return (
        <Container>
            <FormControl>
                <InputLabel>Name</InputLabel>
                <Input onChange={onValueChange} name="name" value={user.name} />
            </FormControl>

            <FormControl>
                <InputLabel>Username</InputLabel>
                <Input onChange={onValueChange} name="username" value={user.username} />
            </FormControl>

            <FormControl>
                <InputLabel>Email</InputLabel>
                <Input onChange={onValueChange} name="email" value={user.email} />
            </FormControl>

            <FormControl>
                <InputLabel>Phone</InputLabel>
                <Input onChange={onValueChange} name="phone" value={user.phone} />
            </FormControl>

            <FormControl>
                <Button onClick={addUserDetails} variant="contained">Add User</Button>
            </FormControl>
        </Container>
    );
};

export default AddUser;