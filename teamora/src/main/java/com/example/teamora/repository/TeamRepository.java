package com.example.teamora.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.example.teamora.entity.Team;
import com.example.teamora.entity.User;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByTeamLeaderId(Long teamLeaderId);

    List<Team> findAllByTeamLeaderId(Long teamLeaderId);

    boolean existsByTeamName(String teamName);

    @Modifying
    @Transactional
    @Query("UPDATE Team t SET t.teamLeader = null WHERE t.teamLeader.id = :userId")
    void clearTeamLeader(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE Team t SET t.createdBy = :fallbackAdmin WHERE t.createdBy.id = :userId")
    void reassignCreatedTeams(@Param("userId") Long userId, @Param("fallbackAdmin") User fallbackAdmin);
}