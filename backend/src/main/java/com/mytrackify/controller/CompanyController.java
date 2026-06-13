package com.mytrackify.controller;

import com.mytrackify.dto.response.ApiResponse;
import com.mytrackify.entity.Company;
import com.mytrackify.service.CompanyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Company>>> getCompanies(
            @RequestParam(required = false) String sector,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy) {

        if (search != null && !search.isEmpty()) {
            List<Company> results = companyService.searchCompanies(search);
            return ResponseEntity.ok(ApiResponse.success(results));
        }

        Page<Company> companies = companyService.getCompanies(
                sector, PageRequest.of(page, size, Sort.by(sortBy)));
        return ResponseEntity.ok(ApiResponse.success(companies.getContent()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Company>> getCompany(@PathVariable Long id) {
        Company company = companyService.getCompanyById(id);
        return ResponseEntity.ok(ApiResponse.success(company));
    }
}
