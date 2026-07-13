package com.mytrackify.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MergeExperiencesRequest {
    @NotNull
    private Long primaryId;

    @NotNull
    private List<Long> duplicateIds;
}