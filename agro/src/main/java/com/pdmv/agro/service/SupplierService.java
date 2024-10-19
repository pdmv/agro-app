package com.pdmv.agro.service;

import com.pdmv.agro.dto.request.SupplierRequest;
import com.pdmv.agro.dto.response.SupplierResponse;
import com.pdmv.agro.enums.ErrorCode;
import com.pdmv.agro.exception.AppException;
import com.pdmv.agro.mapper.SupplierMapper;
import com.pdmv.agro.pojo.Supplier;
import com.pdmv.agro.repository.SupplierRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SupplierService {
    SupplierRepository supplierRepository;
    SupplierMapper supplierMapper;

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public SupplierResponse create(SupplierRequest request) {
        if (Objects.isNull(request.getName())) {
            throw new AppException(ErrorCode.SUPPLIER_NAME_IS_NULL);
        }

        if (isExistedName(request.getName())) {
            throw new AppException(ErrorCode.SUPPLIER_NAME_EXISTED);
        }

        Supplier supplier = supplierMapper.toEntity(request);
        supplierRepository.save(supplier);

        return supplierMapper.toDto(supplier);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public SupplierResponse update(Integer supplierId, SupplierRequest request) {
        Supplier supplier = supplierRepository.getSuppliersById(supplierId)
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_ID_NOT_EXISTED));

        if (isExistedName(request.getName()) && !request.getName().equals(supplier.getName())) {
            throw new AppException(ErrorCode.SUPPLIER_NAME_EXISTED);
        }

        supplierMapper.partialUpdate(request, supplier);
        supplierRepository.save(supplier);

        return supplierMapper.toDto(supplier);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public List<SupplierResponse> getSuppliers(String name, String phoneNumber, Pageable pageable) {
        List<Supplier> suppliers;

        if ((name == null || name.isEmpty()) && (phoneNumber == null || phoneNumber.isEmpty())) {
            suppliers = supplierRepository.findAll(pageable).stream().toList();
        } else if (name != null && !name.isEmpty()) {
            suppliers = supplierRepository.findByNameContainingIgnoreCase(name, pageable);
        } else {
            suppliers = supplierRepository.findByPhoneNumberContainingIgnoreCase(phoneNumber, pageable);
        }

        return supplierMapper.toList(suppliers);
    }

    private boolean isExistedName(String name) {
        return supplierRepository.existsByName(name);
    }
}
