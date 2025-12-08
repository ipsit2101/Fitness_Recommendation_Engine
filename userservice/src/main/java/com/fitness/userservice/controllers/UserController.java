package com.fitness.userservice.controllers;


import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(userService.register(registerRequest));
    }

    @GetMapping("/{userId}")
    ResponseEntity<UserResponse> getUserProfile(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @GetMapping("/{userId}/validate")
    ResponseEntity<Boolean> ValidateUser(@PathVariable String userId) {
        return ResponseEntity.ok(userService.existsByUserId(userId));
    }
}
