package com.gotacar.backend.models;

import java.time.LocalDate;
import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.Id;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User {
  @Id
  public String id;

  @NotBlank
  public String firstName;

  @NotBlank
  public String lastName;

  @NotBlank
  public String uid;

  @Email(message = "Invalid email")
  public String email;

  @Pattern(regexp = "[0-9]{8,8}[A-Z]", message = "Invalid dni number")
  public String dni;

  @URL(message = "Photo must be an url")
  public String profilePhoto;

  @Past(message = "Invalid birthdate")
  public LocalDate birthdate;

  public List<String> roles;

  public User() {
  }

  public User(String firstName, String lastName, String uid, String email, String dni, String profilePhoto,
      LocalDate birthdate, List<String> roles) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.uid = uid;
    this.email = email;
    this.dni = dni;
    this.profilePhoto = profilePhoto;
    this.birthdate = birthdate;
    this.roles = roles;

  }

  @Override
  public String toString() {
    return String.format("Customer[id=%s]", id);
  }
}