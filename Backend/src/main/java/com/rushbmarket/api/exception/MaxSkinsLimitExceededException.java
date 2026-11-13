package com.rushbmarket.api.exception;

public class MaxSkinsLimitExceededException extends RuntimeException {
    public MaxSkinsLimitExceededException(String message) {
        super(message);
    }
}
