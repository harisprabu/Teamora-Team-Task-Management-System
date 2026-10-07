package com.example.teamora.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.example.teamora.entity.PerformanceRating;

@Repository
public interface PerformanceRatingRepository extends JpaRepository<PerformanceRating, Long> {

    List<PerformanceRating> findByMemberIdOrderByDateDesc(Long memberId);

    List<PerformanceRating> findByTeamLeaderIdOrderByDateDesc(Long teamLeaderId);

    @Modifying
    @Transactional
    @Query("DELETE FROM PerformanceRating pr WHERE pr.member.id = :userId OR pr.teamLeader.id = :userId")
    void deleteByMemberIdOrTeamLeaderId(@Param("userId") Long userId);
}
