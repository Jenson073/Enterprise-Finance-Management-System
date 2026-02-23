package com.project2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChangePasswordDto {
	@NotBlank(message = "Should not be empty")
	@Size(min = 3,max = 12,message = "Password length should be between 3 and 12")
    private String oldPassword;
	@NotBlank(message = "Should not be empty")
	@Size(min = 3,max = 12,message = "Password length should be between 3 and 12")
    private String newPassword;
	public String getOldPassword() {
		return oldPassword;
	}
	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}
	public String getNewPassword() {
		return newPassword;
	}
	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

    
}