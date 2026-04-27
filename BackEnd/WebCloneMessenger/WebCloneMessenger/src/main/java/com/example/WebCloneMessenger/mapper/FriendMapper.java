package com.example.WebCloneMessenger.mapper;

import com.example.WebCloneMessenger.DTO.FriendDTO;
import com.example.WebCloneMessenger.DTO.FriendDetailDTO;
import com.example.WebCloneMessenger.Model.Friend;
import com.example.WebCloneMessenger.Model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface FriendMapper {

    @Mapping(source = "id.userID1", target = "userID1")
    @Mapping(source = "id.userID2", target = "userID2")
    @Mapping(source = "createdDate", target = "createdDate")
    FriendDTO toDTO(Friend friend);

    @Mapping(target = "id", expression = "java(new FriendId(dto.getUserID1(), dto.getUserID2()))")
    @Mapping(source = "createdDate", target = "createdDate")
    Friend toEntity(FriendDTO dto);

    // ======================
    // Custom logic (phức tạp)
    // ======================
    @Named("toDetailDTO")
    default FriendDetailDTO toDetailDTO(Friend friend, Integer currentUserId) {
        if (friend == null) return null;

        User friendUser = currentUserId.equals(friend.getId().getUserID1())
                ? friend.getUser2()
                : friend.getUser1();

        if (friendUser == null) return null;

        FriendDetailDTO dto = new FriendDetailDTO();
        dto.setUserId(friendUser.getId());
        dto.setName(friendUser.getName());
        dto.setEmail(friendUser.getEmail());
        dto.setAvatarUrl(friendUser.getAvatarUrl());
        dto.setIsOnline(friendUser.getIsOnline());
        dto.setFriendCreatedDate(friend.getCreatedDate());

        return dto;
    }
}