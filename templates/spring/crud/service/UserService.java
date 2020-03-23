package com.example.api.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.api.domain.User;
import com.example.api.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    UserRepository repository;

    public List<User> getAllUsers() {
        List<User> userList = repository.findAll();

        if (userList.size() > 0) {
            return userList;
        } else {
            return new ArrayList<>();
        }
    }

    public User getUserById(Long id) throws NotFoundException {
        Optional<User> user = repository.findById(id);

        if (user.isPresent()) {
            return user.get();
        } else {
            throw new NotFoundException("No user record exist for given id");
        }
    }

    public User create(User user) {
        User newUser = repository.save(user);

        return newUser;
    }

    public User update(User user) throws NotFoundException {
        Optional<User> optionalUser = repository.findById(user.getId());

        if (optionalUser.isPresent()) {
            User newUser = optionalUser.get();

            newUser.setUsername(user.getUsername());
            newUser.setFirstName(user.getFirstName());
            newUser.setLastName(user.getLastName());

            newUser = repository.save(newUser);

            return newUser;
        } else {
            throw new NotFoundException("No user record exist for given id");
        }
    }

    public void deleteUserById(Long id) throws NotFoundException {
        Optional<User> user = repository.findById(id);

        if (user.isPresent()) {
            repository.deleteById(id);
        } else {
            throw new NotFoundException("No user record exist for given id");
        }
    }
}
