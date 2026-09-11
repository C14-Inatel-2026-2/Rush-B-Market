package com.rushbmarket.api.exception;

public class DuplicateWeaponException extends RuntimeException {
    public DuplicateWeaponException(String message) {
        super(message);
    }
}
