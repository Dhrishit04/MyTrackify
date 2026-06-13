package com.mytrackify.service;

import com.mytrackify.entity.Company;
import com.mytrackify.exception.ResourceNotFoundException;
import com.mytrackify.repository.CompanyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Page<Company> getCompanies(String sector, Pageable pageable) {
        return companyRepository.findBySectorOptional(sector, pageable);
    }

    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
    }

    public List<Company> searchCompanies(String query) {
        return companyRepository.findByNameContainingIgnoreCase(query);
    }

    public Company createCompany(Company company) {
        return companyRepository.save(company);
    }
}
