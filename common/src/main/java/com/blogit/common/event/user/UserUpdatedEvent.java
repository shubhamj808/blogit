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
public class UserUpdatedEvent extends BaseEvent<UserUpdatedEvent.UserUpdatedData> {
    
    public static final String EVENT_TYPE = "USER_UPDATED";
    
    public UserUpdatedEvent(UserUpdatedData data) {
        super(EVENT_TYPE);
        this.setData(data);
    }
    
    @Data
    @NoArgsConstructor
    public static class UserUpdatedData {
        private String userId;
        private String username;
        private String email;
        private String fullName;
        private String profileImage;
        private boolean isVerified;
        private boolean isActive;
    }
} 