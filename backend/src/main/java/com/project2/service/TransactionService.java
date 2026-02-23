package com.project2.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project2.model.Transaction;
import com.project2.repo.TransactionRepo;

@Service
public class TransactionService {

    private static final String UPLOAD_DIR = "uploads";
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final List<String> ALLOWED_TYPES = List.of(
            "application/pdf",
            "text/csv",
            "image/jpeg",
            "image/jpg",
            "image/png"
    );
    @Autowired
    private TransactionRepo transactions;

    private final Path uploadPath = Paths.get(UPLOAD_DIR);

    public List<Transaction> get() {
        return transactions.findAll();
    }
    public List<Transaction> getCompleted() {
        return transactions.findByStatus("COMPLETED"); // COMPLETED
    }


    /* ================= POST ================= */
    public Transaction post(Transaction t, MultipartFile file) throws IOException {

        if (file != null && !file.isEmpty()) {
        	validateFile(file);
            Files.createDirectories(uploadPath);

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            t.setFileName(fileName);
            t.setFilePath(filePath.toString());
        }

        return transactions.save(t);
    }

    /* ================= DOWNLOAD ================= */
    public ResponseEntity<Resource> download(String filename) throws IOException {

        Path path = uploadPath.resolve(filename);
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + resource.getFilename() + "\""
                )
                .body(resource);
    }

    /* ================= UPDATE (WITH FILE) ================= */
    public Transaction update(Long id, Transaction t, MultipartFile file) throws IOException {

        return transactions.findById(id)
            .map(existing -> {

                existing.setAmt(t.getAmt());
                existing.setCategory(t.getCategory());
                existing.setDescription(t.getDescription());
                existing.setDue(t.getDue());
                existing.setStatus(t.getStatus());

                if (file != null && !file.isEmpty()) {
                    try {
                    	validateFile(file);
                        Files.createDirectories(uploadPath);

                        // delete old file (non-fatal if fails)
                        if (existing.getFileName() != null) {
                            try {
                                Files.deleteIfExists(uploadPath.resolve(existing.getFileName()));
                            } catch (IOException ex) {
                                System.err.println("Old file delete failed: " + ex.getMessage());
                            }
                        }

                        String original =
                            file.getOriginalFilename() != null
                                ? file.getOriginalFilename()
                                : "uploaded_file";

                        String fileName = System.currentTimeMillis() + "_" + original;
                        Path filePath = uploadPath.resolve(fileName);

                        Files.copy(
                            file.getInputStream(),
                            filePath,
                            StandardCopyOption.REPLACE_EXISTING
                        );

                        existing.setFileName(fileName);
                        existing.setFilePath(filePath.toString());

                    } catch (IOException e) {
                        throw new RuntimeException("File update failed", e);
                    }
                }

                return transactions.save(existing);
            })
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }


    /* ================= DELETE ================= */
    public String delete(Long id) {

        return transactions.findById(id)
            .map(existing -> {
                try {
                    if (existing.getFileName() != null) {
                        Files.deleteIfExists(uploadPath.resolve(existing.getFileName()));
                    }
                } catch (IOException e) {
                    throw new RuntimeException("File delete failed", e);
                }

                transactions.deleteById(id);
                return "Transaction is deleted";
            })
            .orElse("Transaction with the id is not found");
    }
    private void validateFile(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds 5MB limit");
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new RuntimeException("Invalid file type. Allowed: PDF, CSV, JPG, PNG");
        }
    }

}

