package com.example.teamora.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.example.teamora.entity.DailyFeedback;

@Repository
public interface DailyFeedbackRepository extends JpaRepository<DailyFeedback, Long> {

    List<DailyFeedback> findByMemberIdOrderByDateDesc(Long memberId);

    List<DailyFeedback> findByMemberIdInOrderByDateDesc(List<Long> memberIds);

    @Modifying
    @Transactional
    @Query("DELETE FROM DailyFeedback df WHERE df.member.id = :memberId")
    void deleteByMemberId(@Param("memberId") Long memberId);
}
