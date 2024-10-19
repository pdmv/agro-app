package com.pdmv.agro.service;

import com.pdmv.agro.dto.request.PriceCreationRequest;
import com.pdmv.agro.dto.request.PriceUpdateRequest;
import com.pdmv.agro.dto.response.PriceListResponse;
import com.pdmv.agro.dto.response.PriceResponse;
import com.pdmv.agro.enums.ErrorCode;
import com.pdmv.agro.exception.AppException;
import com.pdmv.agro.mapper.PriceMapper;
import com.pdmv.agro.mapper.ProductImageMapper;
import com.pdmv.agro.mapper.ProductMapper;
import com.pdmv.agro.pojo.Price;
import com.pdmv.agro.pojo.Product;
import com.pdmv.agro.pojo.ProductImage;
import com.pdmv.agro.repository.PriceRepository;
import com.pdmv.agro.repository.ProductImageRepository;
import com.pdmv.agro.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional
public class PriceService {
    PriceRepository priceRepository;
    ProductRepository productRepository;
    ProductImageRepository productImageRepository;

    PriceMapper priceMapper;
    ProductImageMapper productImageMapper;
    CloudinaryService cloudinaryService;
    private final ProductMapper productMapper;

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public PriceResponse create(PriceCreationRequest request) {
        if (priceRepository.findByProduct_Id(request.getProductId()) != null) {
            throw new AppException(ErrorCode.PRICE_EXISTED);
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_ID_NOT_EXISTED));


        if ((request.getItemName() == null || request.getItemName().isEmpty())) {
            request.setItemName(product.getName());
        }
        if (request.getEffectiveDate() == null) {
            request.setEffectiveDate(LocalDate.now());
        }

        Price priceTable = Price.builder()
                .itemName(request.getItemName())
                .product(product)
                .price(request.getPrice())
                .effectiveDate(request.getEffectiveDate())
                .build();
        priceRepository.save(priceTable);

        Map uploadPrimaryImage = cloudinaryService.upload(request.getPrimaryImage());
        List<ProductImage> productImages = new ArrayList<>();

        ProductImage primaryImage = ProductImage.builder()
                .product(product)
                .imageUrl(uploadPrimaryImage.get("secure_url").toString())
                .publicId(uploadPrimaryImage.get("public_id").toString())
                .isPrimary(true)
                .build();
        productImages.add(primaryImage);

        if (request.getSecondaryImages() != null) {
            for(MultipartFile file : request.getSecondaryImages()) {
                Map uploadSecondaryImage = cloudinaryService.upload(file);
                ProductImage secondaryImage = ProductImage.builder()
                        .product(product)
                        .imageUrl(uploadSecondaryImage.get("secure_url").toString())
                        .publicId(uploadSecondaryImage.get("public_id").toString())
                        .isPrimary(false)
                        .build();
                productImages.add(secondaryImage);
            }
        }

        productImageRepository.saveAll(productImages);

        PriceResponse response = priceMapper.toPriceResponse(priceTable);
        response.setProductImages(productImageMapper.toListProductImageResponse(productImages));

        return response;
    }

    public PriceResponse getPrice(Integer id) {
        Price price = priceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRICE_ID_NOT_EXISTED));

        List<ProductImage> productImages = productImageRepository.findByProduct_Id(price.getProduct().getId());
        PriceResponse response = priceMapper.toPriceResponse(price);
        response.setProductImages(productImageMapper.toListProductImageResponse(productImages));

        return response;
    }

    public PriceResponse getProductPrice(Integer productId) {
        Price price = priceRepository.findByProduct_Id(productId);
        if (price == null) {
            throw new AppException(ErrorCode.PRODUCT_ID_NOT_EXISTED);
        }

        List<ProductImage> productImages = productImageRepository.findByProduct_Id(productId);
        PriceResponse response = priceMapper.toPriceResponse(price);
        response.setProductImages(productImageMapper.toListProductImageResponse(productImages));

        return response;
    }

    public List<PriceListResponse> listPrices(Map<String, Object> params, Pageable pageable) {
        Optional<String> itemName = Optional.ofNullable((String) params.get("itemName"));
        Optional<BigDecimal> minPrice = parseBigDecimal(params.get("minPrice"));
        Optional<BigDecimal> maxPrice = parseBigDecimal(params.get("maxPrice"));
        Optional<LocalDate> startDate = parseLocalDate(params.get("startDate"));
        Optional<LocalDate> endDate = parseLocalDate(params.get("endDate"));

        List<Price> prices;

        // Kiểm tra nếu có tên item
        if (itemName.isPresent()) {
            prices = priceRepository.findByItemNameContaining(itemName.get(), pageable);
        }
        // Kiểm tra nếu có phạm vi giá
        else if (minPrice.isPresent() && maxPrice.isPresent()) {
            prices = priceRepository.findByPriceBetween(minPrice.get(), maxPrice.get(), pageable);
        }
        // Kiểm tra nếu chỉ có giá tối thiểu
        else if (minPrice.isPresent()) {
            prices = priceRepository.findByPriceGreaterThanEqual(minPrice.get(), pageable);
        }
        // Kiểm tra nếu chỉ có giá tối đa
        else if (maxPrice.isPresent()) {
            prices = priceRepository.findByPriceLessThanEqual(maxPrice.get(), pageable);
        }
        // Kiểm tra nếu có phạm vi ngày
        else if (startDate.isPresent() && endDate.isPresent()) {
            prices = priceRepository.findByEffectiveDateBetween(startDate.get(), endDate.get(), pageable);
        }
        // Kiểm tra nếu chỉ có ngày bắt đầu
        else if (startDate.isPresent()) {
            prices = priceRepository.findByEffectiveDateAfter(startDate.get(), pageable);
        }
        // Kiểm tra nếu chỉ có ngày kết thúc
        else if (endDate.isPresent()) {
            prices = priceRepository.findByEffectiveDateBefore(endDate.get(), pageable);
        }
        // Mặc định trả về tất cả các giá với phân trang
        else {
            prices = priceRepository.findAll(pageable).stream().toList();
        }

        return prices.stream()
                .map(price -> PriceListResponse.builder()
                        .id(price.getId())
                        .product(productMapper.toDto(price.getProduct()))
                        .itemName(price.getItemName())
                        .price(price.getPrice())
                        .effectiveDate(price.getEffectiveDate())
                        .productPrimaryImage(productImageRepository
                                .findByProduct_IdAndIsPrimary(price.getProduct().getId(), true)
                                .getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public PriceResponse update(Integer id, PriceUpdateRequest request) {
        // Fetch the existing price
        Price existingPrice = priceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRICE_ID_NOT_EXISTED));

        // Fetch the associated product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_ID_NOT_EXISTED));

        existingPrice.setPrice(request.getPrice());
        existingPrice.setEffectiveDate(request.getEffectiveDate() != null ? request.getEffectiveDate() : LocalDate.now());
        existingPrice.setItemName(request.getItemName() != null && !request.getItemName().isEmpty() ? request.getItemName() : product.getName());

        List<ProductImage> existingImages = productImageRepository.findByProduct_Id(product.getId());
        List<ProductImage> updatedImages = new ArrayList<>();



        if (request.getPrimaryImage() != null) {
            log.info("Primary image is not null");
            existingImages.stream()
                    .filter(ProductImage::getIsPrimary)
                    .findFirst()
                    .ifPresent(existingPrimary -> {
                        cloudinaryService.deleteAsync(existingPrimary.getPublicId());
                        productImageRepository.delete(existingPrimary);
                    });

            Map uploadPrimaryImage = cloudinaryService.upload(request.getPrimaryImage());
            ProductImage newPrimaryImage = ProductImage.builder()
                    .product(product)
                    .imageUrl(uploadPrimaryImage.get("secure_url").toString())
                    .publicId(uploadPrimaryImage.get("public_id").toString())
                    .isPrimary(true)
                    .build();
            updatedImages.add(newPrimaryImage);
        }

        if (request.getSecondaryImages() != null) {
            existingImages.stream()
                    .filter(image -> !image.getIsPrimary())
                    .forEach(image -> {
                        cloudinaryService.deleteAsync(image.getPublicId());
                        productImageRepository.delete(image);
                    });

            for (MultipartFile file : request.getSecondaryImages()) {
                Map uploadSecondaryImage = cloudinaryService.upload(file);
                ProductImage secondaryImage = ProductImage.builder()
                        .product(product)
                        .imageUrl(uploadSecondaryImage.get("secure_url").toString())
                        .publicId(uploadSecondaryImage.get("public_id").toString())
                        .isPrimary(false)
                        .build();
                updatedImages.add(secondaryImage);
            }
        }

        productImageRepository.saveAll(updatedImages);

        priceRepository.save(existingPrice);

        PriceResponse response = priceMapper.toPriceResponse(existingPrice);
        response.setProductImages(productImageMapper.toListProductImageResponse(updatedImages));

        return response;
    }

    // Hàm để parse LocalDate từ params
    private Optional<LocalDate> parseLocalDate(Object date) {
        if (date == null) return Optional.empty();
        return Optional.of(LocalDate.parse((String) date));
    }

    // Hàm để parse BigDecimal từ params
    private Optional<BigDecimal> parseBigDecimal(Object value) {
        if (value == null) return Optional.empty();
        return Optional.of(new BigDecimal(value.toString()));
    }
}
