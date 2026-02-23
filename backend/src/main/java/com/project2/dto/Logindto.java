package com.project2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class Logindto {
	@NotBlank(message = "Enter a valid username")
	@Size(min=3,max = 12,message = "Username length should be between 3 and 12")
    private String username;
	@NotBlank(message = "Enter a valid password")
    private String password;

    public Logindto() {}

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}