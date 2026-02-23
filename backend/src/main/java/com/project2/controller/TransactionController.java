package com.project2.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project2.model.Transaction;
import com.project2.service.TransactionService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class TransactionController {

    @Autowired
    private TransactionService service;

    @GetMapping("/payments")
    public List<Transaction> get() {
        return service.get();
    }
    @GetMapping("/completed")
    public List<Transaction> getCompletedPayments() {
        return service.getCompleted();
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) throws IOException {
        return service.download(filename);
    }

    @PostMapping(value = "/addpayment", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Transaction post(
            @RequestPart("transaction") Transaction t,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {
        return service.post(t, file);
    }

    @PutMapping(value = "/payments/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Transaction update(
            @PathVariable Long id,
            @RequestPart("transaction") Transaction t,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {
        return service.update(id, t, file);
    }


    @DeleteMapping("/payments/{id}")
    public String delete(@PathVariable Long id) {
        return service.delete(id);
    }
}
