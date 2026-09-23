package com.apurva.crud.service;

import com.apurva.crud.repository.UserRepository;
import com.apurva.crud.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    public  UserServiceImpl(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public User saveUser(User user){
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id){
        return userRepository.findById(id);
    }


    @Override
    public User updateUser(Long id, User user){
        Optional<User> existingUser = userRepository.findById(id);

        if(existingUser.isPresent()){
            User updateUser = existingUser.get();

            updateUser.setName(user.getName());
            updateUser.setEmail(user.getEmail());
            updateUser.setDepartment(user.getDepartment());
            updateUser.setSalary(user.getSalary());

            return userRepository.save(updateUser);
        }
        return null;
    }

    @Override
    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }
}
