package com.apurva.crud.service;

import com.apurva.crud.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    User saveUser(User user);

    List<User> getAllUsers();

    Optional<User> getUserById(Long id);

    User updateUser(Long id,User user);

    void deleteUser(Long id);

}
