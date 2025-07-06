package com.blogit.common.event.user;

import com.blogit.common.event.BaseEvent;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UserRegisteredEvent extends BaseEvent<UserRegisteredEvent.UserRegisteredData> {
    
    public static final String EVENT_TYPE = "USER_REGISTERED";
    
    public UserRegisteredEvent(UserRegisteredData data) {
        super(EVENT_TYPE);
        this.setData(data);
    }
    
    @Data
    @NoArgsConstructor
    public static class UserRegisteredData {
        private String userId;
        private String username;
        private String email;
        private String fullName;
        private boolean isVerified;
    }
} 