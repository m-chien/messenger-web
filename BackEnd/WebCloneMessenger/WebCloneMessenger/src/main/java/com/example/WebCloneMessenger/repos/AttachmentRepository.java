package com.example.WebCloneMessenger.repos;

import com.example.WebCloneMessenger.Model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface AttachmentRepository extends JpaRepository<Attachment, Integer> {

    Attachment findFirstByIdmessageId(Integer id);

    List<Attachment> findByIdmessage_IdIn(List<Integer> messageIds);

    @Modifying
    @Query(value = "UPDATE Attachment SET IDMessage = :messageId WHERE ID = :attachmentId", nativeQuery = true)
    int updateMessageId(@Param("attachmentId") Integer attachmentId, @Param("messageId") Integer messageId);

}
